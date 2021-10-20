/*jshint esversion: 9 */

import SocketCluster from "socketcluster-client";
import pify from "pify";
import Vue from "vue";
import CharacterModel from "./character_model";
import ItemDatabase from "./item_database";
import Inventory from "./inventory";
import CraftingRecipes from "./crafting_recipes.json";
import Crafting from "./crafting";
import Events from "@/../../knightlands-shared/events";
import Config from "./config";
import { player as PlayerExpTable } from "./expTables.json";
const Operations = require("@/../../knightlands-shared/operations");
import CurrencyType from "@/../../knightlands-shared/currency_type";
import DisconnectCodes from "@/../../knightlands-shared/disconnectCodes";
import Classes from "@/classes";
import TrialCardsResolver from "@/../../knightlands-shared/trial_cards_resolver";
import TrialsMeta from "@/trials_meta";
import ArmyDB from "@/army/armyDB";
import Army from "@/army/army";
import Subscription from "./subscription";
import Notifications from "./notifications";
import SectionsProgress from "@/sections_progress";
import DividendsMeta from "@/dividends";
import CharacterStats from "@/../../knightlands-shared/character_stat.js";
import { Magic } from "magic-sdk";
import { OAuthExtension } from "@magic-ext/oauth";

const magic = new Magic("pk_live_608834B699B14351", {
  extensions: [new OAuthExtension()]
});

