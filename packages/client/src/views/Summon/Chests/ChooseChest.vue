<template>
  <div class="screen-content">
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
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import ChestsMeta from "@/metadata/chests_meta";
import ChestElement from "./ChestElement.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

const ChestNames = [
  "wooden_chest",
  "silver_chest",
  "velvet_chest",
  "halloween_chest"
];

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  components: { ChestElement },
  created() {
    this.title = "window-choose-chest";
  },
  data: () => ({
    pendingOpening: false
  }),
  computed: {
    chests() {
      const status = this.$game.chests;

      let chests = [];
      ChestNames.forEach(name => {
        chests.push({
          name: name,
          meta: ChestsMeta[name],
          lastFreeOpening: status[name] || 0
        });
      });

      return chests;
    }
  },
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
    }
  }
};
</script>
