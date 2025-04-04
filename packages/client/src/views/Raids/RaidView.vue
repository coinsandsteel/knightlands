<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <div class="height-100" v-bar v-if="raidState">
      <div>
        <div
          class="flex relative flex-column flex-no-wrap height-100"
          v-show="mainViewNotHidden"
        >
          <boss-view
            ref="bossView"
            class="margin-bottom-1"
            :progress="raidProgress"
            :raidTemplateId="raidState.raidTemplateId"
            :timeLeft="timeLeft"
          >
            <template v-slot:view>
              <BossAnimation :raid="raid" ref="bossAnimation" />
            </template>

            <template v-slot:default>
              <DamageText
                v-for="damage in playerDamages"
                :key="damage.id"
                :crit="damage.crit"
                :local="damage.local"
                >{{ damage.damage }}</DamageText
              >

              <DamageLog
                :log="lastDamages"
                v-show="showLog"
                @close="showLog = false"
              ></DamageLog>
            </template>

            <template v-slot:overlay>
              <div class="height-100 width-100 impact-container">
                <SpriteAnimator
                  :id="'sprite'"
                  :spritesheet="[
                    require('../../assets/fx/impact1/impact1.png'),
                    require('../../assets/fx/impact1/impact2.png'),
                    require('../../assets/fx/impact1/exp7.png'),
                    require('../../assets/fx/impact1/exp8.png')
                  ]"
                  :json="[
                    require('../../assets/fx/impact1/impact1.json'),
                    require('../../assets/fx/impact1/impact2.json'),
                    require('../../assets/fx/impact1/exp7.json'),
                    require('../../assets/fx/impact1/exp8.json')
                  ]"
                  :fps="24"
                  ref="impact"
                ></SpriteAnimator>
              </div>
            </template>
          </boss-view>

          <!--COMBAT VIEW-->
          <div
            class="raid-controls full-flex width-100"
            v-if="participant && !raidWon"
          >
            <!-- <div class="margin-top-3">
                <div class="flex flex-column flex-center font-size-20 white-font font-outline">
                  <span
                    class="yellow-title white-space-wide margin-bottom-2"
                  >{{$t("loot-tier", {tier: currentLootTier})}}</span>
                </div>

                <ProgressBar
                  v-model="lootProgress.current"
                  :maxValue="lootProgress.max"
                  :compact="false"
                  :hideMaxValue="lootProgress.current >= lootProgress.max"
                ></ProgressBar>
            </div>-->
            <RaidAttackPanel
              ref="attackPanel"
              class="attack"
              @attack="handleAttack"
              :disabled="attackInProgress"
              :staminaCost="staminaCost"
            />

            <RaidArmy
              ref="army"
              class="raid-army margin-top-1"
              :legionIndex="$store.state.selectedLegion"
              :attackPoint="bossViewCenter"
              @damage="_handleArmyDamage"
            />

            <RaidOptions
              class="raid-options-left"
              :left="true"
              :isFreeRaid="isFreeRaid"
              @log="handleShowLogs"
              @rewards="handleShowRewards"
              @info="handleShowInfo"
              @legion="selectLegion"
              @chart="handleShowChart"
              @challenges="handleShowChallenges"
            />

            <RaidOptions
              class="raid-options-right"
              :isFreeRaid="isFreeRaid"
              @log="handleShowLogs"
              @rewards="handleShowRewards"
              @info="handleShowInfo"
              @legion="selectLegion"
              @chart="handleShowChart"
              @challenges="handleShowChallenges"
              @players="showRaidPlayers"
            />
          </div>

          <!--RAID WON-->
          <div class="margin-top-2 flex flex-center" v-else-if="raidWon">
            <Title>{{ $t("raid-victory") }}</Title>

            <template v-if="participant && rewards">
              <RewardsPreview
                class="margin-top-2"
                :rewards="rewards"
              ></RewardsPreview>

              <custom-button
                class="raid-mid-btn margin-top-2"
                @click="claimReward"
              >
                {{ $t("claim-reward") }}
              </custom-button>
            </template>
            <LoadingIndicator
              v-else
              class="margin-top-5"
              color="#fbd766"
              type="scale"
            />
          </div>

          <!--RAID LOST-->
          <div
            class="flex-center"
            v-else-if="
              raidState &&
                raidState.finished &&
                !raidState.defeat &&
                participant
            "
          >
            <div class="width-100 margin-top-2 margin-bottom-2">
              <span
                class="flex font-size-20 flex-center width-100 flex-space-around full-flex"
                >{{ $t("raid-lose", { boss: bossName }) }}</span
              >
            </div>
          </div>

          <!--NOT IN RAID YET-->
          <div class="flex flex-column flex-center" v-else-if="!isFreeRaid">
            <div class="color-panel-2 flex flex-center flex-column">
              <span class="font-size-20">
                {{ $t("time-left") }}
                <span class="enemy-title-font">{{ timer.value }}</span>
              </span>

              <CustomButton
                class="font-size-18 margin-bottom-1 margin-top-2"
                type="grey"
                v-if="!isFreeRaid"
                @click="showRaidPlayers"
                >{{ $t("raid_slots", { s: slots, m: maxSlots }) }}</CustomButton
              >
            </div>

            <div
              class="margin-top-3 flex flex-center width-100 flex-space-around full-flex"
            >
              <custom-button type="grey" @click="handleShowRewards">
                <span class="icon-rloot huge"></span>
              </custom-button>

              <custom-button type="grey" @click="handleShowInfo">
                <span class="icon-info huge"></span>
              </custom-button>

              <!-- <CustomButton type="grey" @click="handleShowChart">
                <span class="icon-chart"></span>
              </CustomButton> -->
            </div>

            <div class="margin-top-2 margin-bottom-2" v-if="$game.load">
              <div class="flex flex-center margin-top-1">
                <crafting-ingridient
                  v-for="essence in requiredJoinEssences"
                  :key="essence.itemId"
                  :ingridient="essence"
                />
              </div>
            </div>

            <span v-if="!levelRequirementMet" class="font-error font-size-18">{{
              $t("no-raid-level", { level: raidLevel })
            }}</span>

            <div class="flex flex-center">
              <CustomButton
                width="28rem"
                type="yellow"
                @click="join"
                :disabled="!(canJoin && canSummonCurrentRaid)"
              >
                <span class="margin-right-half">{{ $t("join") }}</span>

                <IconWithValue iconClass="icon-stamina">{{
                  summonPrice
                }}</IconWithValue>
              </CustomButton>

              <CustomButton
                type="grey"
                @click="goToShop"
                width="20rem"
                v-if="!$game.isFreeAccount"
              >
                {{ $t("pur-tickets") }}
              </CustomButton>
            </div>
          </div>

          <div class="flex flex-column flex-center" v-else>
            <div class="color-panel-2">
              <span class="font-size-25 font-weight-900">
                <span class="font-error">{{ $t("join-solo-r") }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <keep-alive>
      <Challenges v-if="showChallenges" :raidState="raidState"></Challenges>

      <!-- <TokenChart
        v-if="showChart"
        :raidTemplateId="raidState.raidTemplateId"
        @close="showChart = false"
      ></TokenChart> -->
    </keep-alive>

    <portal to="footer" v-if="isActive">
      <CopyButton
        v-if="!isFreeRaid"
        :data="getHref()"
        caption="btn-share"
      ></CopyButton>
    </portal>

    <div
      ref="overlay"
      class="absolute-stretch pointer-events-none text-align-left"
    ></div>

    <SoundEffect
      ref="hitsFx"
      :files="['hit1', 'hit2', 'hit3', 'hit4', 'hit5', 'hit6', 'hit7', 'hit8']"
    />

    <SoundEffect ref="winFx" :files="['combat_win1']" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import IconWithValue from "@/components/IconWithValue.vue";
import CopyButton from "@/components/CopyButton.vue";
import AppSection from "@/AppSection.vue";
import CustomButton from "@/components/Button.vue";
import BossView from "./BossView.vue";
import RewardsPreview from "./RewardsPreview.vue";
import DamageLog from "./DamageLog.vue";
import ClaimedReward from "./ClaimedReward.vue";
import CharacterStats from "@/../../knightlands-shared/character_stat";
import Errors from "@/../../knightlands-shared/errors";
import Prompt from "@/components/Prompt.vue";
import RaidGetterMixin from "./RaidGetterMixin.vue";
import RaidArmy from "./Army/RaidArmy.vue";
import RaidOptions from "./RaidOptions.vue";
import RaidAttackPanel from "./RaidAttackPanel.vue";
import BossAnimation from "./BossAnimation.vue";
import BossDamageText from "./BossDamageText.vue";
import Vue from "vue";
import SpriteAnimator from "@/components/SpriteAnimator.vue";
import Timer from "@/timer.js";
import Title from "@/components/Title.vue";
import RaidsMeta from "@/metadata/raids_meta";
import CraftingIngridient from "@/components/CraftingIngridient.vue";
import SoundEffect from "@/components/SoundEffect.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";

import { create as CreateDialog } from "vue-modal-dialogs";
import Rewards from "./Rewards.vue";
import RaidInfo from "./RaidInfo.vue";
import RaidPlayers from "./RaidPlayers.vue";

const ShowRewards = CreateDialog(
  Rewards,
  "raidTemplateId",
  "isFreeRaid",
  "currentDamage",
  "dktFactor"
);

const ShowRaidInfo = CreateDialog(
  RaidInfo,
  "raidTemplateId",
  "isFreeRaid",
  "weakness",
  "dktFactor",
  "isFirst"
);

const ShowRaidPlayers = CreateDialog(RaidPlayers, "participants", "raidId");

import anime from "animejs/lib/anime.es.js";

const Events = require("@/../../knightlands-shared/events");

import DamageText from "./DamageText.vue";
import NotEnoughResource from "@/components/Modals/NotEnoughResource.vue";

const ShowResourceRefill = CreateDialog(NotEnoughResource, "stat");

const ShowPrompt = CreateDialog(Prompt, "title", "message", "buttons");

const ShowClaimedReward = CreateDialog(
  ClaimedReward,
  "rewards",
  "raidTemplateId"
);

const MAX_LAST_DAMAGES = 10;

export default {
  name: "raid",
  components: {
    CraftingIngridient,
    CustomButton,
    BossView,
    DamageLog,
    DamageText,
    CopyButton,
    Challenges: () => import("./Challenges/Challenges.vue"),
    BossAnimation,
    RaidArmy,
    RaidOptions,
    RaidAttackPanel,
    SpriteAnimator,
    Title,
    RewardsPreview,
    SoundEffect,
    LoadingIndicator,
    IconWithValue
  },
  mixins: [AppSection, RaidGetterMixin, NetworkRequestErrorMixin],
  props: ["raidId"],
  data: () => ({
    attackInProgress: false,
    purchasePromise: null,
    showChallenges: false,
    showChart: false,
    showLog: false,
    raidState: null,
    attackCount: 1,
    raidProgress: {
      current: 1,
      max: 1
    },
    lastDamages: [],
    playerDamages: [],
    lootProgress: {
      current: 1,
      max: 1
    },
    raid: 0,
    bossViewCenter: 0,
    timer: new Timer(true),
    raidWon: false,
    rewards: null
  }),
  created() {
    this.$options.paymentEvents = [Events.RaidJoinStatus];
    this.title = this.$t("raid-view");
    this.damageTextId = 0;
    this.damageLogId = 0;
    this._attackDetailsHandler = this._handleRaidAttackDetails.bind(this);
  },
  async activated() {
    this.init();
  },
  deactivated() {
    this.unsubscribe();
    this.$app.getStatusBar().setDelayResourceUpdate(false);
  },
  destroyed() {
    this.unsubscribe();
  },
  watch: {
    raidId() {
      this.init();
    },
    raidWon() {
      if (this.raidWon) {
        this.$refs.winFx.play();
        this.fetchRewards();
      }
    }
  },
  computed: {
    ...mapGetters("raids", ["canSummonCurrentRaid"]),
    bossName() {
      return RaidsMeta[this.raidState.raidTemplateId].name;
    },
    mainViewNotHidden() {
      return !(this.showChallenges || this.showChart);
    },
    hasChallenges() {
      if (!this.raidState) return false;
      return Object.keys(this.raidState.challenges).length > 0;
    },
    slots() {
      return Object.keys(this.raidState.participants).length;
    },
    participant() {
      if (!this.raidState) {
        return false;
      }
      return this.raidState.participants[this.$game.id] !== undefined;
    },
    currentDamage() {
      return this.raidState.currentDamage;
    },
    dktBonus() {
      return Math.floor(this.raidState.dktFactor * 100) / 100;
    },
    timeLeft() {
      return this.raidState.finished ? 0 : this.raidState.timeLeft;
    },
    currentLootTier() {
      let data = this.data;
      let i = 0;
      const length = this.raidLoot.damageThresholds.length;

      for (; i < length; ++i) {
        let damageThreshold = this.raidLoot.damageThresholds[i];
        let damageRequired =
          (data.health * damageThreshold.relativeThreshold) / data.maxSlots;

        if (damageRequired > this.raidState.currentDamage) {
          break;
        }
      }

      return i;
    },
    isFreeRaid() {
      if (!this.raidState) {
        return false;
      }
      return this.raidState.isFree;
    }
  },
  methods: {
    async showRaidPlayers() {
      await ShowRaidPlayers(this.raidState.participants, this.raidId);
    },
    getHref() {
      return window.location.href;
    },
    goToShop() {
      this.$router.push({
        name: "top-up"
      });
    },
    checkIfRaidWon() {
      this.raidWon =
        this.raidState && this.raidState.finished && this.raidState.defeat;
    },
    async init() {
      this.$store.dispatch("raids/fetchCurrentRaids");
      this.rewards = null;
      await this.getRaid();
      this.bossViewCenter = this.$refs.bossView.center;
      this.checkIfRaidWon();
    },
    selectLegion() {
      this.$router.push({ name: "select-legion" });
    },
    handleShowChart() {
      this.showChart = true;
    },
    handleShowInfo() {
      ShowRaidInfo(
        this.raid,
        this.isFreeRaid,
        this.raidState.weakness,
        this.raidState.dktFactor
      );
    },
    handleShowLogs() {
      this.showLog = !this.showLog;
    },
    handleShowChallenges() {
      this.showChallenges = true;
    },
    handleShowRewards() {
      this.lootProgress.current = this.raidState.currentDamage;

      if (this.raidLoot.damageThresholds) {
        let i = 0;
        const length = this.raidLoot.damageThresholds.length;
        let damageRequired = 0;

        for (; i < length; ++i) {
          if (damageRequired > this.raidState.currentDamage) {
            this.lootProgress.max = Math.floor(damageRequired);
            break;
          }
        }
      }

      ShowRewards(
        this.raid,
        this.isFreeRaid,
        this.currentDamage,
        this.raidState.dktFactor,
        this.raidState.isFirst
      );
    },
    async fetchRewards() {
      this.rewards = await this.$game.fetchRaidRewards(this.raidId);
    },
    async join() {
      await this.performRequest(this.$game.joinRaid(this.raidId));
      await this.init();
      this.$app.logEvent("raid-join", {
        raidMetaId: this.raid,
        isFree: this.isFreeRaid
      });
    },
    async claimReward() {
      let rewards = await this.$game.claimRaidLoot(this.raidId);
      await ShowClaimedReward(rewards.response, this.raidState.raidTemplateId);
      this.$router.replace({ name: "raids" });
    },
    subscribeToRaid() {
      this.unsubscribe();
      this.channel = this.$game.createChannel(`raid/${this.raidId}`);
      this.channel.watch(this._handleEvents.bind(this));
    },
    unsubscribe() {
      if (this.channel) {
        this.channel.destroy();
        this.channel = null;
      }
      this.$game.off(Events.RaidDamaged, this._attackDetailsHandler);
    },
    handleBackButton() {
      if (this.showChallenges) {
        this.showChallenges = false;
        return true;
      }

      if (this.showChart) {
        this.showChart = false;
        return true;
      }

      this.$router.back();
      return true;
    },
    async getRaid() {
      if (!this.raidId || this.raidFetchingInProcess) {
        return;
      }

      this.raidFetchingInProcess = true;
      try {
        this.raidState = await this.performRequest(
          this.$game.fetchRaid(this.raidId)
        );
        this.raid = this.raidState.raidTemplateId;
        this.raidProgress.current = this.raidState.bossState.health;
        this.raidProgress.max = this.raidMaxHealth;
        this.lastDamages = this.raidState.damageLog;
        this.timer.timeLeft = this.raidState.timeLeft;
        this.timer.update();

        // if raid is not finished - try to listen
        if (!this.raidState.finished) {
          this.subscribeToRaid();
          this.$game.on(Events.RaidDamaged, this._attackDetailsHandler);
        }
      } catch (exc) {
        console.error(exc);
      } finally {
        this.raidFetchingInProcess = false;
      }
    },
    async handleAttack(hits) {
      try {
        this.$app.getStatusBar().setDelayResourceUpdate(true);

        const { alive } = await this.performRequestNoCatch(
          this.$game.attackRaidBoss(
            this.raidId,
            hits,
            this.$store.state.selectedLegion
          )
        );

        if (!alive) {
          this.$app.getStatusBar().setDelayResourceUpdate(false);
          let reponse = await ShowPrompt(
            "player-raid-killed-title",
            this.$t("player-raid-killed-message", {
              boss: this.$t(this.bossName)
            }),
            [
              {
                type: "yellow",
                response: true,
                title: "do-refill"
              }
            ]
          );

          if (reponse === true) {
            this.$game.openRefill(CharacterStats.Health);
          }
        }
      } catch (error) {
        this._handleAttackRaidError(error);
        this.$app.getStatusBar().setDelayResourceUpdate(false);
      }
    },
    async _handleRaidAttackDetails(data) {
      if (data.raid != this.raidId) {
        return;
      }

      this.attackInProgress = true;

      try {
        const bossDamage =
          data.boss.damage == 0 ? this.$t("dodged") : data.boss.damage * -1;

        const bossDamageInstance = new (Vue.extend(BossDamageText))({
          propsData: {
            damage: bossDamage
          }
        });
        bossDamageInstance.$mount();
        this.$refs.bossAnimation.playAttack();

        await Promise.all([
          this.$app
            .getStatusBar()
            .attractToResource(
              bossDamageInstance,
              "health",
              this.bossViewCenter,
              bossDamage,
              this.$refs.overlay
            )
        ]);

        this._handleArmyDamage(data.player.damage);
        await this._handlePlayerDamage(
          data.player.damage,
          data.player.crit,
          true
        );
        await this.$app
          .getStatusBar()
          .showResourceGained(
            "softCurrency",
            this.bossViewCenter,
            data.soft,
            this.$refs.overlay
          );

        await this.$app
          .getStatusBar()
          .showResourceGained(
            "exp",
            this.bossViewCenter,
            data.exp,
            this.$refs.overlay
          );

        await this.$refs.army.play(
          data.armyDamage,
          data.procs,
          data.health,
          data.energy,
          data.stamina,
          this.$refs.overlay
        );
      } finally {
        this.$app.getStatusBar().setDelayResourceUpdate(false);
        this.attackInProgress = false;
        this.$refs.attackPanel.checkStamina();
        this.checkIfRaidWon();
      }
    },
    _handleEvents(data) {
      switch (data.event) {
        case Events.RaidDamaged:
          this._handleRaidDamage(data);
          break;

        case Events.RaidFinished:
          this._handleRaidFinished(data);
          break;

        case Events.RaidChallengeUpdate:
          this._handleChallengeUpdate(data);
          break;
      }
    },
    _handleChallengeUpdate(data) {
      this.raidState.challenges[data.type] = data.data;
    },
    _handleRaidDamage(data) {
      this.lastDamages.push({
        name: data.name,
        by: data.by,
        damage: data.damage,
        id: this.damageLogId++,
        hits: data.hits
      });

      if (this.lastDamages.length > MAX_LAST_DAMAGES) {
        this.lastDamages.splice(0, 1);
      }

      this.raidState.participants[data.by] += data.damage;

      if (data.by == this.$game.id) {
        // increase current damage
        this.raidState.currentDamage += data.damage;
        return;
      } else {
        this._handleArmyDamage(data.damage);
      }

      this._handlePlayerDamage(data.damage, data.crit, false);
    },
    _handleRaidFinished(data) {
      this.raidState.finished = true;

      if (data.defeat) {
        this.raidState.defeat = true;
      }
    },
    _handleArmyDamage(damage) {
      this.$refs.bossAnimation.playDamageTaken();
      this.$refs.impact.play();
      this.$refs.hitsFx.play();
      this.raidProgress.current -= damage;
      if (this.raidProgress.current < 0) {
        this.raidProgress.current = 0;
      }
    },
    async _handlePlayerDamage(damage, crit, local) {
      this.playerDamages.push({
        local: local,
        damage: damage,
        crit: crit,
        id: this.damageTextId++
      });

      setTimeout(() => {
        this.playerDamages.splice(0, 1);
      }, 4000);

      // anime.remove(this.$refs.bossView.$refs.image);

      // shake boss image
      let timeline = anime.timeline({
        targets: this.$refs.bossView.$refs.image
      });

      if (crit) {
        timeline.add({
          translateX: function(el, i) {
            return `-=${anime.random(-1, -2)}rem`;
          },
          translateY: function(el, i) {
            return `-=${anime.random(-1, 1)}rem`;
          },
          scale: 1.2 + Math.random() * 0.2,
          duration: 0,
          loop: 1
        });
      }

      timeline.add(
        {
          filter: "brightness(100)",
          duration: 0
        },
        0
      );

      timeline.add({
        translateX: 0,
        translateY: 0,
        scale: 1,
        filter: {
          value: "brightness(1)",
          easeing: "",
          duration: 100
        }
      });

      await timeline.finished;
    },
    async _handleAttackRaidError(error) {
      switch (error) {
        case Errors.NoHealth:
          await ShowResourceRefill(CharacterStats.Health);
          break;

        case Errors.NoStamina:
          await ShowResourceRefill(CharacterStats.Stamina);
          break;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.btn-fix {
  margin-top: 0.3rem;
}

.raid-mid-btn {
  width: 15rem;
}

.raid-controls {
  display: grid;
  grid-template-columns: 8rem 1fr 8rem;
  grid-template-rows: 5rem 1fr;

  > .raid-army {
    grid-row: 2;
    grid-column: 2;
  }

  > .attack {
    grid-row: 1;
    grid-column: ~"1/4";
  }

  > .raid-options-left {
    grid-row: ~"1/3";
    grid-column: 1;
    place-self: stretch;
  }

  > .raid-options-right {
    grid-row: ~"1/3";
    grid-column: 3;
    place-self: stretch;
  }
}

.impact-container {
  &:nth-child(0) {
    left: 30%;
  }
}
</style>