class Game {
  constructor(store) {
    this.Ready = "ready";
    this.SignUp = "signup";
    this.SignedOut = "signed_out";
    this.Disconnected = "disconnected";
    this.WalletSignedIn = "wallet_sign_in";
    this.WalletSignedOut = "wallet_sign_out";
    this.WalletChanged = "wallet_changed";
    this.ConnectionError = "conn_error";
    this.$store = store;

    this.notifications = new Notifications(store);
    this._items = new ItemDatabase();
    this._armyDb = new ArmyDB(this._items, this._items.itemStatResolver);
    this._expTable = PlayerExpTable;
    this._requestInProgress = false;

    this._vm = new Vue({
      data: () => ({
        classInited: false,
        authenticated: false,
        questsProgress: {},
        account: undefined,
        _id: null,
        address: undefined,
        ready: false,
        walletReady: false,
        loaded: false,
        beast: {},
        freeAttempts: 0,
        rank: 0,
        trials: {},
        goldExchange: {},
        dailyQuests: {},
        goldMines: {},
        dividends: {},
        dailyShop: {},
        subscriptions: {},
        chests: {},
        depositorId: "",
        towerPurchased: false,
        tutorial: {},
        raidPoints: {},
        accountType: 0,
        soloRaidAttempts: {},
        flags: {},
        raceShop: {},
        groupRaidSummons: {}
      })
    });

    this._character = new CharacterModel(this);
    this._subscription = new Subscription(this, this._vm.subscriptions);
    this._inventory = new Inventory(this._items);
    this._crafting = new Crafting(CraftingRecipes, this._inventory);
    this._army = new Army(
      this,
      this._items.itemStatResolver,
      this._armyDb,
      this._inventory,
      this._character
    );
    this._serverTimeDiff = 0;

    var options = {
      hostname: Config.gameServerEndpoint,
      secure:
        process.env.NODE_ENV == "production" || process.env.NODE_ENV == "test",
      autoConnect: false,
      port: Config.gameServerPort,
      connectTimeout: 15000,
      ackTimeout: 15000,
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
    this._socket.on("error", this._handleSocketError.bind(this));

    this._socket.on(
      Events.InventoryUpdate,
      this._handleInventoryUpdate.bind(this)
    );
    this._socket.on(Events.RaidSummonStatus, this._handleRaidStatus.bind(this));
    this._socket.on(
      Events.TokenChartUpdate,
      this._handleChartUpdate.bind(this)
    );
    this._socket.on(
      Events.RaidJoinStatus,
      this._handleRaidJoinStatus.bind(this)
    );

    this._socket.on(Events.CraftingStatus, this._handleCraftStatus.bind(this));
    this._socket.on(Events.TimerRefilled, this._handleTimerRefilled.bind(this));
    this._socket.on(Events.ChestOpened, this._handleChestOpened.bind(this));
    this._socket.on(Events.ItemEnchanted, this._handleItemEnchanted.bind(this));
    this._socket.on(Events.BuffApplied, this._handleBuffApplied.bind(this));
    this._socket.on(Events.BuffUpdate, this._handleBuffUpdate.bind(this));
    this._socket.on(
      Events.FounderPackAcquired,
      this._forwardEvent.bind(this, Events.FounderPackAcquired)
    );
    this._socket.on(
      Events.DivTokenWithdrawal,
      this._handleDivTokenWithdrawal.bind(this)
    );
    this._socket.on(
      Events.PurchaseComplete,
      this._handlePurchaseComplete.bind(this)
    );
    this._socket.on(Events.CommitChanges, this._handleCommit.bind(this));
    this._socket.on(Events.UnitUpdated, this._handleUnitUpdate.bind(this));
    this._socket.on(Events.ArmySlots, this._handleArmySlots.bind(this));
    this._socket.on(
      Events.DailyTaskComplete,
      this._handleDailyTaskComplete.bind(this)
    );
    this._socket.on(
      Events.UnitsReserveUpdate,
      this._handleUnitReserveUpdate.bind(this)
    );
    this._socket.on(Events.UnitsRemoved, this._handleUnitsRemoved.bind(this));
    this._socket.on(Events.RaidDamaged, this._handleRaidDamaged.bind(this));
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
    this._socket.on(
      Events.TokenWithdrawal,
      this._handleTokenWithdrawal.bind(this)
    );

    // let's avoid using callbacks
    this._emitFn = pify(this._socket.emit);

    Vue.prototype.$character = this._character;
  }

  get raidPoints() {
    return this._vm.raidPoints;
  }

  get depositorId() {
    return this._vm.depositorId;
  }

  get soloRaidAttempts() {
    return this._vm.soloRaidAttempts;
  }

  get groupRaidSummons() {
    return this._vm.groupRaidSummons;
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

  get chests() {
    return this._vm.chests;
  }

  get subscription() {
    return this._subscription;
  }

  get dailyQuests() {
    return this._vm.dailyQuests;
  }

  get trialCardsResolver() {
    return this._trialCardsResolver;
  }

  get address() {
    return this._vm.address;
  }

  hasWallet() {
    return this._blockchainClient && this._blockchainClient.isInited();
  }

  hasFlag(flag) {
    return !!this._vm.flags[flag];
  }

  get raceShop() {
    return this._vm.raceShop;
  }

  get itemsDB() {
    return this._items;
  }

  get armyDB() {
    return this._armyDb;
  }

  get dividends() {
    return this._vm.dividends;
  }

  get army() {
    return this._army;
  }

  get crafting() {
    return this._crafting;
  }

  get goldMines() {
    return this._vm.goldMines;
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

  set blockchain(value) {
    this._blockchainClient = value;

    if (this._blockchainClient.isReady()) {
      this._vm.address = this._blockchainClient.getAddress();
    }
  }

  walletReady() {
    return this._vm.walletReady;
  }

  get freeAttempts() {
    return this._vm.freeAttempts;
  }

  tryDecTowerFreeAttempts() {
    if (this._vm.freeAttempts > 0) {
      this._vm.freeAttempts--;
    }
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

  get dktStake() {
    return this.dividends.stake;
  }

  get towerPurchased() {
    return this._vm.towerPurchased;
  }

  get ready() {
    return this._vm.ready;
  }

  get account() {
    return this._vm.account;
  }

  get id() {
    return this._vm._id;
  }

  get character() {
    return this._character;
  }

  get subscriptions() {
    return this._vm.subscriptions;
  }

  get dailyShop() {
    return this._vm.dailyShop;
  }

  get blockchain() {
    return this._blockchainClient;
  }

  get now() {
    return new Date().getTime() + this._serverTimeDiff;
  }

  get nowSec() {
    return Math.floor(this.now / 1000);
  }

  get isFreeAccount() {
    return !this._vm.accountType;
  }

  get dktBonus() {
    let factor = 1;
    const bonuses = this.subscription.cardBonuses;
    const dividends = this.dividends;
    factor += this.character.maxStats[CharacterStats.ExtraDkt] / 1000;
    if (dividends.dropRateLevel > 0) {
      factor *= 1 + DividendsMeta.dropRate[dividends.dropRateLevel - 1].rate;
    }

    factor *= 1 + bonuses.dkt / 100;
    return factor;
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

  isTutorialFinished(id) {
    return this._vm.tutorial[id];
  }

  disconnect() {
    this._socket.disconnect();
  }

  connect() {
    this._socket.connect();
  }

  openRefill(stat) {
    this._vm.$emit("refill", stat);
  }

  joinRaceChannel() {
    if (!this.racesChannel) {
      this._socket.on(Events.RaceFinished, this._handleRaceFinished.bind(this));
      this.racesChannel = this.createChannel(Events.RaceFinished, false);
      this.racesChannel.watch(this._handleRaceFinished.bind(this));
    }
  }
  
  async signMessage(message) {
    return await this._blockchainClient.sign(message);
  }

  async trySignIn() {
    const didToken = await magic.oauth.getRedirectResult();
    return this._signIn(didToken.magic.idToken);
  }

  async signInWith(provider) {
    await magic.oauth.loginWithRedirect({
      provider,
      redirectURI: window.location.href
    });
  }

  async signIn(email, referral) {
    const didToken = await magic.auth.loginWithMagicLink({
      email: email,
      showUI: true
    });

    return this._signIn(didToken, referral);
  }

  async _signIn(didToken, referral) {
    return new Promise(async (resolve, reject) => {
      try {
        await this._request(Operations.Auth, {
          token: didToken,
          referral
        });

        this._signInResolve = resolve;
      } catch (exc) {
        // signing was rejected
        this._vm.walletReady = false;
        reject(exc);
      }
    });
  }

  async loadUserPreview(id) {
    return this._request(Operations.FetchCharacter, {
      id
    });
  }

  async purchaseCard(cardId, address, chain) {
    return (
      await this._wrapOperation(Operations.Purchase, {
        cardId,
        address,
        chain
      })
    ).response;
  }

  async purchasePack(packId, address, chain) {
    return (
      await this._wrapOperation(Operations.Purchase, {
        packId,
        address,
        chain
      })
    ).response;
  }

  async purchase(iap) {
    return (
      await this._wrapOperation(Operations.Purchase, {
        iap,
        address: this._blockchainClient.getAddress(),
        chain: this._blockchainClient.id
      })
    ).response;
  }

  async purchaseGold(goldIndex) {
    return (
      await this._wrapOperation(Operations.Purchase, {
        goldIndex
      })
    ).response;
  }

  async paymentStatus() {
    return (await this._wrapOperation(Operations.PurchaseStatus)).response;
  }

  async purchaseIAP(iap, paymentId, price, nonce, timestamp, signature) {
    return this._blockchainClient.purchaseIAP(
      iap,
      paymentId,
      price,
      nonce,
      timestamp,
      signature
    );
  }

  async sendPayment(paymentId, signedTransaction) {
    return await this._request(Operations.SendPayment, {
      paymentId,
      signedTransaction
    });
  }

  async _handleAuthentication(data) {
    let signedIn = data.newState == "authenticated";

    if (signedIn && !this._vm.authenticated) {
      try {
        await this.updateUserData();
        this._vm.authenticated = true;
        if (this._signInResolve) {
          this._signInResolve();
        }
        this._vm.$nextTick(() => {
          this._vm.$emit(this.SignUp);
        });
        this._syncTime();
      } catch (ex) {}
    } else if (!signedIn) {
      this._vm.authenticated = false;
      this._vm.$nextTick(() => {
        this._vm.$emit(this.SignedOut);
      });
    }
  }

  async _handleConnection(data) {
    if (data.isAuthenticated) {
      await this.updateUserData();
    }
    this._vm.ready = true;
    this._vm.$nextTick(() => {
      this._vm.$emit(this.Ready, data.isAuthenticated);
    });
  }

  _handleSocketError() {
    this._vm.$emit(this.ConnectionError);
  }

  _handleDisconnect(errorCode) {
    switch (errorCode) {
      case DisconnectCodes.OtherClientSignedIn:
      case DisconnectCodes.NotAllowed:
      case DisconnectCodes.NotAuthorized:
        this.logout();
        break;
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
  _handleRaidDamaged(data) {
    this._vm.$emit(Events.RaidDamaged, data);
  }

  _handleInventoryUpdate(data) {
    this._inventory.mergeData(data);
    this.notifications.updateTraining();
  }

  _handleArmySlots(data) {
    this._army.updateMaxSlots(data);
  }

  _handleUnitUpdate(data) {
    this._army.updateUnit(data);
  }

  _handleUnitReserveUpdate(data) {
    this._army.updateReserve(data);
  }

  handleArmySummoned(units) {
    this._army.addUnits(units);
  }

  _handleUnitsRemoved(data) {
    this._army.removeUnits(data);
  }

  _handleBuffApplied(data) {
    this._character.applyBuff(data);
  }

  _handleBuffUpdate(data) {
    // this._character.mergeData(data);
  }

  _handlePurchaseComplete(data) {
    this._vm.$emit(Events.PurchaseComplete, data);
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

  _handleTokenWithdrawal(data) {
    this._vm.$emit(Events.TokenWithdrawal, data);
  }

  _handleDivTokenWithdrawal(data) {
    this._vm.$emit(Events.DivTokenWithdrawal, data);
  }

  _handleDailyTaskComplete(data) {
    if (SectionsProgress.dailyTasks > this.character.level) {
      return;
    }

    const { type } = data;

    Vue.notify({
      group: "daily",
      max: 2,
      data: {
        type
      },
      duration: 5000
    });
    this._vm.$emit("task_complete");
  }

  _forwardEvent(evt, data) {
    this._vm.$emit(evt, data);
  }

  _handleRaidJoinStatus(data) {
    const { iap, context } = data;

    Vue.notify({
      group: "raid",
      data: {
        join: true,
        iap,
        context,
        success: true
      },
      duration: 5000
    });

    this._vm.$emit(Events.RaidJoinStatus, data);
  }

  _handleRaidStatus(data) {
    const { iap, reason, context } = data;

    Vue.notify({
      group: "raid",
      data: {
        join: false,
        iap,
        context,
        success: reason ? false : true
      },
      duration: 5000
    });

    this._vm.$emit(Events.RaidSummonStatus, data);
  }

  _handleChartUpdate(data) {
    this._vm.$emit(Events.TokenChartUpdate, data);
  }

  _handleRaceFinished(data) {
    if (this.racesChannel) {
      this._vm.$emit(Events.RaceFinished, data);
      const currentRace = this.$store.state.rankings.currentRace;
      if (currentRace && currentRace.id == data.race) {
        Vue.notify({
          group: "race",
          data,
          duration: 5000
        });
      }
    }
  }

  _handleCraftStatus(data) {
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

      if (!currentData.hasOwnProperty(i) || typeof newField != "object") {
        vm.$set(currentData, i, newField);
      } else {
        this.mergeObjects(vm, currentData[i], newField);
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
    if (!changes) {
      return;
    }

    if (changes.classInited) {
      this._vm.classInited = changes.classInited;
    }

    if (changes.character) {
      if (this.character.level < changes.character.level) {
        this._vm.$emit("level-up", {
          current: this.character.level,
          new: changes.character.level
        });
      }

      this.character.mergeData(changes.character);

      this._checkClassChoice();
    }

    if (changes.goldExchange) {
      this.mergeObjects(this._vm, this._vm.goldExchange, changes.goldExchange);
    }

    if (changes.goldMines) {
      this.mergeObjects(this._vm, this._vm.goldMines, changes.goldMines);
    }

    if (changes.tutorial) {
      this.mergeObjects(this._vm, this._vm.tutorial, changes.tutorial);
    }

    if (changes.subscriptions) {
      this.mergeObjects(
        this._vm,
        this._vm.subscriptions,
        changes.subscriptions
      );
    }

    if (changes.beast) {
      this.mergeObjects(this._vm, this._vm.beast, changes.beast);
    }

    if (changes.dailyShop) {
      this.mergeObjects(this._vm, this._vm.dailyShop, changes.dailyShop);
    }

    if (changes.tower) {
      if (changes.tower.hasOwnProperty("freeAttemps")) {
        this._vm.freeAttempts = changes.tower.freeAttemps;
      }

      this._vm.towerPurchased = changes.tower.purchased;
    }

    if (changes.dailyQuests) {
      this.mergeObjects(this._vm, this._vm.dailyQuests, changes.dailyQuests);
    }

    if (changes.trials) {
      this.mergeObjects(this._vm, this._vm.trials, changes.trials);
    }

    if (changes.dividends) {
      this.mergeObjects(this._vm, this._vm.dividends, changes.dividends);
    }

    if (changes.chests) {
      this.mergeObjects(this._vm, this._vm.chests, changes.chests);
    }

    if (changes.accountType !== undefined) {
      this._vm.accountType = changes.accountType;
    }

    if (changes.raidPoints) {
      this.mergeObjects(this._vm, this._vm.raidPoints, changes.raidPoints);
    }

    if (changes.sRaidAttempts) {
      this.mergeObjects(
        this._vm,
        this._vm.soloRaidAttempts,
        changes.sRaidAttempts
      );
    }

    if (changes.gRaidSummon) {
      this.mergeObjects(
        this._vm,
        this._vm.groupRaidSummons,
        changes.gRaidSummon
      );
    }

    if (changes.raceShop) {
      this.mergeObjects(this._vm, this._vm.raceShop, changes.raceShop);
    }

    if (changes.flags) {
      this.mergeObjects(this._vm, this._vm.flags, changes.flags);
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

  async getOnline() {
    return this._wrapOperation(Operations.GetOnline);
  }

  async updateUserData() {
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

      this._vm._id = info._id;
      this._vm.account = info.address;
      this._vm.beast = info.beast;
      this._vm.freeAttempts = info.tower.freeAttemps;
      this._vm.towerPurchased = info.tower.purchased;
      this._vm.trials = info.trials;
      this._vm.dailyQuests = info.dailyQuests;
      this._vm.goldMines = info.goldMines;
      this._vm.tutorial = info.tutorial;
      this._vm.dividends = info.dividends;
      this._vm.dailyShop = info.dailyShop;
      this._vm.purchasedIaps = info.purchasedIaps;
      this._vm.depositorId = info.depositorId;
      this._vm.raidPoints = info.raidPoints;
      this._vm.accountType = info.accountType;
      this._vm.soloRaidAttempts = info.sRaidAttempts;
      this._vm.groupRaidSummons = info.gRaidSummon;
      this._vm.flags = info.flags;
      this._vm.raceShop = info.raceShop;

      if (info.chests) {
        this.mergeObjects(this._vm, this._vm.chests, info.chests);
      }

      if (info.subscriptions) {
        this.mergeObjects(this._vm, this._vm.subscriptions, info.subscriptions);
      }

      if (!this._vm.loaded) {
        this._checkClassChoice();
      }

      this._trialCardsResolver = new TrialCardsResolver(
        this._vm.trials.cards.modifiers,
        TrialsMeta.cardModifiers
      );

      await this.army.load();
    }

    this._vm.loaded = true;
  }

  getRequiredExperience(level) {
    if (this._expTable.length <= level) {
      return 0;
    }
    return this._expTable[level];
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
        damageRecieved: 0,
        unlocked: true
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
      return result;
    } catch (exc) {
      throw exc;
    }
  }

  _handleCommit(commit) {
    this._mergeData(commit.changes);
    this._removeData(commit.removals);
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

  async changeName(nickname) {
    await this._wrapOperation(Operations.ChangeNickname, {
      nickname
    });
  }

  async setAvatar(id) {
    await this._wrapOperation(Operations.ChangeAvatar, {
      id
    });
  }

  async resetZone(zone) {
    zone = zone * 1;
    let stage = this.$store.getters.getZoneStage;
    await this._wrapOperation(Operations.ResetZone, {
      zone,
      stage
    });
  }

  async getDungeon() {
    let result = await this._wrapOperation(Operations.SDungeonGenerateNew);
    return result.response;
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

  async upgradeAccount() {
    await this._wrapOperation(Operations.UpgradeAccount);
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

  async attackRaidBoss(raidId, hits, legionIndex) {
    return (
      await this._wrapOperation(Operations.AttackRaidBoss, {
        raidId,
        hits,
        legionIndex
      })
    ).response;
  }

  async useItem(itemId, count) {
    let response = await this._wrapOperation(Operations.UseItem, {
      itemId,
      count
    });
    return response.response;
  }

  async refillTimer(stat, refillType, items, restores) {
    let response = await this._wrapOperation(Operations.RefillTimer, {
      stat,
      refillType,
      items,
      restores
    });

    return response.response;
  }

  // Raids
  async fetchRaidSummonStatus(raid, free) {
    return (
      await this._request(Operations.FetchRaidSummonStatus, {
        raid,
        free
      })
    ).response;
  }

  async fetchRaidPointsInfo() {
    return (await this._request(Operations.FetchRaidPoints)).response;
  }

  async fetchCurrentRaids() {
    return (await this._wrapOperation(Operations.FetchRaidsList)).response;
  }

  async joinRaid(raidId, isFree = false) {
    return (
      await this._wrapOperation(Operations.JoinRaid, {
        raidId,
        isFree
      })
    ).response;
  }

  async fetchPlayersFromRaid(raid) {
    return (
      await this._wrapOperation(Operations.GetRaidPlayers, {
        raid
      })
    ).response;
  }

  async fetchRaid(raidId) {
    return (
      await this._wrapOperation(Operations.FetchRaidInfo, {
        raidId
      })
    ).response;
  }

  async summonRaid(raid, free, options) {
    return (
      await this._wrapOperation(Operations.SummonRaid, {
        raid,
        free,
        options
      })
    ).response;
  }

  async fetchRaidRewards(raidId) {
    return (
      await this._wrapOperation(Operations.FetchRaidRewards, {
        raidId
      })
    ).response;
  }

  async fetchPublicRaids(page) {
    return (await this._wrapOperation(Operations.GetPublicRaids, { page }))
      .response;
  }

  // Crafting
  async rerollAccessory(itemId) {
    return (
      await this._wrapOperation(Operations.RerollAccessory, {
        itemId
      })
    ).response;
  }

  async rollbackAccessory(itemId) {
    return (
      await this._wrapOperation(Operations.CancelRerollAccessory, {
        itemId
      })
    ).response;
  }

  async createAccessory(template, count) {
    let response = await this._wrapOperation(Operations.CraftAccessory, {
      template,
      count
    });

    return response.response;
  }

  async convert(conversions, entity) {
    let response = await this._wrapOperation(Operations.Convert, {
      conversions,
      entity
    });

    return response.response;
  }

  async disenchantItems(items) {
    let response = await this._wrapOperation(Operations.DisenchantItems, {
      items
    });

    return response.response;
  }

  async upgradeItem(itemId, materials) {
    let response = await this._wrapOperation(Operations.UpgradeItem, {
      itemId,
      materials
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

  async evolveItem(itemId, extraItem) {
    let response = await this._wrapOperation(Operations.Evolve, {
      itemId,
      extraItem
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

  async createWeapon(recipeId, currency, itemId, element) {
    let response = await this._wrapOperation(Operations.CreateWeapon, {
      recipeId,
      currency,
      itemId,
      element
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
    return (
      await this._wrapOperation(Operations.StartAdventure, {
        slot: adventureSlot,
        adventureIndex
      })
    ).response;
  }

  async claimAdventure(slot) {
    return (
      await this._wrapOperation(Operations.ClaimAdventure, {
        slot
      })
    ).response;
  }

  async refreshAdventure(slot) {
    return (
      await this._wrapOperation(Operations.RefreshAdventures, {
        slot
      })
    ).response;
  }

  // Classes

  async selectClass(className) {
    return (
      await this._wrapOperation(Operations.ChangeClass, {
        class: className
      })
    ).response;
  }

  // Dividends
  async getSeasonStatus() {
    return (await this._wrapOperation(Operations.FetchSeason)).response;
  }

  async cancelTokenWithdrawal(id) {
    return (
      await this._wrapOperation(Operations.CancelAsset, { type: "token-w", id })
    ).response;
  }

  async cancelDivsWithdrawal(id) {
    return (
      await this._wrapOperation(Operations.CancelAsset, { type: "divs-w", id })
    ).response;
  }

  async upgradeRPMining() {
    return (await this._wrapOperation(Operations.DivsMineUpgrade)).response;
  }

  async collectRPMining() {
    return (await this._wrapOperation(Operations.ClaimMinedDkt)).response;
  }

  async upgradeRPDropRate() {
    return (await this._wrapOperation(Operations.DivsDropUpgrade)).response;
  }

  async getDivsStatus() {
    return (await this._wrapOperation(Operations.GetDivsStatus)).response;
  }

  async withdrawDividends(to, blockchainId) {
    return (
      await this._wrapOperation(Operations.WithdrawDividendToken, {
        to,
        blockchainId
      })
    ).response;
  }

  async claimDividends(blockchainId) {
    return (await this._wrapOperation(Operations.ClaimDivs, { blockchainId }))
      .response;
  }

  async purchaseDktShopItem(itemId) {
    return (await this._wrapOperation(Operations.DivsPurchaseShop, { itemId }))
      .response;
  }

  async withdrawTokens(to, type, chain, amount) {
    return (
      await this._wrapOperation(Operations.WithdrawTokens, {
        to,
        type,
        amount,
        chain
      })
    ).response;
  }

  async stakeTokens(amount) {
    return (
      await this._wrapOperation(Operations.StakeDivs, {
        amount
      })
    ).response;
  }

  async completeTutorial(id) {
    await this._wrapOperation(Operations.Tutorial, {
      id
    });
  }

  async getPendingDivs(chain, tokens) {
    return (
      await this._wrapOperation(Operations.PendingDivs, { chain, tokens })
    ).response;
  }

  async fetchWithdrawTokensStatus() {
    return (await this._wrapOperation(Operations.GetWithdrawTokensStatus))
      .response;
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
    return (
      await this._wrapOperation(Operations.BeastRegularBoost, {
        count
      })
    ).response;
  }

  async beastAdvancedBoost(count) {
    return (
      await this._wrapOperation(Operations.BeastAdvancedBoost, {
        count
      })
    ).response;
  }

  async purchaseBeastBoost(iapIndex) {
    return (
      await this._wrapOperation(Operations.BeastAdvancedBoost, {
        iapIndex
      })
    ).response;
  }

  async evolveBeast() {
    return await this._wrapOperation(Operations.EvolveBeast);
  }

  async fetchBeastBoostPurchase() {
    return (await this._wrapOperation(Operations.FetchBeastBoostPurchase))
      .response;
  }

  // IAP

  async getCurrencyConversionRate(currency) {
    return await this._request(Operations.GetCurrencyConversionRate, {
      currency
    });
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
    return (
      await this._wrapOperation(Operations.ChallengeTowerFloor, {
        floor
      })
    ).response;
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

  async purchaseTowerTickets(index) {
    return (
      await this._wrapOperation(Operations.PurchaseTowerAttempts, { index })
    ).response;
  }

  // Trials
  async fetchTrialState(trialType, trialId) {
    return (
      await this._wrapOperation(Operations.FetchTrialState, {
        trialType,
        trialId
      })
    ).response;
  }

  async engageTrialFight(trialType, trialId, stageId, fightIndex) {
    return (
      await this._wrapOperation(Operations.ChallengeTrialFight, {
        trialType,
        trialId,
        stageId,
        fightIndex
      })
    ).response;
  }

  async attackTrial(trialType) {
    return (
      await this._wrapOperation(Operations.AttackTrial, {
        trialType
      })
    ).response;
  }

  async fetchTrialFightMeta(trialType, trialId, stageId, fightIndex) {
    return (
      await this._wrapOperation(Operations.FetchTrialFightMeta, {
        trialType,
        trialId,
        stageId,
        fightIndex
      })
    ).response;
  }

  async collectTrialStageReward(trialType, trialId, stageId) {
    return (
      await this._wrapOperation(Operations.CollectTrialStageReward, {
        trialType,
        trialId,
        stageId
      })
    ).response;
  }

  async chooseTrialCard(trialType, cardIndex) {
    return (
      await this._wrapOperation(Operations.ChooseTrialCard, {
        trialType,
        cardIndex
      })
    ).response;
  }

  async upgradeTrialsCard(cardEffect) {
    return (
      await this._wrapOperation(Operations.ImproveTrialCard, {
        cardEffect
      })
    ).response;
  }

  async resetTrialsCards() {
    return (await this._wrapOperation(Operations.ResetTrialCards)).response;
  }

  async summonTrialCards(trialType) {
    return (
      await this._wrapOperation(Operations.SummonTrialCards, {
        trialType
      })
    ).response;
  }

  async fetchTrialsAttemptsStatus(trialType) {
    return (
      await this._wrapOperation(Operations.FetchTrialAttemptsStatus, {
        trialType
      })
    ).response;
  }

  async purchaseTrialsAttempts(trialType, iapIndex) {
    return (
      await this._wrapOperation(Operations.PurchaseTrialAttempts, {
        trialType,
        iapIndex
      })
    ).response;
  }

  // Gold exchange
  async getGoldExchangeMeta() {
    return (await this._wrapOperation(Operations.GetGoldExchangeMeta)).response;
  }

  async fetchGoldExchangeBoostPremiumStatus() {
    return (
      await this._wrapOperation(Operations.FetchGoldExchangePremiumBoostStatus)
    ).response;
  }

  async obtainGoldFromGoldExchange() {
    return (await this._wrapOperation(Operations.ObtainGoldFromGoldExchange))
      .response;
  }

  async boostGoldExchange() {
    return (await this._wrapOperation(Operations.BoostGoldExchange)).response;
  }

  async premiumBoostGoldExchange(count) {
    return (
      await this._wrapOperation(Operations.PremiumBoostGoldExchange, {
        count
      })
    ).response;
  }

  // Daily quests
  async acceptDailyQuest(questIndex) {
    return (
      await this._wrapOperation(Operations.AcceptDailyTask, {
        index: questIndex
      })
    ).response;
  }

  async refreshDailyQuests() {
    return (await this._wrapOperation(Operations.RefreshDailyTasks)).response;
  }

  async claimDailyQuestsRewards(taskType) {
    return (
      await this._wrapOperation(Operations.ClaimDailyTasksRewards, { taskType })
    ).response;
  }
  // Tournaments
  async fetchTournaments() {
    return (await this._wrapOperation(Operations.FetchTournaments)).response;
  }

  async joinTournament(tournamentId) {
    return (
      await this._wrapOperation(Operations.JoinTournament, { tournamentId })
    ).response;
  }

  async claimTournamentRewards(tournamentId) {
    return (
      await this._wrapOperation(Operations.ClaimTournamentRewards, {
        tournamentId
      })
    ).response;
  }

  async fetchTournamentRankings(tournamentId, page) {
    return (
      await this._wrapOperation(Operations.FetchTournamentRankings, {
        tournamentId,
        page
      })
    ).response;
  }

  async getTournamentInfo(tournamentId) {
    return (
      await this._wrapOperation(Operations.GetTournamentInfo, { tournamentId })
    ).response;
  }

  async getFinishedTournaments() {
    return (await this._wrapOperation(Operations.GetFinishedTournaments))
      .response;
  }

  async getTournamentRewards(tournamentId) {
    return (
      await this._wrapOperation(Operations.GetTournamentRewards, {
        tournamentId
      })
    ).response;
  }

  // Prize pool
  async fetchPrizePool(page) {
    return (await this._wrapOperation(Operations.FetchPrizePool, { page }))
      .response;
  }

  async getPrizePoolRank() {
    return (await this._wrapOperation(Operations.GetPrizePoolRank)).response;
  }

  async getPrizePoolRewards() {
    return (await this._wrapOperation(Operations.GetPrizePoolRewards)).response;
  }

  // Races
  async fetchRaces() {
    return (await this._wrapOperation(Operations.FetchRaces)).response;
  }

  async joinRace(raceId) {
    this.joinRaceChannel();
    return (await this._wrapOperation(Operations.JoinRace, { raceId }))
      .response;
  }

  async claimRaceRewards(raceId) {
    return (await this._wrapOperation(Operations.ClaimRaceRewards, { raceId }))
      .response;
  }

  async fetchRaceRankings(raceId, page) {
    return (
      await this._wrapOperation(Operations.FetchRaceRankings, { raceId, page })
    ).response;
  }

  async getRaceInfo(raceId) {
    return (await this._wrapOperation(Operations.GetRaceInfo, { raceId }))
      .response;
  }

  async getFinishedRaces() {
    return (await this._wrapOperation(Operations.GetFinishedRaces)).response;
  }

  async getRaceRewards(raceId) {
    return (await this._wrapOperation(Operations.GetRaceRewards, { raceId }))
      .response;
  }

  async getRaceShop() {
    return (await this._wrapOperation(Operations.GetRaceShop)).response;
  }

  async purchaseFromRaceShop(lotId) {
    return (await this._wrapOperation(Operations.PurchaseRaceShop, { lotId }))
      .response;
  }

  // Leaderboards
  async getLeaderboardRank(type) {
    return (await this._wrapOperation(Operations.GetLeaderboardRank, { type }))
      .response;
  }

  async getLeaderboardRankings(type, page) {
    return (
      await this._wrapOperation(Operations.GetLeaderboardRankings, {
        type,
        page
      })
    ).response;
  }

  // Armies
  async getArmy() {
    return (await this._wrapOperation(Operations.GetArmy)).response;
  }

  async getArmySummonInfo() {
    return (await this._wrapOperation(Operations.GetArmySummonInfo)).response;
  }

  async summonUnits(iap, summonType, count) {
    return (
      await this._wrapOperation(Operations.SummonArmyUnit, {
        iap,
        summonType,
        count
      })
    ).response;
  }

  async fetchArmySummonStatus() {
    return (await this._wrapOperation(Operations.FetchArmySummonStatus))
      .response;
  }

  async levelUpUnit(unitId) {
    return (await this._wrapOperation(Operations.LevelUpArmyUnit, { unitId }))
      .response;
  }

  async setLegionSlot(legionIndex, slotId, unitId) {
    return (
      await this._wrapOperation(Operations.SetLegionSlot, {
        legionIndex,
        slotId,
        unitId
      })
    ).response;
  }

  async unitEquipItem(unitId, itemIds) {
    return (
      await this._wrapOperation(Operations.UnitEquipItem, { unitId, itemIds })
    ).response;
  }

  async unitUnequipItem(unitId, slotId) {
    return (
      await this._wrapOperation(Operations.UnitUnequipItem, { unitId, slotId })
    ).response;
  }

  async promoteUnit(unitId, units) {
    return (await this._wrapOperation(Operations.UnitPromo, { unitId, units }))
      .response;
  }

  async banishUnits(units) {
    return (await this._wrapOperation(Operations.UnitBanishment, { units }))
      .response;
  }

  async reserveUnits(units) {
    return (await this._wrapOperation(Operations.UnitReserve, { units }))
      .response;
  }

  async expandArmySlots(byItem = false) {
    return (
      await this._wrapOperation(Operations.ExpandArmyInventory, { byItem })
    ).response;
  }

  // Gold Mines
  async upgradeGoldMineRate(mineIndex) {
    return (await this._wrapOperation(Operations.UpgradeMine, { mineIndex }))
      .response;
  }

  async upgradeGoldMineStorage() {
    return (await this._wrapOperation(Operations.UpgradeMineStorage)).response;
  }

  async collectGoldMine() {
    return (await this._wrapOperation(Operations.CollectMine)).response;
  }

  async expandGoldMine() {
    return (await this._wrapOperation(Operations.ExpandMine)).response;
  }

  // Inventory
  async lockItem(item) {
    return (await this._wrapOperation(Operations.LockItem, { item })).response;
  }

  async unlockItem(item) {
    return (await this._wrapOperation(Operations.UnlockItem, { item }))
      .response;
  }

  // Daily Shop
  async refreshDailyShop() {
    return (await this._wrapOperation(Operations.RefreshDailyShop)).response;
  }

  async purchaseDailyItem(itemIndex, fixed) {
    return (
      await this._wrapOperation(Operations.PurchaseDailyItem, {
        itemIndex,
        fixed
      })
    ).response;
  }

  // Founder's sale
  async fetchFoundersPresale(from) {
    return (await this._wrapOperation(Operations.FetchFounderPresale, { from }))
      .response;
  }

  async depositFounderPacks(from, chain, tokenIds) {
    return (
      await this._wrapOperation(Operations.DepositFounderPack, {
        from,
        chain,
        tokenIds
      })
    ).response;
  }
}

export default Game;
