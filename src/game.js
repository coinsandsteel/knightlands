import SocketCluster from "socketcluster-client";
import pify from "pify";
import Vue from "vue";
import CharacterModel from "./character_model";
import ItemDatabase from "./item_database";
import Inventory from "./inventory";
import CraftingRecipes from "./crafting_recipes.json";
import Crafting from "./crafting";
import Events from "./../knightlands-shared/events";
import Config from "./config";
import {
    player as PlayerExpTable
} from "./expTables.json";
const Operations = require("./../knightlands-shared/operations");
import CurrencyType from "@/../knightlands-shared/currency_type";
import DisconnectCodes from "@/../knightlands-shared/disconnectCodes";

class Game {
    constructor(store) {
        this.Ready = "ready";
        this.SignUp = "signup";
        this.SignedOut = "signed_out";
        this.Disconnected = "disconnected";
        this.WalletSignedIn = "wallet_sign_in";
        this.WalletSignedOut = "wallet_sign_out";
        this.WalletChanged = "wallet_changed";
        this.$store = store;
        this._items = new ItemDatabase();
        this._expTable = PlayerExpTable;
        this._requestInProgress = false;

        this._vm = new Vue({
            data: () => ({
                authenticated: false,
                softCurrency: 0,
                hardCurrency: 0,
                questsProgress: {},
                account: undefined,
                ready: false,
                walletReady: false,
                load: false
            })
        });

        this._inventory = new Inventory(this._items);
        this._crafting = new Crafting(CraftingRecipes, this._inventory);
        this._serverTimeDiff = 0;

        var options = {
            hostname: Config.gameServerEndpoint,
            secure: process.env.NODE_ENV == "production" || process.env.NODE_ENV == "test",
            autoConnect: false,
            port: Config.gameServerPort,
            rejectUnauthorized: false, // Only necessary during debug if using a self-signed certificate
            connectTimeout: 5000,
            ackTimeout: 5000,
            autoReconnectOptions: {
                initialDelay: 5000,
                randomness: 5000,
                multiplier: 1.5,
                maxDelay: 15000
            }
        };

        this._socket = SocketCluster.create(options);

        this._socket.on("connect", this._handleConnection.bind(this));
        this._socket.on("disconnect", this._handleDisconnect.bind(this));
        this._socket.on("authStateChange", this._handleAuthentication.bind(this));

        this._socket.on(Events.InventoryUpdate, this._handleInventoryUpdate.bind(this));
        this._socket.on(Events.RaidSummonStatus, this._handleRaidStatus.bind(this));
        this._socket.on(Events.RaidJoinStatus, this._handleRaidJoinStatus.bind(this));
        this._socket.on(Events.CraftingStatus, this._handleCraftStatus.bind(this));
        this._socket.on(Events.TimerRefilled, this._handleTimerRefilled.bind(this));
        this._socket.on(Events.ChestOpened, this._handleChestOpened.bind(this));
        this._socket.on(Events.ItemEnchanted, this._handleItemEnchanted.bind(this));

        // let's avoid using callbacks
        this._emitFn = pify(this._socket.emit);

        // pass socket to make character model listen to certain events
        this._character = new CharacterModel(this._socket, this);
        Vue.prototype.$character = this._character;
    }

    get isAdmin() {
        return this.account === "TL58CLCzVVr9x4GoBPDxz7VW3Hko9oqrGi";
    }

    hasWallet() {
        return !!this._blockchainClient;
    }

    get itemsDB() {
        return this._items;
    }

    get crafting() {
        return this._crafting;
    }

    get inventory() {
        return this._inventory;
    }

    get load() {
        return this._vm.load;
    }

    get hasPremiumAccount() {
        return false;
    }

    walletReady() {
        return this._vm.walletReady;
    }

    get authenticated() {
        return this._vm.authenticated;
    }

    get softCurrency() {
        return this.inventory.getCurrency(CurrencyType.Soft);
    }

    set softCurrency(value) {
        this.inventory.setCurrency(CurrencyType.Soft, value);
    }

