<template>
  <div class="width-100 height-100 dummy-height flex flex-column flex-no-wrap">
    <MarchBalance class="march-pets-select__balance padding-bottom-6" />
    <Title class="">{{ $t("Choose Booster???") }}</Title>
    <div class="march-boosters _flex-full width-100">
      <MarchBoosterButton
        class="btn-booster"
        name="Max health???"
        type="max-hp"
        :price="maxHpPrice"
        :hasBought="preGameBoosters && preGameBoosters.maxHealth > 0"
        @hint="maxHealthHintHandler"
        @buy="maxHealthBuyHandler"
      />
      <MarchBoosterButton
        class="btn-booster"
        name="Extra life???"
        type="extra-life"
        :price="lifePrice"
        :hasBought="preGameBoosters && preGameBoosters.extraLife > 0"
        @hint="extraLifeHintHandler"
        @buy="extraLifeBuyHandler"
      />
      <MarchBoosterButton
        class="btn-booster"
        name="Key???"
        type="key"
        :price="keyPrice"
        :hasBought="preGameBoosters && preGameBoosters.key > 0"
        @hint="marchBoosterKeyHintHandler"
        @buy="marchBoosterKeyBuyHandler"
      />
    </div>
    <!-- <div class="flex-full">pet</div> -->
    <div class="">
      <CustomButton
        type="green"
        class="btn-start inline-block"
        @click="startHandler"
      >
        Start???
      </CustomButton>
    </div>
    <!-- <div style="inv-root dummy-height full-flex width-100 height-100">333</div> -->
  </div>
</template>
<script>
import { mapState } from "vuex";
import { create } from "vue-modal-dialogs";
import * as march from "@/../../knightlands-shared/march";
import MarchBalance from "@/views/March/MarchBalance.vue";
import MarchBoosterHpHint from "@/views/March/MarchBoosterHpHint.vue";
import MarchBoosterExtraLifeHint from "@/views/March/MarchBoosterExtraLifeHint.vue";
import MarchBoosterKeyHint from "@/views/March/MarchBoosterKeyHint.vue";
// import MarchPetsSlide from "@/views/March/MarchPetsSlide.vue";
import MarchBoosterButton from "@/views/March/MarchBoosterButton.vue";
import marchPurchaseMixin from "@/views/March/marchPurchaseMixin";

export default {
  mixins: [marchPurchaseMixin],
  components: {
    MarchBalance,
    MarchBoosterButton
  },
  data() {
    return {
      march
    };
  },
  computed: {
    ...mapState("march", ["preGameBoosters"]),
    maxHpPrice() {
      return march.MAX_HP_BOOSTER_PRICE;
    },
    lifePrice() {
      return march.EXTRA_LIFE_BOOSTER_PRICE;
    },
    keyPrice() {
      return march.KEY_BOOSTER_PRICE;
    }
  },
  methods: {
    upgradeHandler() {},
    async startHandler() {
      await this.$store.dispatch("march/startNewGame");
      this.$emit("next");
    },
    maxHealthHintHandler() {
      const showDialog = create(MarchBoosterHpHint);
      showDialog();
    },
    maxHealthBuyHandler() {
      if (!this.checkGoldBalance(this.maxHpPrice)) {
        return;
      }
      this.$store.dispatch("march/purchasePreGameBooster", march.BOOSTER_HP);
    },
    extraLifeHintHandler() {
      const showDialog = create(MarchBoosterExtraLifeHint);
      showDialog();
    },
    extraLifeBuyHandler() {
      if (!this.checkGoldBalance(this.lifePrice)) {
        return;
      }
      this.$store.dispatch("march/purchasePreGameBooster", march.BOOSTER_LIFE);
    },
    marchBoosterKeyHintHandler() {
      const showDialog = create(MarchBoosterKeyHint);
      showDialog();
    },
    marchBoosterKeyBuyHandler() {
      if (!this.checkGoldBalance(this.keyPrice)) {
        return;
      }
      this.$store.dispatch("march/purchasePreGameBooster", march.BOOSTER_KEY);
    }
  }
};
</script>
<style scoped lang="less">
.march-pets-select__balance {
  background: #2f7285;
}
.common-title {
  margin-top: -8px;
}
.btn-start {
  padding-left: 3rem;
  padding-right: 3rem;
}
.march-boosters {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 3rem;
  justify-content: center;
  justify-items: center;
  padding-left: 3rem;
  padding-right: 3rem;
  margin-top: 8rem;
  margin-bottom: 8rem;
}
</style>
