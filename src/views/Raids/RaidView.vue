<template>
  <Promised class="flex flex-column flex-start relative" :promise="request" :pendingDelay="200">
    <template v-slot:combined="{ isPending, isDelayOver, data }">
      <div>
        <loading-screen :loading="true" v-show="isDelayOver && (isPending || !raidData)"></loading-screen>

        <template v-if="raidData">
          <boss-view
            class="margin-bottom-2"
            ref="bossView"
            :progress="raidProgress"
            :raidTemplateId="raidData.raidTemplateId"
            :timeLeft="timeLeft"
          >
            <DamageText
              v-for="(damage) in playerDamages"
              :key="damage.id"
              :crit="damage.crit"
            >{{damage.damage}}</DamageText>

            <DamageLog :log="lastDamages"></DamageLog>
          </boss-view>

          <div class="flex flex-center font-size-20 margin-bottom-1">
            <IconWithValue iconClass="icon-user">
              <span class="font-size-20 white-space-wide">{{slots}}/{{maxSlots}}</span>
            </IconWithValue>
            <span>{{$t("slots-avaialble")}}</span>
          </div>

          <!--COMBAT VIEW-->
          <striped-panel v-if="participant">
            <div class="title font-size-20 font-weight-700 rarity-mythical">
              <span class="white-space">{{$t("dkt-bonus")}}</span>
              <span>x{{dktBonus}}</span>
            </div>

            <striped-content
              classes="margin-top-3"
              stripeHeight="8rem"
              contentClasses="width-100 flex flex-center"
            >
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
            </striped-content>

            <div
              class="flex flex-center width-100 margin-top-3 margin-bottom-3 flex-space-around full-flex"
            >
              <custom-button type="grey" class="raid-mid-btn" @click="showChallenges = true">
                <icon-with-value
                  valueClass="font-size-20 btn-fix"
                  iconClass="icon-challenge"
                >{{$t("challenges")}}</icon-with-value>
              </custom-button>

              <custom-button type="grey" class="raid-mid-btn" @click="showRewards = true">
                <icon-with-value
                  valueClass="font-size-20 btn-fix"
                  iconClass="icon-loot"
                >{{$t("rewards")}}</icon-with-value>
              </custom-button>

              <custom-button type="grey" class="raid-mid-btn" @click="showInfo = true">
                <icon-with-value
                  valueClass="font-size-20 btn-fix"
                  iconClass="icon-info dark"
                >{{$t("raid-info")}}</icon-with-value>
              </custom-button>
            </div>

            <div class="flex flex-center flex-space-evenly">
              <AttackButton :promise="request" :mini="true" @click="attack(1)">x1</AttackButton>
              <AttackButton :promise="request" :mini="true" @click="attack(5)">x5</AttackButton>
              <AttackButton :promise="request" :mini="true" @click="attack(10)">x10</AttackButton>
              <AttackButton :promise="request" :mini="true" :locked="true" @click="attack(20)">x20</AttackButton>
              <AttackButton :promise="request" :mini="true" :locked="true" @click="attack(50)">x50</AttackButton>
            </div>
          </striped-panel>

          <!--RAID WON-->
          <striped-panel
            contentClasses="flex-center"
            v-else-if="raidData && raidData.finished && raidData.defeat"
          >
            <striped-content
              stripeHeight="5rem"
              class="width-100 margin-top-2 margin-bottom-2"
              contentClasses="width-100 flex flex-center"
            >
              <span
                class="flex font-size-25 font-weight-700 flex-center width-100 flex-space-around full-flex"
              >{{$t("raid-victory")}}</span>
            </striped-content>

            <custom-button class="raid-mid-btn" @click="claimReward">
              <span>{{$t("claim-reward")}}</span>
            </custom-button>
          </striped-panel>

          <!--RAID LOST-->
          <striped-panel
            contentClasses="flex-center"
            v-else-if="raidData && raidData.finished && !raidData.defeat"
          >
            <striped-content
              stripeHeight="5rem"
              class="width-100 margin-top-2 margin-bottom-2"
              contentClasses="width-100 flex flex-center"
            >
              <span
                class="flex font-size-20 flex-center width-100 flex-space-around full-flex"
              >{{$t("raid-lose", {boss: bossName})}}</span>
            </striped-content>
          </striped-panel>

          <!--NOT IN RAID YET-->
          <striped-panel contentClasses="flex-center" v-else>
            <div class="title font-size-20 font-weight-700 rarity-mythical">
              <span class="white-space">{{$t("dkt-bonus")}}</span>
              <span>x{{dktBonus}}</span>
            </div>

            <div
              class="margin-top-3 flex flex-center width-100 margin-bottom-3 flex-space-around full-flex"
            >
              <custom-button type="grey" class="raid-mid-btn" @click="showChallenges = true">
                <icon-with-value
                  valueClass="font-size-20 btn-fix"
                  iconClass="icon-challenge"
                >{{$t("challenges")}}</icon-with-value>
              </custom-button>

              <custom-button type="grey" class="raid-mid-btn" @click="showRewards = true">
                <icon-with-value
                  valueClass="font-size-20 btn-fix"
                  iconClass="icon-loot"
                >{{$t("rewards")}}</icon-with-value>
              </custom-button>

              <custom-button type="grey" class="raid-mid-btn" @click="showInfo = true">
                <icon-with-value
                  valueClass="font-size-20 btn-fix"
                  iconClass="icon-info dark"
                >{{$t("raid-info")}}</icon-with-value>
              </custom-button>
            </div>

            <PaymentStatus :request="statusRequest" @pay="continuePurchase">
              <PromisedButton
                :promise="purchasePromise"
                width="16rem"
                type="yellow"
                @click="join"
              >
                <span class="margin-right-half">{{$t("join")}}</span>
                <PriceTag :dark="true" :iap="stageData.joinIap"></PriceTag>
              </PromisedButton>
            </PaymentStatus>
          </striped-panel>

          <keep-alive>
            <Rewards
              v-if="showRewards"
              :raidTemplateId="raidData.raidTemplateId"
              :stage="raidData.stage"
              :currentDamage="currentDamage"
              :dktFactor="raidData.dktFactor"
              @close="showRewards=false"
            ></Rewards>

            <Challenges
              v-if="showChallenges"
              :challenges="raidData.challenges"
              :raidData="raidData"
            ></Challenges>

            <RaidInfo
              v-if="showInfo"
              :raidTemplateId="raidData.raidTemplateId"
              :stage="raidData.stage"
              :weakness="raidData.weakness"
              :dktFactor="raidData.dktFactor"
              @close="showInfo = false"
            ></RaidInfo>
          </keep-alive>
        </template>
      </div>
    </template>

    <template v-slot:rejected="error">
      <div class="full-flex flex flex-center">
        <p class="font-size-20 font-error">{{$t("unknown-error-msg")}}</p>
        <custom-button @click="getRaid">{{$t("try-again")}}</custom-button>
      </div>
    </template>
  </Promised>
