<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <div v-bar>
      <div class="flex flex-center">
        <div class="flex flex-center flex-column">
          <BattleChestElement
            v-for="(chest, index) in chests"
            :key="chest.name"
            :chest="chest"
            :index="index"
            :pending="pendingOpening"
            @purchase="purchaseHandler"
            @open="openHandler"
          />
          <div class="margin-top-4">
            <CustomButton
              type="green"
              width="14rem"
              @click="showDetailsHandler"
            >
              Details
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { create } from "vue-modal-dialogs";
import AppSection from "@/AppSection.vue";
// import ChestsMeta from "@/metadata/chests_meta";
import BattleChestElement from "./BattleChestElement.vue";
import BattleChestShopDetails from "./BattleChestShopDetails.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

// const ChestNames = ["wooden_chest", "silver_chest", "velvet_chest"];

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  components: { BattleChestElement },
  created() {
    this.title = "window-choose-chest";
  },
  data: () => ({
    pendingOpening: false
  }),
  computed: {
    chests() {
      let chests = [];
      chests.push({
        name: "wooden_chest",
        title: "Daily chest",
        descriptions: [
          "• High chance of getting I tier unit",
          "• Low chance of getting II tier unit",
          "• Very Low chance of getting III tier unit"
        ]
      });
      chests.push({
        name: "silver_chest",
        title: "Coin chest",
        descriptions: [
          "• High chance of getting I tier unit",
          "• Low chance of getting II tier unit",
          "• Very Low chance of getting III tier unit"
        ]
      });
      chests.push({
        name: "velvet_chest",
        title: "Donate chest",
        descriptions: [
          "• High chance of getting I tier unit",
          "• Low chance of getting II tier unit",
          "• Very Low chance of getting III tier unit",
          "• Some Tier 3 characters can only be obtained from this chest"
        ]
      });

      return chests;
    }
  },
  methods: {
    purchaseHandler(chest) {
      // this.openChest(chest, iap);
    },
    openHandler(chest) {
      // this.openChest(chest, -1, 1);
      this.$router.push({
        name: "battle-chest-shop-units",
        params: { name: chest.name }
      });
    },
    async showDetailsHandler() {
      const show = create(BattleChestShopDetails);
      await show();
    }
  }
};
</script>
