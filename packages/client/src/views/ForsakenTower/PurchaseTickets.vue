<template>
  <UserDialog title="tower-purchase-tickets" :compact="true" @close="$close">
    <template v-slot:content>
      <div class="width-100 flex flex-column flex-center margin-bottom-1">
        <PurchaseButton
          type="yellow margin-bottom-1"
          width="20rem"
          v-for="(iap, index) in iaps"
          :key="index"
          :price="iap.price"
          @click="purchaseAttempts(index)"
        >
          <div class="flex flex-center">
            <span class="item-icon" :style="ticketIcon"></span>
            <span class="margin-left-half margin-right-2"
              >x{{ iap.attempts }}</span
            >
          </div>
        </PurchaseButton>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import PurchaseButton from "@/components/PurchaseButton.vue";
import TowerMeta from "@/tower_meta";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

export default {
  mixins: [NetworkRequestErrorMixin],
  components: {
    UserDialog,
    PurchaseButton
  },
  computed: {
    iaps() {
      return TowerMeta.iaps;
    },
    ticketIcon() {
      return `background-image: url(${this.$game.itemsDB.getIcon(
        TowerMeta.ticketItem
      )});`;
    }
  },
  methods: {
    async purchaseAttempts(index) {
      await this.performRequest(this.$game.purchaseTowerTickets(+index));
      this.$close();
    }
  }
};
</script>
