<template>
  <Promised :promise="request">
    <template v-slot:combined="{ isPending, isDelayOver, data }">
      <LoadingScreen  :loading="isPending && isDelayOver"></LoadingScreen>

      <div v-bar>
        <div class="flex flex-center">
          <div class="flex flex-center padding-1 flex-column">
            <ChestElement
              v-for="chest in chests"
              :key="chest.name"
              :chest="chest"
              :pending="pendingOpening"
              @open="openChest"
              @wait="pendingOpening = true"
            />
          </div>
        </div>
      </div>
    </template>
  </Promised>
</template>

<script>
import AppSection from "@/AppSection";
import CustomButton from "@/components/Button.vue";
import ChestsMeta from "@/chests_meta";
import ChestElement from "./ChestElement.vue";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";

const ChestNames = ["wooden_chest", "silver_chest", "velvet_chest"];

export default {
  mixins: [AppSection],
  components: { CustomButton, ChestElement, Promised, LoadingScreen },
  created() {
    this.title = "window-choose-chest";
  },
  activated() {
    this.getChestsStatus();
  },
  deactivated() {
    this.pendingOpening = false;
  },
  data: () => ({
    request: null,
    status: {},
    chests: [],
    pendingOpening: false
  }),
  methods: {
    openChest(chest, iap, items) {
      if (iap) {
        this.request = this.$game.openChest(chest, iap);
      } else {
        this.$router.push({
          name: "open-chest",
          params: { chest: chest, items: items }
        });
      }
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