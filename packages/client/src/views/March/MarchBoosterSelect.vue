<template>
  <div class="width-100 height-100 dummy-height flex flex-column flex-no-wrap">
    <MarchBalance class="march-pets-select__balance padding-bottom-6" />
    <Title class="">{{ $t("Choose Booster???") }}</Title>
    <div class="march-boosters _flex-full width-100">
      <MarchBoosterButton
        class="btn-booster"
        name="Max health???"
        type="max-hp"
        :price="boosters[march.BOOSTER_HP]"
        :isSelected="!!preGameBoosters[march.BOOSTER_HP]"
        @hint="maxHealthHintHandler"
        @select="maxHealthSelectHandler"
      />
      <MarchBoosterButton
        class="btn-booster"
        name="Extra life???"
        type="extra-life"
        :price="boosters[march.BOOSTER_LIFE]"
        :isSelected="!!preGameBoosters[march.BOOSTER_LIFE]"
        @hint="extraLifeHintHandler"
        @select="extraLifeSelectHandler"
      />
      <MarchBoosterButton
        class="btn-booster"
        name="Key???"
        type="key"
        :price="boosters[march.BOOSTER_KEY]"
        :isSelected="!!preGameBoosters[march.BOOSTER_KEY]"
        @hint="marchBoosterKeyHintHandler"
        @select="marchBoosterKeySelectHandler"
      />
    </div>
    <div class="">
      <CustomButton
        type="green"
        class="btn-start inline-block"
        @click="startHandler"
      >
        Start???
      </CustomButton>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { create } from "vue-modal-dialogs";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import * as march from "@/../../knightlands-shared/march";
import MarchBalance from "@/views/March/MarchBalance.vue";
import MarchBoosterHpHint from "@/views/March/MarchBoosterHpHint.vue";
import MarchBoosterExtraLifeHint from "@/views/March/MarchBoosterExtraLifeHint.vue";
import MarchBoosterKeyHint from "@/views/March/MarchBoosterKeyHint.vue";
import MarchBoosterButton from "@/views/March/MarchBoosterButton.vue";
import marchPurchaseMixin from "@/views/March/marchPurchaseMixin";
import PromptMixin from "@/components/PromptMixin.vue";

export default {
  mixins: [marchPurchaseMixin, PromptMixin, NetworkRequestErrorMixin],
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
    ...mapGetters("march", ["selectedPet"]),
    boosters() {
      return march.BOOSTERS;
    }
  },
  methods: {
    upgradeHandler() {},
    async startHandler() {
      if (!this.checkTicketBalance(1)) {
        return;
      }
      let goldCost = 0;
      Object.keys(this.preGameBoosters).forEach(key => {
        if (this.preGameBoosters[key]) {
          goldCost += this.boosters[key];
        }
      });
      if (!this.checkGoldBalance(goldCost)) {
        return;
      }
      await this.$store.dispatch("march/startNewGame", {
        petClass: this.selectedPet.petClass,
        level: this.selectedPet.level,
        boosters: this.preGameBoosters
      });
      this.$store.commit("march/resetBossIndex");
      this.$emit("next");
    },
    maxHealthHintHandler() {
      const showDialog = create(MarchBoosterHpHint);
      showDialog();
    },
    async confirm() {
      return this.showPrompt(this.$t("buy-i-t"), this.$t("buy-i-q"), [
        {
          type: "red",
          title: this.$t("buy-i-n"),
          response: false
        },
        {
          type: "green",
          title: this.$t("buy-i-y"),
          response: true
        }
      ]);
    },
    async maxHealthSelectHandler() {
      this.$store.commit("march/updatePreGameBooster", march.BOOSTER_HP);
    },
    extraLifeHintHandler() {
      const showDialog = create(MarchBoosterExtraLifeHint);
      showDialog();
    },
    async extraLifeSelectHandler() {
      this.$store.commit("march/updatePreGameBooster", march.BOOSTER_LIFE);
    },
    marchBoosterKeyHintHandler() {
      const showDialog = create(MarchBoosterKeyHint);
      showDialog();
    },
    async marchBoosterKeySelectHandler() {
      this.$store.commit("march/updatePreGameBooster", march.BOOSTER_KEY);
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
