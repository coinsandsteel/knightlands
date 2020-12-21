<template>
  <Promised :promise="request">
    <template v-slot:combined="{ isPending, isDelayOver }">
      <LoadingScreen :loading="isPending && isDelayOver" />
      <div class="screen-background"></div>
      <div v-bar>
        <div class="flex flex-center">
          <div class="flex flex-center flex-column">
            <ChestElement
              v-for="chest in chests"
              :key="chest.name"
              :chest="chest"
              :pending="pendingOpening"
              @purchase="purchase"
              @open="handleOpen"
              @openBatch="openBatchChest"
            />
          </div>
        </div>
      </div>
    </template>
  </Promised>
</template>

<script>
import AppSection from "@/AppSection.vue";
import ChestsMeta from "@/chests_meta";
import ChestElement from "./ChestElement.vue";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

const ChestNames = ["wooden_chest", "silver_chest", "velvet_chest"];

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  components: { ChestElement, Promised, LoadingScreen },
  created() {
    this.title = "window-choose-chest";
  },
  activated() {
    this.getChestsStatus();
  },
  data: () => ({
    request: null,
    status: {},
    chests: [],
    pendingOpening: false
  }),
  methods: {
    purchase(chest, iap) {
      this.openChest(chest, iap);
    },
    handleOpen(chest) {
      this.openChest(chest, -1, 1);
    },
    openBatchChest(chest, count) {
      this.openChest(chest, -1, count);
    },
    async openChest(chest, iap, count = 1) {
      const items = await this.performRequest(
        this.$game.openChest(chest, iap, count)
      );

      this.$router.push({
        name: "open-chest",
        params: { chest, items }
      });
    },
    async getChestsStatus() {
      this.request = this.$game.getChestsStatus();
      this.status = await this.request;

      let chests = [];
      ChestNames.forEach(name => {
        chests.push({
          name: name,
          meta: ChestsMeta[name],
          lastFreeOpening: this.status[name] || 0
        });
      });

      this.chests = chests;
    }
  }
};
</script>
