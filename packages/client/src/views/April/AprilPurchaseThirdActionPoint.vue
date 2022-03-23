<template>
  <UserDialog :title="$t('buy-third-action-point')" @close="close()">
    <template v-slot:content>
      <!-- balance -->
      <div class="font-size-20 flex flex-justify-center">
        {{ $t("current-balance") }}
        <AprilGold
          class="april-gold--with-background padding-left-2 margin-left-1"
        />
      </div>
    </template>
    <template v-slot:footer>
      <CustomButton type="red" @click="close()"
        >{{ $t("btn-close") }}
      </CustomButton>
      <CustomButton
        type="yellow"
        class="btn-upgrade inline-block"
        @click="buyHandler"
      >
        {{ $t("buy") }} &nbsp;<AprilGold :value="buyPrice" />
      </CustomButton>
    </template>
  </UserDialog>
</template>

<script>
import { mapState } from "vuex";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import UserDialog from "@/components/UserDialog.vue";
import aprilPurchaseMixin from "@/views/April/aprilPurchaseMixin";
import AprilGold from "@/views/April/AprilGold.vue";

export default {
  mixins: [aprilPurchaseMixin, NetworkRequestErrorMixin],
  components: {
    UserDialog,
    AprilGold
  },
  computed: {
    ...mapState("april", ["prices"]),
    buyPrice() {
      return this.prices ? this.prices.thirdAction : 0;
    }
  },
  methods: {
    async close(hasBought = false) {
      this.$close({ hasBought });
    },
    async buyHandler() {
      if (!this.checkGoldBalance(this.buyPrice)) {
        return;
      }
      await this.$store.dispatch("april/purchaseAction");
      this.close(true);
    }
  }
};
</script>
