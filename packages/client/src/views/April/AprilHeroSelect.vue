<template>
  <div class="width-100 height-100 dummy-height flex flex-column flex-no-wrap">
    <AprilBalance class="april-heroes-select__balance padding-bottom-6" />
    <Title class="">{{
      selectedHero ? selectedHero.name : $t("choose-hero")
    }}</Title>

    <div class="flex-full flex flex-center flex-nowrap">
      <div>
        <!-- <div
          v-if="selectedHero"
          class="font-size-22 font-weight-700 padding-bottom-1"
        >
          <span class="hero-name">{{ selectedHero.name }}</span>
        </div> -->
        <AprilHeroesSlide />
        <!-- <AprilHeroAbilities
          v-if="true || (selectedHero && selectedHero.unlocked)"
          :hero="selectedHero"
          class=" margin-top-2"
        /> -->
        <div class="padding-top-4">
          <CustomButton
            type="yellow"
            class="btn-view-abilities inline-block"
            @click="viewAbilityHandler"
          >
            {{ $t("view-abilities") }}
          </CustomButton>
          <CustomButton
            v-if="canBuy"
            type="yellow"
            class="btn-upgrade inline-block"
            @click="unlockHandler"
          >
            {{ $t("unlock") }} &nbsp;<AprilGold :value="buyPrice" />
          </CustomButton>
          <!-- @todo -->
          <CustomButton
            v-if="true || canChoose"
            type="green"
            class="btn-start inline-block"
            @click="selectHandler"
          >
            {{ $t("start") }}
          </CustomButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { create } from "vue-modal-dialogs";
import * as april from "@/../../knightlands-shared/april";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import aprilPurchaseMixin from "@/views/April/aprilPurchaseMixin";
import AprilBalance from "@/views/April/AprilBalance.vue";
import AprilHeroesSlide from "@/views/April/AprilHeroesSlide.vue";
import AprilGold from "@/views/April/AprilGold.vue";
// import AprilHeroAbilities from "@/views/April/AprilHeroAbilities.vue";
import AprilHeroAbilitiesHint from "@/views/April/AprilHeroAbilitiesHint.vue";

export default {
  mixins: [aprilPurchaseMixin, NetworkRequestErrorMixin],
  components: { AprilBalance, AprilHeroesSlide, AprilGold },
  computed: {
    ...mapGetters("april", ["selectedHero"]),
    canBuy() {
      return this.selectedHero && !this.selectedHero.unlocked;
    },
    canChoose() {
      return this.selectedHero && this.selectedHero.unlocked;
    },
    buyPrice() {
      if (!this.selectedHero) {
        return 0;
      }
      if (!this.selectedHero.unlocked) {
        return april.HEROES[this.selectedHero.heroClass];
      }

      return 0;
    }
  },
  methods: {
    async unlockHandler() {
      if (!this.checkGoldBalance(this.buyPrice)) {
        return;
      }
      await this.$store.dispatch("april/purchaseHero", {
        heroClass: this.selectedHero.heroClass
      });
    },
    viewAbilityHandler() {
      const showDialog = create(AprilHeroAbilitiesHint);
      showDialog();
    },
    selectHandler() {
      this.$emit("next");
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
.hero-level {
  display: inline-block;
  margin-left: 1rem;
  color: #fbe648;
}
.hero-level-max {
  display: inline-block;
  margin-left: 1rem;
  color: #00ec00;
}
::v-deep {
  .april-hero-abilities {
    grid-row-gap: 1rem;
  }
}
</style>
