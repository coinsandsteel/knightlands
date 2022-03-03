<template>
  <div class="width-100 height-100 dummy-height flex flex-column flex-no-wrap">
    <MarchBalance class="march-pets-select__balance padding-bottom-6" />
    <Title class="">{{ $t("choose-pet") }}</Title>

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
        <MarchPetAbilities
          v-if="selectedPet && selectedPet.unlocked"
          :pet="selectedPet"
          :shouldShowNoAbility="false"
          class=" margin-top-2"
        />
        <div class="padding-top-2">
          <CustomButton
            v-if="canBuy"
            type="yellow"
            class="btn-upgrade inline-block"
            @click="unlockHandler"
          >
            {{ $t("unlock") }} &nbsp;<MarchGold :value="buyPrice" />
          </CustomButton>
          <CustomButton
            v-if="canUpgrade"
            type="yellow"
            class="btn-upgrade inline-block"
            @click="upgradeHandler"
          >
            {{ $t("evolve") }} &nbsp;<MarchGold :value="upgradePrice" />
          </CustomButton>
          <CustomButton
            v-if="canChoose"
            type="green"
            class="btn-start inline-block"
            @click="selectHandler"
          >
            {{ $t("choose") }}
          </CustomButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import * as march from "@/../../knightlands-shared/march";
import marchPurchaseMixin from "@/views/March/marchPurchaseMixin";
import MarchBalance from "@/views/March/MarchBalance.vue";
import MarchPetsSlide from "@/views/March/MarchPetsSlide.vue";
import MarchGold from "@/views/March/MarchGold.vue";
import MarchPetAbilities from "@/views/March/MarchPetAbilities.vue";

export default {
  mixins: [marchPurchaseMixin],
  components: { MarchBalance, MarchPetsSlide, MarchGold, MarchPetAbilities },
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
      if (!this.selectedPet) {
        return 0;
      }
      if (!this.selectedPet.unlocked) {
        return march.PETS_PRICE[this.selectedPet.petClass - 1][0];
      }

      return 0;
    },
    upgradePrice() {
      if (!this.selectedPet) {
        return null;
      }
      if (this.selectedPet.level < 3) {
        return march.PETS_PRICE[this.selectedPet.petClass - 1][
          this.selectedPet.level
        ];
      }

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
::v-deep {
  .march-pet-abilities {
    grid-row-gap: 1rem;
  }
}
</style>
