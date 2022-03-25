<template>
  <div class="width-100 height-100 dummy-height flex flex-column flex-no-wrap">
    <AprilBalance class="april-heroes-select__balance padding-bottom-6" />
    <Title class="">{{
      selectedHero ? selectedHero.name : $t("choose-hero")
    }}</Title>

    <div class="flex-full flex flex-center flex-nowrap">
      <div>
        <AprilHeroesSlide />
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
            :disabled="isBuyButtonDisabled"
            @click="unlockHandler"
          >
            {{ $t("unlock") }} &nbsp;<AprilGold :value="buyPrice" />
          </CustomButton>
          <CustomButton
            v-if="canChoose"
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
import { mapGetters, mapState } from "vuex";
import { create } from "vue-modal-dialogs";
import * as april from "@/../../knightlands-shared/april";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import aprilPurchaseMixin from "@/views/April/aprilPurchaseMixin";
import AprilBalance from "@/views/April/AprilBalance.vue";
import AprilHeroesSlide from "@/views/April/AprilHeroesSlide.vue";
import AprilGold from "@/views/April/AprilGold.vue";
import AprilHeroAbilitiesHint from "@/views/April/AprilHeroAbilitiesHint.vue";
import MessageBox from "@/views/Common/MessageBox.vue";

export default {
  mixins: [aprilPurchaseMixin, NetworkRequestErrorMixin],
  components: { AprilBalance, AprilHeroesSlide, AprilGold },
  computed: {
    ...mapState("april", ["balance"]),
    ...mapGetters("april", ["selectedHero", "heroes"]),
    canBuy() {
      return this.selectedHero && !this.selectedHero.unlocked;
    },
    isPreviousHeroUnlocked() {
      if (!this.selectedHero) {
        return false;
      }
      if (this.selectedHero.heroClass === april.HERO_CLASS_ROGUE) {
        const paladin = this.heroes.find(
          ({ heroClass }) => april.HERO_CLASS_PALADIN === heroClass
        );
        return paladin && paladin.unlocked;
      } else if (this.selectedHero.heroClass === april.HERO_CLASS_PALADIN) {
        const knight = this.heroes.find(
          ({ heroClass }) => april.HERO_CLASS_KNIGHT === heroClass
        );
        return knight && knight.unlocked;
      }

      return true;
    },
    canChoose() {
      return this.selectedHero && this.selectedHero.unlocked;
    },
    buyPrice() {
      if (!this.selectedHero) {
        return 0;
      }
      return this.selectedHero.price;
    },
    isBuyButtonDisabled() {
      return !(
        this.balance.gold >= this.buyPrice && this.isPreviousHeroUnlocked
      );
    }
  },
  methods: {
    async unlockHandler() {
      if (!this.isPreviousHeroUnlocked) {
        const showDialog = create(MessageBox, "message");
        showDialog(this.$t("april-heroes-unlocked-successively"));
        return;
      }
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
      if (!this.checkTicketBalance(1)) {
        return;
      }
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
