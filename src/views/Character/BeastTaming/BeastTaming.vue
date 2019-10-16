<template>
  <div v-bar>
    <div class="relative flex flex-column flex-center flex-no-wrap">
    <EnemyView :name="name" background="/images/beast_bg.png" :image="enemyImage">
      <FloatingTextContainer
        ref="floatingText"
        class="absolute-stretch"
        :config="{fontSizeNormal: 3, fontSizeCrit: 3}"
      ></FloatingTextContainer>
    </EnemyView>

    <div class="flex flex-center width-100">
      <span class="font-size-20 margin-left-1 margin-right-1">{{$t("beast-level", {level: level})}}</span>
      <ProgressBar
        v-model="exp"
        :maxValue="nextExp"
        barType="yellow"
        :expand="false"
        :hideValues="isMax"
        class="flex-8 margin-right-1"
      ></ProgressBar>
    </div>

    <div
      class="width-100 margin-bottom-1 margin-top-half att-row flex flex-center font-size-20 flex-space-between"
    >
      <div class="flex flex-3 flex-column margin-right-1 text-align-right">
        <div
          v-for="(statValue, statId) in stats"
          :key="statId"
          class="margin-bottom-half width-100"
        >{{$t(statId)}}</div>
      </div>

      <div class="flex flex-3 text-align-left" :class="{'flex-6': !isMax}">
        <div class="flex flex-column">
          <div
            v-for="(statValue, statId) in stats"
            :key="statId"
            class="margin-bottom-half flex flex-center flex-end width-100"
          >{{statValue}}</div>
        </div>

        <div class="flex flex-column" v-if="!isMax">
          <div
            v-for="(statValue, statId) in stats"
            :key="statId"
            class="margin-bottom-half flex flex-center flex-start width-100"
          >
            <span class="margin-left-2 margin-right-2 right-arrow"></span>
            <span class="rarity-rare">{{futureStats[statId]}}</span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="panel width-100 flex flex-column margin-left-half margin-right-half padding-bottom-2 padding-top-1"
      v-if="!isMax"
    >
      <span class="title font-size-22 margin-bottom-1">{{$t('regular-boost')}}</span>

      <div class="width-100 flex flex-space-evenly font-size-18 margin-bottom-2">
        <div class="flex flex-column width-45">
          <span>{{$t("beast-boost", {count: 1})}}</span>
          <PromisedButton :promise="request" :props="{type:'yellow'}" @click="regularBoost(1)" :disabled="!canBoost(1)">
            <IconWithValue iconClass="icon-gold">{{softPrice}}</IconWithValue>
          </PromisedButton>
        </div>

        <div class="flex flex-column width-45">
          <span>{{$t("beast-boost", {count: 50})}}</span>
          <PromisedButton :promise="request" :props="{type:'yellow'}" @click="regularBoost(50)" :disabled="!canBoost(50)">
            <IconWithValue iconClass="icon-gold">{{softPrice * 50}}</IconWithValue>
          </PromisedButton>
        </div>
      </div>

      <span class="title font-size-22 margin-bottom-1" @click="showAdvancedBoostInfo">
        <IconWithValue iconClass="icon-info" :flip="true">{{$t('adv-boost')}}</IconWithValue>
      </span>

      <div class="width-100 flex flex-column flex-center" v-if="totalSouls() > 0">
        <div class="flex flex-center panel-input padding-1 font-size-18">
          <span>{{$t(beastItemName)}}</span>
          <div class="item-icon" :style="ticketIcon"></div>
          <span>{{totalSouls()}}</span>
        </div>

        <div class="width-100 flex flex-space-evenly font-size-18">
          <div class="flex flex-column width-45">
            <span>{{$t("beast-boost", {count: 1})}}</span>
            <PromisedButton
              :promise="request"
              :props="{type:'green'}"
              @click="advancedBoost(1)"
            >
              <div class="flex flex-items-center padding-left-1 padding-right-1">
                <div class="item-icon" :style="ticketIcon"></div>
                <span class="font-size-18">1</span>
              </div>
            </PromisedButton>
          </div>

          <div class="flex flex-column width-45" v-if="batchBoost() > 1">
            <span>{{$t("beast-boost", {count: batchBoost()})}}</span>
            <PromisedButton
              :promise="request"
              :props="{type:'green'}"
              @click="advancedBoost(batchBoost())"
            >
              <div class="flex flex-items-center padding-left-1 padding-right-1">
                <div class="item-icon" :style="ticketIcon"></div>
                <span class="font-size-18">{{batchBoost()}}</span>
              </div>
            </PromisedButton>
          </div>
        </div>
      </div>

      <PaymentStatus
        :request="statusRequest"
        @pay="continuePurchase"
        @cancel="cancelPurchase"
        :cancel="true"
        v-else
      >
        <div class="width-100 flex flex-space-evenly font-size-18">
          <div
            class="flex flex-column width-45"
            v-for="(iapMeta, index) in iaps"
            :key="iapMeta.iap"
          >
            <span>{{$t("beast-souls", {count: iapMeta.ticketsCount})}}</span>
            <PromisedButton
              :promise="request"
              :props="{type:'green'}"
              @click="purchaseBoostItems(index)"
            >
              <PriceTag :dark="true" :iap="iapMeta.iap"></PriceTag>
            </PromisedButton>
          </div>
        </div>
      </PaymentStatus>
    </div>

    <PromisedButton
      v-else-if="canEvolve"
      :props="{type:'yellow'}"
      @click="evolve"
    >{{$t("beast-evolve")}}</PromisedButton>
  </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import Beasts from "@/beasts";