    get hardCurrency() {
        return this.inventory.getCurrency(CurrencyType.Hard);
    }

    get ready() {
        return this._vm.ready;
    }

    get account() {
        return this._vm.account;
    }

    get character() {
        return this._character;
    }

    get blockchainClient() {
        return this._blockchainClient;
    }

    get now() {
        return new Date().getTime() + this._serverTimeDiff;
    }

    set blockchain(value) {
        this._blockchainClient = value;

        if (this._blockchainClient.isReady()) {
            this._vm.walletReady = true;
            this._vm.account = this._blockchainClient.getAddress();
        }

        setInterval(() => {
            if (this._blockchainClient.isReady()) {
                this._vm.walletReady = true;

                if (!this._vm.account) {
                    this._vm.account = this._blockchainClient.getAddress();
                } else if (this._vm.account !== this._blockchainClient.getAddress()) {
                    this.logout();
                    this._vm.account = this._blockchainClient.getAddress();
                    this._vm.$emit(this.WalletChanged, this._blockchainClient.getAddress());
                }
            } else {
                this._vm.walletReady = false;
            }
        }, 100);
    }

    on(event, callback) {
        this._vm.$on(event, callback);
    }

    off(event, callback) {
        this._vm.$off(event, callback);
    }

    shortAccount(account) {
        if (!account) {
            account = this.account;
        }
        return `${account.substr(
            0,
            4
        )}...${account.substr(-4)}`;
    }

    connect() {
        this._socket.connect();
    }

    openRefill(stat) {
        this._vm.$emit("refill", stat);
    }

    async signMessage(message) {
        return await this._blockchainClient.sign(message);
    }

    async signIn() {
        const publicAddress = this.account;

        return new Promise(async (resolve, reject)=>{
            try {
                // get nonce first
                let nonce = await this._request(Operations.Auth, {
                    address: publicAddress
                });
                // sign message
                let message = await this._blockchainClient.sign(nonce);
    
                // send signed message
                await this._request(Operations.Auth, {
                    address: publicAddress,
                    message: message
                });

                resolve();
            } catch (exc) {
                // signing was rejected
                console.log("signIn", exc);
    
                if (exc.message && exc.message.includes("not unlocked")) {
                    //reset walletReady
                    this._vm.walletReady = false;
                }

                reject();
            }
        });
    }

    async purchaseIAP(iap, paymentId, price, signature) {
        let tx = await this._blockchainClient.purchaseIAP(iap, paymentId, price, signature);
        await this.sendPayment(paymentId, tx);
    }

    async sendPayment(paymentId, signedTransaction) {
        return await this._request(Operations.SendPayment, {
            paymentId,
            signedTransaction
        });
    }

    _handleAuthentication(data) {
        let signedIn = data.newState == "authenticated";

        if (signedIn && !this._vm.authenticated) {
            this._vm.authenticated = true;
            this._vm.$emit(this.SignUp);

            this._syncTime();
        } else if (!signedIn && this._vm.authenticated) {
            this._vm.authenticated = false;
            this._vm.$emit(this.SignedOut);
        }
    }

    async _handleConnection(data) {
        if (data.isAuthenticated) {
            await this.updateUserData();
        }
        
        this._vm.ready = true;
        this._vm.$emit(this.Ready, data.isAuthenticated);
    }

    _handleDisconnect(errorCode) {
        if (errorCode == DisconnectCodes.OtherClientSignedIn) {
            this.logout();
        } else if (errorCode == DisconnectCodes.NotAllowed) {
            this.logout();
        }

        this._vm.$emit(this.Disconnected);
    }

    async _request(command, ...args) {
        try {
            if (args.length == 0) {
                return await this._emitFn.call(this._socket, command, args);
            } else {
                return await this._emitFn.call(this._socket, command, ...args);
            }
        } catch (exc) {
            throw exc;
        }
    }

    logout() {
        this._socket.deauthenticate();
        this._socket.disconnect();
        this._inventory.clear();
    }

    // EVENTS
    _handleInventoryUpdate(data) {
        this._inventory.mergeData(data);
    }