</template>

<script>
import PaymentHandler from "@/components/PaymentHandler.vue";
import CopyButton from "@/components/CopyButton.vue";
import AppSection from "@/AppSection";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import CustomButton from "@/components/Button.vue";
import RaidsMeta from "@/raids_meta";
import BossView from "./BossView.vue";
import StripedPanel from "@/components/StripedPanel.vue";
import StripedContent from "@/components/StripedContent.vue";
import DifficultySelector from "@/components/DifficultySelector.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import DamageLog from "./DamageLog.vue";
import ClaimedReward from "./ClaimedReward.vue";
import CharacterStats from "@/../knightlands-shared/character_stat";
import Errors from "@/../knightlands-shared/errors";
import Prompt from "@/components/Prompt.vue";
import PaymentStatus from "@/components/PaymentStatus.vue";
import PromisedButton from "@/components/PromisedButton.vue";
import AttackButton from "@/components/AttackButton.vue";
import PriceTag from "@/components/PriceTag.vue";

import { create as CreateDialog } from "vue-modal-dialogs";
import Rewards from "./Rewards.vue";
import RaidInfo from "./RaidInfo.vue";
import Challenges from "./Challenges/Challenges.vue";
import anime from "animejs/lib/anime.es.js";

const Events = require("@/../knightlands-shared/events");

import DamageText from "./DamageText.vue";
import NotEnoughResource from "@/components/Modals/NotEnoughResource.vue";

const ShowResourceRefill = CreateDialog(
  NotEnoughResource,
  ...NotEnoughResource.props
);

const ShowPrompt = CreateDialog(Prompt, ...Prompt.props);

const ShowReward = CreateDialog(ClaimedReward, ...ClaimedReward.props);

