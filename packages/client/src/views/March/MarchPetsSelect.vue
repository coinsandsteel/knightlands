<template>
  <div class="width-100 height-100 dummy-height flex flex-column flex-no-wrap">
    <MarchBalance class="march-pets-select__balance padding-bottom-6" />
    <Title class="">{{ $t("Choose Pet???") }}</Title>

    <div class="flex-full flex flex-center flex-nowrap">
      <div>
        <div
          v-if="selectedPet"
          class="font-size-22 font-weight-700 padding-bottom-1"
        >
          <span class="pet-name">{{ selectedPet.name }}</span>
          <span class="pet-level">lvl {{ selectedPet.level }}</span>
          <span v-if="selectedPet.level === 3" class="pet-level-max"
            >(MAX)</span
          >
        </div>
        <MarchPetsSlide />
        <!-- <div class="flex-full">pet</div> -->
        <div class="padding-top-6">
          <CustomButton
            v-if="canBuy"
            type="yellow"
            class="btn-upgrade inline-block"
            @click="unlockHandler"
          >
            Unlock??? &nbsp;<MarchGold :value="buyPrice" />
          </CustomButton>
          <CustomButton
            v-if="canUpgrade"
            type="yellow"
            class="btn-upgrade inline-block"
            @click="upgradeHandler"
          >
            Evolve??? &nbsp;<MarchGold :value="upgradePrice" />
          </CustomButton>
          <CustomButton
            v-if="canChoose"
            type="green"
            class="btn-start inline-block"
            @click="selectHandler"
          >
            Choose???
          </CustomButton>
        </div>
      </div>
    </div>
    <!-- <div style="inv-root dummy-height full-flex width-100 height-100">333</div> -->
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import marchPurchaseMixin from "@/views/March/marchPurchaseMixin";
import MarchBalance from "@/views/March/MarchBalance.vue";
import MarchPetsSlide from "@/views/March/MarchPetsSlide.vue";
import MarchGold from "@/views/March/MarchGold.vue";

export default {
  mixins: [marchPurchaseMixin],
  components: { MarchBalance, MarchPetsSlide, MarchGold },
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
    canChoose() {
      return this.selectedPet && this.selectedPet.unlocked;
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
.pet-level {
  display: inline-block;
  margin-left: 1rem;
  color: #fbe648;
}
.pet-level-max {
  display: inline-block;
  margin-left: 1rem;
  color: #00ec00;
}
</style>
