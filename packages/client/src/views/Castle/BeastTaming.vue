<template>
  <div v-bar>
    <div class="screen-content">
      <div class="screen-background"></div>
      <EnemyView
        class="beast-image"
        :name="name"
        background="/images/beast_bg.png"
        :image="enemyImage"
      >
        <FloatingTextContainer
          ref="floatingText"
          class="absolute-stretch"
          :config="{ fontSizeNormal: 3, fontSizeCrit: 3 }"
        ></FloatingTextContainer>
      </EnemyView>

      <div class="flex flex-center width-100 margin-top-half">
        <span
          class="font-size-20 margin-left-1 margin-right-1 font-outline font-weight-900"
          >{{ $t("beast-level", { level: level }) }}</span
        >
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
        class="width-100 margin-bottom-1 margin-top-half att-row flex flex-center font-size-20 flex-space-between color-panel-1"
      >
        <div class="flex flex-3 flex-column margin-right-1 text-align-right">
          <div
            v-for="(statValue, statId) in stats"
            :key="statId"
            class="margin-bottom-half width-100"
          >
            {{ $t(statId) }}
          </div>
        </div>

        <div class="flex flex-3 text-align-left" :class="{ 'flex-4': !isMax }">
          <div class="flex flex-column">
            <div
              v-for="(statValue, statId) in stats"
              :key="statId"
              class="margin-bottom-half flex flex-center flex-end width-100"
            >
              {{ statValue }}
            </div>
          </div>

          <div class="flex flex-column" v-if="!isMax">
            <div
              v-for="(statValue, statId) in stats"
              :key="statId"
              class="margin-bottom-half flex flex-center flex-start width-100"
            >
              <span class="margin-left-2 margin-right-2 right-arrow"></span>
              <span class="rarity-rare">{{ futureStats[statId] }}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex flex-column padding-bottom-2 padding-top-1"
        v-if="!isMax"
      >
        <Title class="margin-bottom-1">{{ $t("regular-boost") }}</Title>

        <div
          class="width-100 flex flex-space-evenly font-size-18 margin-bottom-2"
        >
          <PurchaseButton
            class="width-45"
            type="grey"
            @click="regularBoost(1)"
            :soft="true"
            :price="softPrice"
          >
            <span class="margin-right-1">{{
              $t("beast-boost", { count: 1 })
            }}</span>
          </PurchaseButton>

          <PurchaseButton
            class="width-45"
            type="grey"
            @click="regularBoost(50)"
            :soft="true"
            :price="softPrice * 50"
          >
            <span class="margin-right-1">{{
              $t("beast-boost", { count: 50 })
            }}</span>
          </PurchaseButton>
        </div>

        <Title
          :stackBottom="true"
          class="margin-bottom-1"
          @click="showAdvancedBoostInfo"
        >
          <IconWithValue
            iconClass="icon-info"
            :flip="true"
            :iconMargin="true"
            >{{ $t("adv-boost") }}</IconWithValue
          >
        </Title>

        <div
          class="width-100 flex flex-column flex-center color-panel-1"
          v-if="totalSouls() > 0"
        >
          <div
            class="flex flex-center padding-left-1 padding-right-1 font-size-18 margin-bottom-1"
          >
            <span>{{ $t(beastItemName) }}</span>
            <div class="item-icon" :class="ticketIcon"></div>
            <span>{{ totalSouls() }}</span>
          </div>

          <div class="width-100 flex flex-space-evenly font-size-18">
            <CustomButton
              type="yellow"
              class="width-45"
              @click="advancedBoost(1)"
            >
              <div
                class="flex flex-items-center padding-left-1 padding-right-1"
              >
                <span class="margin-right-1">{{
                  $t("beast-boost", { count: 1 })
                }}</span>
                <div class="item-icon" :class="ticketIcon"></div>
                <span>1</span>
                <BeastMarker class="marker-pos" />
              </div>
            </CustomButton>

            <CustomButton
              class="width-45"
              v-if="batchBoost() > 1"
              type="yellow"
              @click="advancedBoost(batchBoost())"
            >
              <div
                class="flex flex-items-center padding-left-1 padding-right-1"
              >
                <span class="margin-right-1">{{
                  $t("beast-boost", { count: batchBoost() })
                }}</span>
                <div class="item-icon" :class="ticketIcon"></div>
                <span>{{ batchBoost() }}</span>
                <BeastMarker class="marker-pos" />
              </div>
            </CustomButton>
          </div>
        </div>

        <div class="width-100 flex flex-space-evenly font-size-18 margin-top-2">
          <PurchaseButton
            v-for="(iapMeta, index) in iaps"
            :key="index"
            :price="iapMeta.price"
            class="width-45 margin-bottom-1"
            type="green"
            @click="purchaseBoostItems(index)"
          >
            <span class="margin-right-1">{{
              $t("beast-boost", { count: iapMeta.ticketsCount })
            }}</span>
          </PurchaseButton>
        </div>
      </div>

      <div v-else-if="canEvolve" class="flex flex-center width-100">
        <CustomButton type="green" @click="evolve">{{
          $t("beast-evolve")
        }}</CustomButton>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import Beasts from "@/beasts";
import BeastMarker from "@/components/Markers/Castle/BeastMarker.vue";
import CharacterStats from "@/../../knightlands-shared/character_stat.js";
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import FloatingTextContainer from "@/components/FloatingTextContainer.vue";
import EnemyView from "@/components/EnemyView.vue";
import Title from "@/components/Title.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import PurchaseButton from "@/components/PurchaseButton.vue";

const Events = require("@/../../knightlands-shared/events");

const MaxBoostSize = 50;

export default {
  mixins: [AppSection, PromptMixin, NetworkRequestErrorMixin],
  components: {
    BeastMarker,
    PurchaseButton,
    CustomButton,
    ProgressBar,
    FloatingTextContainer,
    EnemyView,
    Title
  },
  data: () => ({
    beast: {
      level: 0,
      index: 0,
      exp: 0
    }
  }),
  created() {
    this.$options.paymentEvents = [Events.ItemPurchased];
    this.$options.useRouterBack = true;
    this.title = "window-beast";
  },
  activated() {
    this.$set(this, "beast", this.$game.beast());
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
      return this.$game.itemsDB.getIcon(Beasts.ticketItem);
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
    evolve() {
      this.request = this.$game.evolveBeast();
    },
    async regularBoost(count) {
      this.handleBoostResult(
        await this.performRequest(this.$game.beastRegularBoost(count))
      );
    },
    async advancedBoost(count) {
      this.handleBoostResult(
        await this.performRequest(this.$game.beastAdvancedBoost(count))
      );
    },
    async purchaseBoostItems(iapIndex) {
      this.handleBoostResult(
        await this.performRequest(this.$game.purchaseBeastBoost(iapIndex))
      );
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

<style scoped>
.beast-image {
  max-height: 20vh;
}
.marker-pos {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
