<template>
  <div class="presale-card">
    <img :src="image" />
    <div class="flex flex-center btns">
      <CustomButton
        v-if="canDeposit"
        type="yellow"
        minWidth="20rem"
        @click="handleDeposit"
        >{{ $t("btn-deposit") }}</CustomButton
      >
      <CustomButton
        type="yellow"
        minWidth="20rem"
        v-else-if="pending"
        @click="handleSubmit"
      >
        {{ $t("btn-pay") }}
      </CustomButton>
      <CustomButton type="grey" minWidth="20rem" v-else :disabled="true">
        {{ $t("btn-n-dep") }}
      </CustomButton>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";

const CardImages = {
  ["1"]: "card_small",
  ["2"]: "card_medium",
  ["3"]: "card_big"
};

export default {
  props: ["data"],
  components: { CustomButton },
  data: () => ({
    CardImages
  }),
  computed: {
    pending() {
      return !!this.data.pending;
    },
    canDeposit() {
      return !!this.data.canDeposit;
    },
    tokenId() {
      return this.data.tokenId;
    },
    image() {
      const tokenType = BigInt(this.tokenId) >> BigInt(128);
      return `/images/banners/${CardImages[tokenType.toString()]}.png`;
    }
  },
  methods: {
    handleDeposit() {
      this.$emit("deposit", this.tokenId);
    },
    handleSubmit() {
      this.$emit("submit", this.tokenId, this.data.depositId);
    }
  }
};
</script>

<style lang="less" scoped>
.presale-card {
  & img {
    max-width: 100%;
  }

  & .btns {
    transform: translateY(-90%);
  }
}
</style>
