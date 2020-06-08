/*jshint esversion: 9 */

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
import { player as PlayerExpTable } from "./expTables.json";
const Operations = require("./../knightlands-shared/operations");
import CurrencyType from "@/../knightlands-shared/currency_type";
import DisconnectCodes from "@/../knightlands-shared/disconnectCodes";
import Classes from "@/classes";
import TrialCardsResolver from "@/../knightlands-shared/trial_cards_resolver";
import TrialsMeta from "@/trials_meta";
import ArmyDB from "@/army/armyDB";
import Army from "@/army/army";

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
        this._armyDb = new ArmyDB(this._items.itemStatResolver);
        this._army = new Army(this, this._armyDb);
        this._expTable = PlayerExpTable;
        this._requestInProgress = false;

        this._vm = new Vue({
            data: () => ({
                classInited: false,
                authenticated: false,
                questsProgress: {},
                account: undefined,
                ready: false,
                walletReady: false,
                loaded: false,
                beast: {},
                towerFreeAttempts: 0,
                rank: 0,
                trials: {},
                goldExchange: {},
                dailyQuests: {}
            })
        });

        this._inventory = new Inventory(this._items);
        this._crafting = new Crafting(CraftingRecipes, this._inventory);
        this._serverTimeDiff = 0;

        var options = {
            hostname: Config.gameServerEndpoint,
            secure:
                process.env.NODE_ENV == "production" || process.env.NODE_ENV == "test",
            autoConnect: false,
            port: Config.gameServerPort,
            connectTimeout: 10000,
            ackTimeout: 10000,
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

        this._socket.on(
            Events.InventoryUpdate,
            this._handleInventoryUpdate.bind(this)
        );
        this._socket.on(Events.RaidSummonStatus, this._handleRaidStatus.bind(this));
        this._socket.on(
            Events.RaidJoinStatus,
            this._handleRaidJoinStatus.bind(this)
        );
        this._socket.on(Events.CraftingStatus, this._handleCraftStatus.bind(this));
        this._socket.on(Events.TimerRefilled, this._handleTimerRefilled.bind(this));
        this._socket.on(Events.ChestOpened, this._handleChestOpened.bind(this));
        this._socket.on(Events.UnitSummoned, this._handleArmySummoned.bind(this));
        this._socket.on(Events.ItemEnchanted, this._handleItemEnchanted.bind(this));
        this._socket.on(Events.BuffApplied, this._handleBuffApplied.bind(this));
        this._socket.on(Events.BuffUpdate, this._handleBuffUpdate.bind(this));
        this._socket.on(Events.ItemPurchased, this._handleItemPurchased.bind(this));
        this._socket.on(
            Events.TrialAttemptsPurchased,
            this._handleTrialAttemptsPurchase.bind(this)
        );
        this._socket.on(
            Events.TowerAttemptsPurchased,
            this._handleTowerAttemptsPurchase.bind(this)
        );
        this._socket.on(
            Events.GoldExchangeBoostPurchased,
            this._handleGoldExchangeBoosted.bind(this)
        );
        this._socket.on(
            Events.DivTokenWithdrawal,
            this._handleDivTokenWithdrawal.bind(this)
        );

        // let's avoid using callbacks
        this._emitFn = pify(this._socket.emit);

        // pass socket to make character model listen to certain events
        this._character = new CharacterModel(this._socket, this);

        Vue.prototype.$character = this._character;
    }

    dailyRewardStep() {
        return this._vm.dailyRewardStep;
    }

    beast() {
        return this._vm.beast;
    }

    rank() {
        return this._vm.rank;
    }

    getTrialState(trialType) {
        return this._vm.trials[trialType];
    }

    getTrialsCard() {
        return this._vm.trials.cards;
    }

    getGoldExchange() {
        return this._vm.goldExchange;
    }

    dailyQuests() {
        return this._vm.dailyQuests;
    }

    get trialCardsResolver() {
        return this._trialCardsResolver;
    }

    get isAdmin() {
        return this.account === "TL58CLCzVVr9x4GoBPDxz7VW3Hko9oqrGi";
    }

    hasWallet() {
        return this._blockchainClient.isInited();
    }

    get itemsDB() {
        return this._items;
    }

    get armyDB() {
        return this._armyDb;
    }

    get army() {
        return this._army;
    }

    get crafting() {
        return this._crafting;
    }

    get inventory() {
        return this._inventory;
    }

    get load() {
        return this._vm.loaded;
    }

    get hasPremiumAccount() {
        return false;
    }

    walletReady() {
        return this._vm.walletReady;
    }

    towerFreeAttempts() {
        return this._vm.towerFreeAttempts;
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

    get dkt() {
        return this.inventory.getCurrency(CurrencyType.Dkt);
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

    get nowSec() {
        return Math.floor(this.now / 1000);
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
                    this._vm.$emit(
                        this.WalletChanged,
                        this._blockchainClient.getAddress()
                    );
                }
            } else {
                this._vm.walletReady = false;
            }
        }, 500);
    }

    on(event, callback) {
        this._vm.$on(event, callback);
    }

    off(event, callback) {
        this._vm.$off(event, callback);
    }

    removeAllListeners(evt) {
        this._vm.$off(evt);
    }

    shortAccount(account) {
        if (!account) {
            account = this.account;
        }
        return `${account.substr(0, 4)}...${account.substr(-4)}`;
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

        return new Promise(async (resolve, reject) => {
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

    async purchaseIAP(iap, paymentId, price, nonce, timestamp, signature) {
        let tx = await this._blockchainClient.purchaseIAP(
            iap,
            paymentId,
            price,
            nonce, 
            timestamp,
            signature
        );
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

    _handleBuffApplied(data) {
        this._character.applyBuff(data);
    }

    _handleBuffUpdate(data) {
        // this._character.mergeData(data);
    }

    _handleItemPurchased(data) {
        this._vm.$emit(Events.ItemPurchased, data);
    }

    _handleTrialAttemptsPurchase(data) {
        this.getTrialState(data.context.trialType).attempts += data.context.count;
        this._vm.$emit(Events.TrialAttemptsPurchased, data);
    }

    _handleTowerAttemptsPurchase(data) {
        this._vm.$emit(Events.TowerAttemptsPurchased, data);
    }

    _handleGoldExchangeBoosted(data) {
        this.mergeObjects(this._vm, this._vm.goldExchange, data.context);
        this._vm.$emit(Events.GoldExchangeBoostPurchased, data);
    }

    _handleDivTokenWithdrawal(data) {
        this._inventory.setCurrency(CurrencyType.Dkt, data.dkt);
        this._vm.$emit(Events.DivTokenWithdrawal, data);
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
                success: reason ? false : true
            },
            duration: 2000
        });

        this._vm.$emit(Events.RaidSummonStatus, data);
    }

    _handleCraftStatus(data) {
        const { iap, reason, context } = data;
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

    _handleArmySummoned(data) {
        this._vm.$emit(Events.UnitSummoned, data);
    }

    _handleItemEnchanted(data) {
        this._vm.$emit(Events.ItemEnchanted, data);
    }

    _checkClassChoice() {
        if (!this._vm.classInited) {
            if (Classes.find(x => x.minLevel <= this.character.level)) {
                this._vm.$emit("change-class");
            }
        }
    }

    mergeObjects(vm, currentData, newData) {
        for (let i in newData) {
            const newField = newData[i];

            if (Array.isArray(newData[i])) {
                currentData[i] = newData[i];
                continue;
            }

            if (typeof newField == "object") {
                if (currentData.hasOwnProperty(i)) {
                    this.mergeObjects(vm, currentData[i], newField);
                } else {
                    vm.$set(currentData, i, newField);
                }
            } else {
                vm.$set(currentData, i, newField);
            }
        }
    }

    mergeRemoval(vm, currentData, removedFields) {
        for (let i in removedFields) {
            if (typeof removedFields[i] == "object") {
                this.mergeRemoval(vm, currentData[i], removedFields[i]);
            } else {
                vm.$delete(currentData, i);
            }
        }
    }

    _removeData(removals) {
        if (!removals) {
            return;
        }

        if (removals.character) {
            this.character.removeData(removals.character);
        }

        if (removals.trials) {
            this.mergeRemoval(this._vm, this._vm.trials, removals.trials);
        }
    }

    _mergeData(changes) {
        if (changes.classInited) {
            this._vm.classInited = changes.classInited;
        }

        if (changes.character) {
            if (this.character.level < changes.character.level) {
                this._vm.$emit("level-up");
            }

            this.character.mergeData(changes.character);

            this._checkClassChoice();
        }

        if (changes.goldExchange) {
            this.mergeObjects(this._vm, this._vm.goldExchange, changes.goldExchange);
        }

        if (changes.beast) {
            this.mergeObjects(this._vm, this._vm.beast, changes.beast);
        }

        if (changes.tower) {
            if (changes.tower.hasOwnProperty("freeAttemps")) {
                this._vm.towerFreeAttempts = changes.tower.freeAttemps;
            }
        }

        if (changes.dailyQuests) {
            this.mergeObjects(this._vm, this._vm.dailyQuests, changes.dailyQuests);
        }

        if (changes.trials) {
            this.mergeObjects(this._vm, this._vm.trials, changes.trials);
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
    }

    async updateUserData() {
        try {
            let info = await this._request(Operations.GetUserInfo);
            this._character.assignData(info.character);
            this._inventory.load(info.inventory);

            if (this._vm.loaded) {
                this._mergeData(info);
            } else {
                if (info.questsProgress) {
                    this._vm.$set(this._vm, "questsProgress", info.questsProgress);
                }

                if (info.classInited) {
                    this._vm.classInited = info.classInited;
                }

                this._vm.beast = info.beast;
                this._vm.towerFreeAttempts = info.tower.freeAttemps;
                this._vm.trials = info.trials;
                this._vm.dailyQuests = info.dailyQuests;

                if (!this._vm.loaded) {
                    this._checkClassChoice();
                }

                this._trialCardsResolver = new TrialCardsResolver(
                    this._vm.trials.cards.modifiers,
                    TrialsMeta.cardModifiers
                );
            }

            this._vm.loaded = true;
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
        let lastZoneId = this._zones.length;
        let questData = this._zones[zone - 1].quests[0];
        let stages = [];

        for (let stage in questData.stages) {
            let status = this.getZoneCompletedRecords(lastZoneId, stage)[stage];
            stages.push(status);
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
            };
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
            this._mergeData(result.changes.changes);
            this._removeData(result.changes.removals);
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

    async useItem(itemId, count) {
        let response = await this._wrapOperation(Operations.UseItem, {
            itemId,
            count
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

    async fetchRaidWeakness(raid, stage) {
        return (await this._wrapOperation(Operations.UpgradeItem, {
            raid,
            stage
        })).response;
    }

    async fetchRaidSummonStatus(raid, stage) {
        return await this._request(Operations.FetchRaidSummonStatus, {
            raid,
            stage
        });
    }

    async summonRaid(raid, stage) {
        return await this._request(Operations.SummonRaid, {
            raid,
            stage
        });
    }

    // Crafting

    async disenchantConvert(conversions) {
        let response = await this._wrapOperation(Operations.DisenchantConvert, {
            conversions
        });

        return response.response;
    }

    async disenchantItems(items) {
        let response = await this._wrapOperation(Operations.DisenchantItems, {
            items
        });

        return response.response;
    }

    async upgradeItem(itemId, materials, count) {
        let response = await this._wrapOperation(Operations.UpgradeItem, {
            itemId,
            materials,
            count
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

    async craftRecipe(recipeId, currency, amount) {
        let response = await this._wrapOperation(Operations.CraftItem, {
            recipeId,
            currency,
            amount
        });

        return response.response;
    }

    async fetchCraftingStatus(recipeId) {
        return await this._request(Operations.FetchCraftingStatus, {
            recipeId
        });
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

    // Timers

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

    // Chests

    async openChest(chest, iap, count) {
        let response = await this._wrapOperation(Operations.OpenChest, {
            chest,
            iap,
            count
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

    // Adventures

    async fetchAdventuresStatus() {
        return (await this._wrapOperation(Operations.FetchAdventuresStatus))
            .response;
    }

    async buyAdventureSlot() {
        return (await this._wrapOperation(Operations.BuyAdventureSlot)).response;
    }

    async startAdventure(adventureSlot, adventureIndex) {
        return (await this._wrapOperation(Operations.StartAdventure, {
            slot: adventureSlot,
            adventureIndex
        })).response;
    }

    async claimAdventure(slot) {
        return (await this._wrapOperation(Operations.ClaimAdventure, {
            slot
        })).response;
    }

    async refreshAdventure(slot) {
        return (await this._wrapOperation(Operations.RefreshAdventures, {
            slot
        })).response;
    }

    // Classes

    async selectClass(className) {
        return (await this._wrapOperation(Operations.ChangeClass, {
            class: className
        })).response;
    }

    // Daily login

    async fetchDailyRewardStatus() {
        return (await this._wrapOperation(Operations.FetchDailyRewardStatus))
            .response;
    }

    async collectDailyReward() {
        return (await this._wrapOperation(Operations.CollectDailyReward)).response;
    }

    async fetchDailyRefillsStatus() {
        return (await this._wrapOperation(Operations.FetchDailyRefillsStatus))
            .response;
    }

    async collectDailyRefills() {
        return (await this._wrapOperation(Operations.CollectDailyRefills)).response;
    }

    // Beast 

    async beastRegularBoost(count) {
        return (await this._wrapOperation(Operations.BeastRegularBoost, {
            count
        })).response;
    }

    async beastAdvancedBoost(count) {
        return (await this._wrapOperation(Operations.BeastAdvancedBoost, {
            count
        })).response;
    }

    async purchaseBeastBoost(iapIndex) {
        return (await this._wrapOperation(Operations.BeastAdvancedBoost, {
            iapIndex
        })).response;
    }

    async evolveBeast() {
        return await this._wrapOperation(Operations.EvolveBeast);
    }

    async fetchBeastBoostPurchase() {
        return (await this._wrapOperation(Operations.FetchBeastBoostPurchase))
            .response;
    }

    // IAP

    async getCurrencyConversionRate() {
        return await this._request(Operations.GetCurrencyConversionRate);
    }

    async cancelPurchase(id) {
        return (await this._wrapOperation(Operations.CancelPayment, { id }))
            .response;
    }

    // Tower

    async fetchTowerFloors(page) {
        return (await this._wrapOperation(Operations.FetchTowerFloors, { page }))
            .response;
    }

    async challengeTowerFloor(floor) {
        return (await this._wrapOperation(Operations.ChallengeTowerFloor, {
            floor
        })).response;
    }

    async fetchCurrentFloor() {
        return (await this._wrapOperation(Operations.FetchChallengedTowerFloor))
            .response;
    }

    async cancelTowerFloor() {
        return (await this._wrapOperation(Operations.CancelTowerFloor)).response;
    }

    async claimTowerFloorRewards() {
        return (await this._wrapOperation(Operations.ClaimTowerFloorRewards))
            .response;
    }

    async skipTowerFloor(floor) {
        return (await this._wrapOperation(Operations.SkipTowerFloor, { floor }))
            .response;
    }

    async attackTowerFloor() {
        return (await this._wrapOperation(Operations.AttackTowerFloor)).response;
    }

    // Trials
    async fetchTrialState(trialType, trialId) {
        return (await this._wrapOperation(Operations.FetchTrialState, {
            trialType,
            trialId
        })).response;
    }

    async engageTrialFight(trialType, trialId, stageId, fightIndex) {
        return (await this._wrapOperation(Operations.ChallengeTrialFight, {
            trialType,
            trialId,
            stageId,
            fightIndex
        })).response;
    }

    async attackTrial(trialType) {
        return (await this._wrapOperation(Operations.AttackTrial, {
            trialType
        })).response;
    }

    async fetchTrialFightMeta(trialType, trialId, stageId, fightIndex) {
        return (await this._wrapOperation(Operations.FetchTrialFightMeta, {
            trialType,
            trialId,
            stageId,
            fightIndex
        })).response;
    }

    async collectTrialStageReward(trialType, trialId, stageId) {
        return (await this._wrapOperation(Operations.CollectTrialStageReward, {
            trialType,
            trialId,
            stageId
        })).response;
    }

    async chooseTrialCard(trialType, cardIndex) {
        return (await this._wrapOperation(Operations.ChooseTrialCard, {
            trialType,
            cardIndex
        })).response;
    }

    async upgradeTrialsCard(cardEffect) {
        return (await this._wrapOperation(Operations.ImproveTrialCard, {
            cardEffect
        })).response;
    }

    async resetTrialsCards() {
        return (await this._wrapOperation(Operations.ResetTrialCards)).response;
    }

    async summonTrialCards(trialType) {
        return (await this._wrapOperation(Operations.SummonTrialCards, {
            trialType
        })).response;
    }

    async fetchTrialsAttemptsStatus(trialType) {
        return (await this._wrapOperation(Operations.FetchTrialAttemptsStatus, {
            trialType
        })).response;
    }

    async purchaseTrialsAttempts(trialType, iapIndex) {
        return (await this._wrapOperation(Operations.PurchaseTrialAttempts, {
            trialType,
            iapIndex
        })).response;
    }

    // Gold exchange
    async getGoldExchangeMeta() {
        return (await this._wrapOperation(Operations.GetGoldExchangeMeta)).response;
    }

    async fetchGoldExchangeBoostPremiumStatus() {
        return (await this._wrapOperation(
            Operations.FetchGoldExchangePremiumBoostStatus
        )).response;
    }

    async obtainGoldFromGoldExchange() {
        return (await this._wrapOperation(Operations.ObtainGoldFromGoldExchange))
            .response;
    }

    async boostGoldExchange() {
        return (await this._wrapOperation(Operations.BoostGoldExchange)).response;
    }

    async premiumBoostGoldExchange(count) {
        return (await this._wrapOperation(Operations.PremiumBoostGoldExchange, {
            count
        })).response;
    }

    // Daily quests
    async acceptDailyQuest(questIndex) {
        return (await this._wrapOperation(Operations.AcceptDailyTask, {
            index: questIndex
        })).response;
    }

    async refreshDailyQuests() {
        return (await this._wrapOperation(Operations.RefreshDailyTasks)).response;
    }

    async claimDailyQuestsRewards() {
        return (await this._wrapOperation(Operations.ClaimDailyTasksRewards)).response;
    }

    // Dividends
    async requestDividendTokenWithdrawal(amount) {
        return (await this._wrapOperation(Operations.WithdrawDividendToken, {
            amount
        })).response;
    }

    async fetchPendingDividendTokenWithdrawal() {
        return (await this._wrapOperation(Operations.FetchPendingDividendTokenWithdrawal)).response;
    }

    async sendDividendTokenWithdrawal(amount, nonce, signature) {
        const tx = await this.blockchainClient.dividendTokenWithdrawal(amount, nonce, signature);
        return (await this._wrapOperation(Operations.SendDividendTokenWithdrawal, {
            tx
        })).response;
    }

    // Tournaments
    async fetchTournaments() {
        return (await this._wrapOperation(Operations.FetchTournaments)).response;
    }

    async joinTournament(tournamentId) {
        return (await this._wrapOperation(Operations.JoinTournament, { tournamentId })).response;
    }

    async claimTournamentRewards(tournamentId) {
        return (await this._wrapOperation(Operations.ClaimTournamentRewards, { tournamentId })).response;
    }

    async fetchTournamentRankings(tournamentId, page) {
        return (await this._wrapOperation(Operations.FetchTournamentRankings, { tournamentId, page })).response;
    }

    async getTournamentInfo(tournamentId) {
        return (await this._wrapOperation(Operations.GetTournamentInfo, { tournamentId })).response;
    }

    async getFinishedTournaments() {
        return (await this._wrapOperation(Operations.GetFinishedTournaments)).response;
    }

    async getTournamentRewards(tournamentId) {
        return (await this._wrapOperation(Operations.GetTournamentRewards, { tournamentId })).response;
    }

    // Races
    async fetchRaces() {
        return (await this._wrapOperation(Operations.FetchRaces)).response;
    }

    async joinRace(raceId) {
        return (await this._wrapOperation(Operations.JoinRace, { raceId })).response;
    }

    async claimRaceRewards(raceId) {
        return (await this._wrapOperation(Operations.ClaimRaceRewards, { raceId })).response;
    }

    async fetchRaceRankings(raceId, page) {
        return (await this._wrapOperation(Operations.FetchRaceRankings, { raceId, page })).response;
    }

    async getRaceInfo(raceId) {
        return (await this._wrapOperation(Operations.GetRaceInfo, { raceId })).response;
    }

    async getFinishedRaces() {
        return (await this._wrapOperation(Operations.GetFinishedRaces)).response;
    }

    async getRaceRewards(raceId) {
        return (await this._wrapOperation(Operations.GetRaceRewards, { raceId })).response;
    }

    async getRaceShop() {
        return (await this._wrapOperation(Operations.GetRaceShop)).response;
    }

    async purchaseFromRaceShop(lotId) {
        return (await this._wrapOperation(Operations.PurchaseRaceShop, { lotId })).response;
    }

    // Leaderboards
    async getLeaderboardRank(type) {
        return (await this._wrapOperation(Operations.GetLeaderboardRank, { type })).response;
    }

    async getLeaderboardRankings(type, page) {
        return (await this._wrapOperation(Operations.GetLeaderboardRankings, { type, page })).response;
    }

    // Armies
    async getArmy() {
        return (await this._wrapOperation(Operations.GetArmy)).response;
    }

    async getArmySummonInfo() {
        return (await this._wrapOperation(Operations.GetArmySummonInfo)).response;
    }

    async summonUnits(iap, summonType, count) {
        return (await this._wrapOperation(Operations.SummonArmyUnit, { iap, summonType, count })).response;
    }

    async fetchArmySummonStatus() {
        return (await this._wrapOperation(Operations.FetchArmySummonStatus)).response;
    }

    async levelUpUnit(unitId) {
        return (await this._wrapOperation(Operations.LevelUpArmyUnit, { unitId })).response;
    }
}

export default Game;