    _handleRaidJoinStatus(data) {
        this._vm.$emit(Events.RaidJoinStatus, data);
    }

    _handleRaidStatus(data) {
        const { iap, reason, context } = data;

        Vue.notify({
            group: "raid",
            data: {
                iap,
                context,
                success: reason ? false : true,
            },
            duration: 2000
        });

        this._vm.$emit(Events.RaidSummonStatus, data);
    }

    _handleCraftStatus(data) {
        const { iap, reason, context } = data;

        // Vue.notify({
        //     group: "raid",
        //     data: {
        //         iap,
        //         context,
        //         success: reason ? false : true,
        //     },
        //     duration: -1
        // });

        this._vm.$emit(Events.CraftingStatus, data);
    }

    _handleTimerRefilled(data) {
        const { context } = data;
        this._character.refillTimer(context);
        this._vm.$emit(Events.TimerRefilled, data);
    }

    _handleChestOpened(data) {
        this._vm.$emit(Events.ChestOpened, data);
    }

    _handleItemEnchanted(data) {
        this._vm.$emit(Events.ItemEnchanted, data);
    }

    _mergeData(data) {
        let {
            changes,
            removals
        } = data;

        if (changes.character) {
            if (this.character.level < changes.character.level) {
                this._vm.$emit('level-up');
            }
            
            this.character.mergeData(changes.character);
        }
        

        if (removals) {
            this.character.removeData(removals.character);
        }

        if (changes.questsProgress) {
            for (let zone in changes.questsProgress.zones) {
                let quests = changes.questsProgress.zones[zone];
                let zoneData = this._vm.questsProgress.zones[zone];
                if (!zoneData) {
                    zoneData = {};
                    Vue.set(this._vm.questsProgress.zones, zone, zoneData);
                }

                for (let quest in quests) {
                    let stages = quests[quest];
                    let stagesData = zoneData[quest];
                    if (!stagesData) {
                        stagesData = {};
                        Vue.set(zoneData, quest, stagesData);
                    }

                    for (let stage in stages) {
                        let stageData = stagesData[stage];
                        if (!stageData) {
                            stageData = {
                                hits: 0
                            };
                            Vue.set(stagesData, stage, stageData);
                        }
                        
                        stageData.hits = stages[stage].hits;
                    }
                }
            }

            for (let zone in changes.questsProgress.bosses) {
                let stages = changes.questsProgress.bosses[zone];
                let zoneData = this._vm.questsProgress.bosses[zone];
                if (!zoneData) {
                    zoneData = {};
                    Vue.set(this._vm.questsProgress.bosses, zone, zoneData);
                }

                for (let stage in stages) {
                    let stageData = zoneData[stage];
                    if (!stageData) {
                        stageData = {
                            damageRecieved: 0,
                            unlocked: false
                        };
                        Vue.set(zoneData, stage, stageData);
                    }

                    stageData.damageRecieved = stages[stage].damageRecieved;
                    if (stages[stage].unlocked !== undefined) {
                        stageData.unlocked = stages[stage].unlocked;
                    }
                }
            }

            for (let zone in changes.questsProgress.completedRecords) {
                let stages = changes.questsProgress.completedRecords[zone];
                for (let stage in stages) {
                    this.getZoneCompletedRecords(zone, stage)[stage] = stages[stage];
                }
            }
        }

        if (changes.hasOwnProperty("softCurrency")) {
            this._vm.softCurrency = changes.softCurrency;
        }

        if (changes.hasOwnProperty("hardCurrency")) {
            this._vm.hardCurrency = changes.hardCurrency;
        }
    }

    async updateUserData() {
        try {
            let info = await this._request(Operations.GetUserInfo);
            this._character.assignData(info.character);
            this._inventory.load(info.inventory);

            if (info.questsProgress) {
                this._vm.$set(this._vm, "questsProgress", info.questsProgress);
            }

            this._vm.softCurrency = info.softCurrency;
            this._vm.hardCurrency = info.hardCurrency;

            this._vm.load = true;
        } catch (exc) {
            console.error("updateUserData", exc);
        }
    }

