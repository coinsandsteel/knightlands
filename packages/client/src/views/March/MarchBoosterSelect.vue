<template>
  <div class="width-100 height-100 dummy-height flex flex-column flex-no-wrap">
    <MarchBalance />
    <div class="flex-full width-100 flex flex-center">
      <div>
        <div class="flex flex-justify-center">
          <MarchBoosterButton
            class="btn-booster"
            name="Max health???"
            :price="1000"
            :hasBought="preGameBooster && preGameBooster[march.BOOSTER_HP] > 0"
            @hint="maxHealthHintHandler"
            @buy="maxHealthBuyHandler"
          />
          <MarchBoosterButton
            class="btn-booster margin-left-6"
            name="Extra life???"
            :price="1000"
            :hasBought="
              preGameBooster && preGameBooster[march.BOOSTER_LIFE] > 0
            "
            @hint="extraLifeHintHandler"
            @buy="extraLifeBuyHandler"
          />
        </div>
        <div class="margin-top-6 flex flex-justify-center">
          <MarchBoosterButton
            class="btn-booster"
            name="Key???"
            :price="1000"
            :hasBought="preGameBooster && preGameBooster[march.BOOSTER_KEY] > 0"
            @hint="marchBoosterHintHandler"
            @buy="marchBoosterBuyHandler"
          />
        </div>
      </div>
    </div>
    <!-- <div class="flex-full">pet</div> -->
    <div class="padding-top-5 padding-bottom-5">
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

export default {
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
    ...mapState("march", ["preGameBooster"])
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
      this.$store.dispatch("march/purchasePreGameBooster", march.BOOSTER_HP);
    },
    extraLifeHintHandler() {
      const showDialog = create(MarchBoosterExtraLifeHint);
      showDialog();
    },
    extraLifeBuyHandler() {
      this.$store.dispatch("march/purchasePreGameBooster", march.BOOSTER_LIFE);
    },
    marchBoosterHintHandler() {
      const showDialog = create(MarchBoosterKeyHint);
      showDialog();
    },
    marchBoosterBuyHandler() {
      this.$store.dispatch("march/purchasePreGameBooster", march.BOOSTER_KEY);
    }
  }
};
</script>
<style scoped lang="less">
.btn-start {
  padding-left: 3rem;
  padding-right: 3rem;
}
</style>