export default {
  name: "raid",
  components: {
    LoadingScreen,
    Promised,
    CustomButton,
    BossView,
    StripedPanel,
    StripedContent,
    DifficultySelector,
    IconWithValue,
    Rewards,
    ProgressBar,
    DamageLog,
    DamageText,
    Challenges,
    PaymentStatus,
    PromisedButton,
    PriceTag,
    RaidInfo,
    AttackButton
  },
  channel: undefined,
  mixins: [AppSection, PaymentHandler],
  props: ["raid"],
  data: () => ({
    statusRequest: null,
    purchasePromise: null,
    showRewards: false,
    showChallenges: false,
    showInfo: false,
    raidData: null,
    request: null,
    raidProgress: {
      current: 1,
      max: 1
    },
    lastDamages: [],
    playerDamages: [],
    lootProgress: {
      current: 1,
      max: 1
    }
  }),
  created() {
    this.$options.paymentEvents = [Events.RaidJoinStatus];
    this.title = this.$t("raid-view");
    this.damageTextId = 0;
    this.damageLogId = 0;
  },
  async activated() {
    await this.getRaid();

    this.addFooter(CopyButton, {
      caption: "btn-share",
      data: window.location.href
    });

    if (!this.participant) {
      this.fetchPaymentStatus();
    }
  },
  deactivated() {
    this.unsubscribe();
  },
  destroyed() {
    this.unsubscribe();
  },
  watch: {
    raid() {
      this.getRaid();
    }
  },
  computed: {
    slots() {
      return this.raidData.busySlots;
    },
    maxSlots() {
      return this.meta.stages[this.raidData.stage].maxSlots;
    },
    meta() {
      if (!this.raidData) {
        return {};
      }
      return RaidsMeta[this.raidData.raidTemplateId] || {};
    },
    stageData() {
      return this.meta.stages[this.raidData.stage];
    },
    participant() {
      if (!this.raidData) {
        return false;
      }

      return (
        this.raidData.currentDamage !== undefined && !this.raidData.finished
      );
    },
    currentDamage() {
      return this.raidData.currentDamage;
    },
    dktBonus() {
      return Math.floor(this.raidData.dktFactor * 100) / 100;
    },
    timeLeft() {
      return this.raidData.finished ? 0 : this.raidData.timeLeft;
    },
    bossName() {
      return this.$t(this.meta.name);
    },
    currentLootTier() {
      let raidStage = this.meta.stages[this.raidData.stage];
      let i = 0;
      const length = raidStage.loot.damageThresholds.length;

      this.lootProgress.current = this.raidData.currentDamage;

      for (; i < length; ++i) {
        let damageThreshold = raidStage.loot.damageThresholds[i];

        let damageRequired =
          (raidStage.health * damageThreshold.relativeThreshold) /
          raidStage.maxSlots;

        if (damageRequired > this.raidData.currentDamage) {
          this.lootProgress.max = Math.floor(damageRequired);
          break;
        }
      }

      return i;
    }
  },
  methods: {
    fetchPaymentStatus() {
      this.statusRequest = this.$game.fetchRaidJoinStatus(this.raid);
    },
    async handlePaymentComplete(iap, context) {
      await this.getRaid();
    },
    async join() {
      this.purchasePromise = this.$game.joinRaid(this.raid);
      await this.purchaseRequest(this.purchasePromise);
    },
    async claimReward() {
      let rewards = await this.$game.claimRaidLoot(this.raid);
      await ShowReward(rewards.response, this.raidData.raidTemplateId);
      this.handleBackButton();
    },
    subscribeToRaid() {
      this.unsubscribe();
      this.channel = this.$game.createChannel(`raid/${this.raid}`);
      this.channel.watch(this._handleEvents.bind(this));
    },
    unsubscribe() {
      if (this.channel) {
        this.channel.destroy();
        this.channel = null;
      }
    },
    handleBackButton() {
      if (this.showChallenges) {
        this.showChallenges = false;
        return true;
      }

      this.$router.back();
      return true;
    },
    async getRaid() {
      if (!this.raid) {
        return;
      }

      this.request = this.$game.fetchRaid(this.raid);

      try {
        this.raidData = await this.request;
        this.raidProgress.current = this.raidData.bossState.health;
        this.raidProgress.max = this.stageData.health;
        this.lastDamages = this.raidData.damageLog;

        // if raid is not finished - try to listen
        if (!this.raidData.finished) {
          this.subscribeToRaid();
        }
      } catch (exc) {
        console.error(exc);
      }
    },
    async attack(hits) {
      this.request = this.$game.attackRaidBoss(this.raid, hits);

      try {
        await this.request;

        if (!this.$game.character.alive) {
          let reponse = await ShowPrompt(
            "player-raid-killed-title",
            this.$t("player-raid-killed-message", { boss: this.bossName }),
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
        console.error(error);
        this._handleAttackRaidError(error);
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
      this.raidData.challenges[data.type] = data.data;
    },
    _handleRaidDamage(data) {
      this.raidProgress.current = data.bossHp;

      if (data.by == this.$game.account) {
        // increase current damage
        this.raidData.currentDamage += data.damage;
      }

      this._handlePlayerDamage(data.damage, data.crit, data.hits);
    },
    _handleRaidFinished(data) {
      this.raidData.finished = true;

      if (data.defeat) {
        this.raidData.defeat = true;
      }
    },
    _handlePlayerDamage(damage, crit, hits) {
      this.lastDamages.push({
        by: this.$game.account,
        damage,
        id: this.damageLogId++,
        hits: hits
      });

      if (this.lastDamages.length > 10) {
        this.lastDamages.splice(0, 1);
      }

      this.playerDamages.push({
        damage: damage,
        crit: crit,
        id: this.damageTextId++
      });

      setTimeout(() => {
        this.playerDamages.splice(0, 1);
      }, 3000);

      anime.remove(this.$refs.bossView.$refs.image);

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
</style>