    getRequiredExperience(level) {
        return this._expTable[level - 1];
    }

    getZoneCompletedRecords(zone, stage) {
        let stages = this._vm.questsProgress.completedRecords[zone];
        if (!stages) {
            stages = {};
            this._vm.$set(this._vm.questsProgress.completedRecords, zone, stages);
        }

        let record = stages[stage];
        if (!record) {
            this._vm.$set(stages, stage, false);
        }

        return stages;
    }

    isZoneLocked(zone) {
        // check if previous zone 0 stage is unlocked
        return this.getZoneLocked(zone, 0);
    }

    getZoneLocked(zone, stage) {
        // check if previous zone is complete
        if (!stage) {
            stage = this.$store.getters.getZoneStage;
        }

        // zones is an array sorted by id, id starts from 1, thus -2 to get previous zone
        let previousZone = this._zones[zone - 2];
        if (!previousZone) {
            return false;
        }

        return !this.getZoneCompletedRecords(previousZone._id, stage)[stage];
    }

    getQuestBossProgress(zone, stage) {
        if (!stage) {
            stage = this.$store.getters.getZoneStage;
        }

        let stages = this._vm.questsProgress.bosses[zone];
        if (!stages) {
            stages = {};
            this._vm.$set(this._vm.questsProgress.bosses, zone, stages);
        }

        let progress = stages[stage];
        if (!progress) {
            progress = {
                damageRecieved: 0
            };
            this._vm.$set(stages, stage, progress);
        }

        return progress;
    }

    getZoneStageStatuses(zone) {
        let questData = this._zones[zone - 1].quests[0];
        let stages = [];
        let previousCompletedStage = -1;
        for (let stage in questData.stages) {
            let status = this.getZoneCompletedRecords(zone, stage)[stage];
            if (status) {
                previousCompletedStage = stage;
            }
            stages.push(status);
            if (stages.length == 1 || previousCompletedStage == stage - 1) {
                stages[stage] = true;
            }
        }
        return stages;
    }

    getQuestProgress(zone, questId) {
        let stage = this.$store.getters.getZoneStage;
        let questData = this._zones[zone - 1].quests[questId];
        if (questData.boss) {
            let progress = this.getQuestBossProgress(zone);
            let maxProgress = questData.stages[stage].health;
            return {
                max: maxProgress,
                current: progress.damageRecieved || 0
            }
        }

        let quests = this._vm.questsProgress.zones[zone];
        if (!quests) {
            quests = {};
            this._vm.$set(this._vm.questsProgress.zones, zone, quests);
        }

        let stages = quests[questId];
        if (!stages) {
            stages = {};
            this._vm.$set(quests, questId, stages);
        }

        let progress = stages[stage];
        if (!progress) {
            progress = {
                hits: 0
            };
            this._vm.$set(stages, stage, progress);
        }

        return {
            max: questData.stages[stage].hits,
            current: progress.hits
        };
    }

    async getZonesData() {
        if (!this._zones) {
            let zones = await this._request(Operations.GetQuestData);
            zones.sort((a, b) => {
                return a._id > b._id ? 1 : a._id < b._id ? -1 : 0;
            });

            this._zones = zones;
        }
        return this._zones;
    }

    createChannel(name, waitForAuth = true) {
        return this._socket.subscribe(name, {
            waitForAuth
        });
    }

    /*
        Server Operations
    */
    async _wrapOperation(operation, ...args) {
        try {
            let result = await this._request(operation, ...args);
            this._mergeData(result.changes);
            return result;
        } catch (exc) {
            console.log(exc);
            throw exc;
        }
    }

    async _syncTime() {
        if (!this.authenticated) {
            return;
        }

        try {
            let serverTime = await this._request(Operations.SyncTime);
            this._serverTimeDiff = serverTime.time - this.now;
        } catch (exc) {
            console.error(exc);
        }
        setTimeout(this._syncTime.bind(this), 5000);
    }

