<template>
  <div
    class="flex flex-column flex-items-start flex-center color-panel-1 padding-left-1"
    :class="{ 'color-panel-2': odd }"
  >
    <span class="font-size-18 margin-bottom-1">{{
      $t("with-id", { tx: withdrawal._id })
    }}</span>

    <span class="font-size-18 margin-bottom-1">{{
      $t("with-date", { date })
    }}</span>

    <IconWithValue
      valueClass="font-size-18"
      :iconClass="getIcon(withdrawal.blockchainId)"
      :flip="true"
      >{{ amount }}</IconWithValue
    >

    <CustomButton class="margin-top-2 flex-self-end" @click="withdraw">{{
      $t("btn-withd")
    }}</CustomButton>
  </div>
</template>

<script>
import BlockchainUtilsMixin from "./BlockchainUtilsMixin";
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

export default {
  mixins: [BlockchainUtilsMixin, NetworkRequestErrorMixin],
  props: ["withdrawal", "odd"],
  components: { CustomButton, IconWithValue },
  computed: {
    amount() {
      return this.toDecimal(
        this.withdrawal.blockchainId,
        this.withdrawal.amount
      );
    },
    date() {
      return new Date(this.withdrawal.date);
    }
  },
  methods: {
    async withdraw() {
      this.$emit("withdrawal", this.withdrawal);
    }
  }
};
</script>