import UiConstants from "@/ui_constants";
import CharacterStats from "@/../knightlands-shared/character_stat.js";
import PromisedButton from "@/components/PromisedButton.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import PaymentHandler from "@/components/PaymentHandler.vue";
import PaymentStatus from "@/components/PaymentStatus.vue";
import PriceTag from "@/components/PriceTag.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import FloatingTextContainer from "@/components/FloatingTextContainer.vue";
import EnemyView from "@/components/EnemyView.vue";

const Events = require("@/../knightlands-shared/events");

const MaxBoostSize = 50;

export default {
  mixins: [AppSection, PaymentHandler, PromptMixin],
  components: {
    PromisedButton,
    IconWithValue,
    PaymentStatus,
    PriceTag,
    ProgressBar,
    FloatingTextContainer,
    EnemyView
  },
  data: () => ({
    request: null,
    statusRequest: null,
    beast: {
      level: 0,
      index: 0,
      exp: 0
    }
  }),
  created() {
    this.$options.paymentEvents = [Events.ItemPurchased];
  },
  activated() {
    this.$set(this, "beast", this.$game.beast());
    this.fetchPaymentStatus();
  },
  computed: {
    beastItemName() {
      return this.$game.itemsDB.getName(Beasts.ticketItem);
    },
    stats() {
      let beastIndex = this.beastIndex;
      let level = this.level;

      let stats = {};
      stats[CharacterStats.Health] = 0;
      stats[CharacterStats.Attack] = 0;
      stats[CharacterStats.Defense] = 0;

      if (level == 0) {
        if (beastIndex > 0) {
          beastIndex--;
          level = Beasts.levels[beastIndex].levels.length - 1;
        } else {
          return stats;
        }
      } else {
        level--;
      }

      let data = Beasts.levels[beastIndex].levels[level];
      stats[CharacterStats.Health] = data.health;
      stats[CharacterStats.Attack] = data.attack;
      stats[CharacterStats.Defense] = data.defense;

      return stats;
    },
    exp() {
      return this.beast.exp;
    },
    beastIndex() {
      return this.beast.index;
    },
    name() {
      return Beasts.levels[this.beastIndex].name;
    },
    level() {
      return this.beast.level;
    },
    isMax() {
      return this.level >= Beasts.levels[this.beastIndex].levels.length;
    },
    canEvolve() {
      return this.beastIndex < Beasts.levels.length + 1;
    },
    nextExp() {
      return this.isMax
        ? 0
        : Beasts.levels[this.beastIndex].levels[this.level].expRequired;
    },
    futureStats() {
      let stats = {};
      let data = Beasts.levels[this.beastIndex].levels[this.level];
      stats[CharacterStats.Health] = data.health;
      stats[CharacterStats.Attack] = data.attack;
      stats[CharacterStats.Defense] = data.defense;
      return stats;
    },
    softPrice() {
      return Beasts.softPrice;
    },
    ticketIcon() {
      return `background-image: url(${this.$game.itemsDB.getIcon(
        Beasts.ticketItem
      )});`;
    },
    enemyImage() {
      return Beasts.levels[this.beastIndex].image;
    },

    iaps() {
      return Beasts.iaps;
    }
  },
  methods: {
    canBoost(count) {
      return count * this.softPrice <= this.$game.softCurrency;
    },
    batchBoost() {
      return this.totalSouls() > MaxBoostSize
        ? MaxBoostSize
        : this.totalSouls();
    },
    totalSouls() {
      return this.$game.inventory.getItemsCountByTemplate(Beasts.ticketItem);
    },
    async fetchPaymentStatus() {
      this.statusRequest = this.$game.fetchBeastBoostPurchase();
      await this.statusRequest;
    },
    evolve() {
      this.request = this.$game.evolveBeast();
    },
    async regularBoost(count) {
      this.request = this.$game.beastRegularBoost(count);

      const result = await this.request;
      this.handleBoostResult(result);
    },
    async advancedBoost(count) {
      this.request = this.$game.beastAdvancedBoost(count);

      const result = await this.request;
      this.handleBoostResult(result);
    },
    async purchaseBoostItems(iapIndex) {
      this.request = this.$game.purchaseBeastBoost(iapIndex);
      await this.purchaseRequest(this.request);
    },
    handleBoostResult(result) {
      this.$refs.floatingText.addFloatingText(
        this.$t("beast_exp", { exp: result.exp })
      );

      if (result.crits) {
        this.$refs.floatingText.addFloatingText(
          this.$t("beast_exp_crit", { count: result.crits }),
          true
        );
      }
    },
    showAdvancedBoostInfo() {
      this.showPrompt("hint", "adv-boost-info", [
        {
          title: "btn-ok",
          type: "grey"
        }
      ]);
    }
  }
};
</script>