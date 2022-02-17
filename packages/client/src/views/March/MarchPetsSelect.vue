<template>
  <div class="width-100 height-100 dummy-height flex flex-column flex-no-wrap">
    <MarchBalance />
    <MarchPetsSlide class="flex-full" />
    <!-- <div class="flex-full">pet</div> -->
    <div class="padding-top-5 padding-bottom-5">
      <CustomButton
        v-if="canBuy"
        type="yellow"
        class="btn-upgrade inline-block"
        @click="unlockHandler"
      >
        Unlock???
      </CustomButton>
      <CustomButton
        v-if="canUpgrade"
        type="yellow"
        class="btn-upgrade inline-block"
        @click="upgradeHandler"
      >
        Upgrade???
      </CustomButton>
      <CustomButton
        type="green"
        class="btn-start inline-block"
        @click="selectHandler"
      >
        Select???
      </CustomButton>
    </div>
    <!-- <div style="inv-root dummy-height full-flex width-100 height-100">333</div> -->
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import marchPurchaseMixin from "@/views/March/marchPurchaseMixin";
import MarchBalance from "@/views/March/MarchBalance.vue";
import MarchPetsSlide from "@/views/March/MarchPetsSlide.vue";

export default {
  mixins: [marchPurchaseMixin],
  components: { MarchBalance, MarchPetsSlide },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("march", ["selectedPet"]),
    canBuy() {
      return this.selectedPet && !this.selectedPet.unlocked;
    },
    canUpgrade() {
      return (
        this.selectedPet &&
        this.selectedPet.unlocked &&
        typeof this.selectedPet.level === "number" &&
        this.selectedPet.level < 3
      );
    },
    buyPrice() {
      return 0;
    },
    upgradePrice() {
      return 0;
    }
  },
  methods: {
    async unlockHandler() {
      if (!this.checkGoldBalance(this.buyPrice)) {
        return;
      }
      await this.$store.dispatch("march/unlockPet", this.selectedPet.petClass);
    },
    async upgradeHandler() {
      if (!this.checkGoldBalance(this.upgradePrice)) {
        return;
      }
      await this.$store.dispatch("march/upgradePet", this.selectedPet.petClass);
    },
    selectHandler() {
      this.$emit("next");
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
