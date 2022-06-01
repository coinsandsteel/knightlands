<template>
  <div class="screen-content ">
    <div class="font-size-22 height-100 flex flex-center">
      <div>
        <div>
          <CustomButton
            type="green"
            class="inline-block margin-right-2 margin-top-1"
            @click="goToAdventure"
          >
            {{ $t("adventure") }}???
          </CustomButton>
        </div>
        <div>
          <CustomButton
            type="green"
            class="inline-block margin-right-2 margin-top-1"
            @click="goToDuels"
          >
            {{ $t("duels") }}???
          </CustomButton>
        </div>
        <div>
          <CustomButton
            type="green"
            class="inline-block margin-right-2 margin-top-1"
            @click="goToSquad"
          >
            {{ $t("squad") }}???
          </CustomButton>
        </div>
        <div>
          <CustomButton
            type="green"
            class="inline-block margin-right-2 margin-top-1"
            @click="goToUnitsList"
          >
            {{ $t("units list") }}???
          </CustomButton>
        </div>
        <div>
          <CustomButton
            type="green"
            class="inline-block margin-right-2 margin-top-1"
            @click="goToMerger"
          >
            {{ $t("merger") }}???
          </CustomButton>
        </div>
        <div>
          <CustomButton
            type="green"
            class="inline-block margin-right-2 margin-top-1"
            @click="goToShop"
          >
            {{ $t("shop") }}???
          </CustomButton>
        </div>
        <div>
          <CustomButton
            type="green"
            class="inline-block margin-right-2 margin-top-1"
            @click="goToChestShop"
          >
            {{ $t("chest-shop") }}???
          </CustomButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    goToAdventure() {
      this.$router.push({ name: "battle-adventure" });
    },
    goToDuels() {
      this.$router.push({ name: "battle-duels" });
    },
    goToSquad() {
      this.$router.push({ name: "battle-squad-home" });
    },
    goToUnitsList() {
      this.$router.push({ name: "battle-units" });
    },
    goToMerger() {
      this.$router.push({ name: "battle-merger" });
    },
    goToShop() {
      this.$router.push({ name: "battle-shop" });
    },
    goToChestShop() {
      this.$router.push({ name: "battle-chest-shop" });
    }
  }
};
</script>
<style scoped lang="less">
.btn {
  width: 30rem;
}
</style>
