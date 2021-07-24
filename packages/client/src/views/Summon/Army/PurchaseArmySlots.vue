<template>
  <UserDialog title="t-expand-army" :compact="true" @close="$close">
    <template v-slot:content>
      <div class="width-100 flex flex-column flex-center margin-bottom-1">
        <div class="flex flex-no-wrap flex-item-center margin-bottom-2">
          <div class="icon-premium"></div>
          <span class="font-size-20">{{ hardCurrency }}</span>
        </div>

        <span class="font-size-20 margin-bottom-2">{{
          $t("unit-slots", { c: currentSlots, t: maxSlots })
        }}</span>
        <PurchaseButton
          type="green"
          @click="expandArmy"
          :price="expansionPrice"
          v-if="notAtMaxSlots"
          >{{ $t("exp-army") }}</PurchaseButton
        >
      </div>
    </template>
  </UserDialog>
</template>

<script>
import ArmyMeta from "@/army_meta.json";
import UserDialog from "@/components/UserDialog.vue";
import PurchaseButton from "@/components/PurchaseButton.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

export default {
  mixins: [NetworkRequestErrorMixin],
  components: {
    UserDialog,
    PurchaseButton
  },
  computed: {
    hardCurrency() {
      return this.$game.hardCurrency;
    },
    expansionPrice() {
      return ArmyMeta.expansionPrice;
    },
    notAtMaxSlots() {
      return this.maxSlots < ArmyMeta.maxSlots;
    },
    currentSlots() {
      return this.$game.army.currentSlots;
    },
    maxSlots() {
      return this.$game.army.maxSlots;
    }
  },
  methods: {
    async expandArmy() {
      await this.performRequest(this.$game.expandArmySlots(false));
    }
  }
};
</script>