    async resetZone(zone) {
        zone = zone * 1;
        let stage = this.$store.getters.getZoneStage;
        await this._wrapOperation(Operations.ResetZone, {
            zone,
            stage
        });
    }

    async engageQuest(zone, questIndex, max = false) {
        let stage = this.$store.getters.getZoneStage;
        let result = await this._wrapOperation(Operations.EngageQuest, {
            zone,
            questIndex,
            stage,
            max
        });
        return result.response;
    }

    async equipItem(itemId) {
        await this._wrapOperation(Operations.EquipItem, {
            itemId
        });
    }

    async unequipItem(slot) {
        await this._wrapOperation(Operations.UnequipItem, {
            slot
        });
    }

    async buyStats(newStats) {
        await this._wrapOperation(Operations.BuyStat, newStats);
    }

    async attackQuestBoss(zone, stage) {
        await this._wrapOperation(Operations.AttackQuestBoss, {
            zone,
            stage
        });
    }

    async claimRaidLoot(raidId) {
        return await this._wrapOperation(Operations.ClaimRaidLoot, {
            raidId
        });
    }

    async attackRaidBoss(raidId, hits) {
        await this._wrapOperation(Operations.AttackRaidBoss, {
            raidId,
            hits
        });
    }

    async useItem(itemId) {
        let response = await this._wrapOperation(Operations.UseItem, {
            itemId
        });
        return response.response;
    }

    async refillTimer(stat, refillType, items) {
        let response = await this._wrapOperation(Operations.RefillTimer, {
            stat,
            refillType,
            items
        });

        return response.response;
    }

    async fetchCurrentRaids() {
        return await this._request(Operations.FetchRaidsList);
    }

    async fetchRaidJoinStatus(raidId) {
        return await this._request(Operations.FetchRaidJoinStatus, {
            raidId
        });
    }

    async joinRaid(raidId) {
        return await this._request(Operations.JoinRaid, {
            raidId
        });
    }

    async fetchRaid(raidId) {
        return await this._request(Operations.FetchRaidInfo, {
            raidId
        });
    }

    async fetchRaidSummonStatus(raid, stage) {
        return await this._request(Operations.FetchRaidSummonStatus, {
            raid, stage
        });
    }

    async summonRaid(raid, stage) {
        return await this._request(Operations.SummonRaid, {
            raid,
            stage
        });
    }

    async getCurrencyConversionRate() {
        return await this._request(Operations.GetCurrencyConversionRate);
    }

    async upgradeItem(itemId, materialId, count) {
        let response = await this._wrapOperation(Operations.UpgradeItem, {
            itemId, materialId, count
        });

        return response.response;
    }

    async unbindItem(itemId, items) {
        let response = await this._wrapOperation(Operations.UnbindItem, {
            itemId,
            items
        });

        return response.response;
    }

    async craftRecipe(recipeId, currency) {
        let response = await this._wrapOperation(Operations.CraftItem, {
            recipeId,
            currency
        });

        return response.response;
    }

    async fetchCraftingStatus(recipeId) {
        return await this._request(Operations.FetchCraftingStatus, {
            recipeId
        });
    }

    async fetchTimerRefillStatus(stat) {
        return await this._request(Operations.FetchRefillTimerStatus, {
            stat
        });
    }

    async getTimerRefillInfo(stat) {
        return await this._request(Operations.GetTimerRefillInfo, {
            stat
        });
    }

    async openChest(chest, iap) {
        let response = await this._wrapOperation(Operations.OpenChest, {
            chest,
            iap
        });

        return response.response;
    }

    async getchChestOpenStatus(chest) {
        return await this._request(Operations.FetchChestOpenStatus, {
            chest
        });
    }

    async getChestsStatus() {
        let response = await this._wrapOperation(Operations.GetChestsStatus);
        return response.response;
    }

    async enchantItem(itemId, currency) {
        let response = await this._wrapOperation(Operations.EnchantItem, {
            itemId,
            currency
        });

        return response.response;
    }

    async fetchEnchantingStatus(itemId) {
        return await this._request(Operations.FetchEnchantingStatus, {
            itemId
        });
    } 
}

export default Game;