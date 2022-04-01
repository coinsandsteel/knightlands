<template>
  <div class="width-100 height-100 dummy-height flex flex-column flex-no-wrap">
    <AprilBalance class="april-heroes-select__balance padding-bottom-6" />
    <Title class="">{{ $t("choose-booster") }}</Title>
    <div class="april-boosters width-100">
      <AprilBoosterButton
        class="btn-booster"
        :name="$t('third-action')"
        :type="april.BOOSTER_THIRD_ACTION"
        :price="boosters[april.BOOSTER_THIRD_ACTION]"
        :isSelected="!!preGameBoosters[april.BOOSTER_THIRD_ACTION]"
        :isDisabled="isThirdActionDisabled"
        @hint="thirdActionHintHandler"
        @select="thirdActionSelectHandler"
      />
      <!-- <AprilBoosterButton
        class="btn-booster"
        :name="$t('skip-a-turn')"
        :type="april.BOOSTER_SKIP_A_TURN"
        :price="boosters[april.BOOSTER_SKIP_A_TURN]"
        :isSelected="!!preGameBoosters[april.BOOSTER_SKIP_A_TURN]"
        :isDisabled="skipATurnDisabled"
        @hint="skipATurnHintHandler"
        @select="skipATurnSelectHandler"
      /> -->
    </div>
    <div class="">
      <CustomButton
        type="green"
        class="btn-start inline-block"
        @click="startHandler"
      >
        {{ $t("start") }}
      </CustomButton>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { create } from "vue-modal-dialogs";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import * as april from "@/../../knightlands-shared/april";
import AprilBalance from "@/views/April/AprilBalance.vue";
import AprilBoosterThirdActionHint from "@/views/April/AprilBoosterThirdActionHint.vue";
import AprilBoosterSkipATurnHint from "@/views/April/AprilBoosterSkipATurnHint.vue";
import AprilBoosterButton from "@/views/April/AprilBoosterButton.vue";
import aprilPurchaseMixin from "@/views/April/aprilPurchaseMixin";
import PromptMixin from "@/components/PromptMixin.vue";

export default {
  mixins: [aprilPurchaseMixin, PromptMixin, NetworkRequestErrorMixin],
  components: {
    AprilBalance,
    AprilBoosterButton
  },
  data() {
    return {
      april
    };
  },
  computed: {
    ...mapState("april", ["preGameBoosters"]),
    ...mapGetters("april", ["selectedHero"]),
    isThirdActionDisabled() {
      return false;
    },
    skipATurnDisabled() {
      return false;
    },
    boosters() {
      return april.BOOSTERS;
    }
  },
  mounted() {
    if (
      this.isThirdActionDisabled &&
      this.preGameBoosters[april.BOOSTER_THIRD_ACTION]
    ) {
      this.thirdActionSelectHandler();
    }
    if (
      this.skipATurnDisabled &&
      this.preGameBoosters[april.BOOSTER_SKIP_A_TURN]
    ) {
      this.skipATurnSelectHandler();
    }
  },
  methods: {
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
      await this.$store.dispatch("april/startNewGame", {
        heroClass: this.selectedHero.heroClass,
        boosters: this.preGameBoosters
      });
      this.$emit("next");
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
    async thirdActionSelectHandler() {
      this.$store.commit(
        "april/updatePreGameBooster",
        april.BOOSTER_THIRD_ACTION
      );
    },
    thirdActionHintHandler() {
      const showDialog = create(AprilBoosterThirdActionHint);
      showDialog();
    },
    async skipATurnSelectHandler() {
      this.$store.commit(
        "april/updatePreGameBooster",
        april.BOOSTER_SKIP_A_TURN
      );
    },
    skipATurnHintHandler() {
      const showDialog = create(AprilBoosterSkipATurnHint);
      showDialog();
    }
  }
};
</script>
<style scoped lang="less">
.april-heroes-select__balance {
  background: #2f7285;
}
.common-title {
  margin-top: -8px;
}
.btn-start {
  padding-left: 3rem;
  padding-right: 3rem;
}
.april-boosters {
  display: grid;
  grid-template-columns: repeat(1, minmax(20%, 150px));
  grid-gap: 3rem;
  justify-content: center;
  justify-items: center;
  padding-left: 3rem;
  padding-right: 3rem;
  margin-top: 8rem;
  margin-bottom: 8rem;
}
</style>
