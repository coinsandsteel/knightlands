<template>
  <Promised :promise="request" :pendingDelay="200">
    <template v-slot:combined="{ isPending, isDelayOver }">
      <div>
        <loading-screen :loading="true" :opacity="0.4" v-show="isDelayOver && isPending"></loading-screen>

        <div v-bar v-if="raids.length > 0">
          <div class="flex flex-column current-raids-list">
            <current-raid-element
              v-for="(raidData, index) in raids"
              :key="raidData.id"
              :raidData="raidData"
              @claimed="handleRaidClaimed(index)"
            ></current-raid-element>
          </div>
        </div>

        <div class="flex flex-column flex-center height-100 width-100" v-else>
          <span class="font-size-22 margin-bottom-2">{{$t("raids-empty")}}</span>
          <CustomButton type="yellow" @click="summonRaid">{{$t("raid-summon-now")}}</CustomButton>
        </div>
      </div>
    </template>
  </Promised>
</template>

<script>
import AppSection from "@/AppSection.vue";
import CustomButton from "@/components/Button.vue";
import CurrentRaidElement from "./CurrentRaidElement.vue";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";

export default {
  name: "current-raids",
  mixins: [AppSection],
  components: { CurrentRaidElement, Promised, LoadingScreen, CustomButton },
  data: () => ({
    raids: [],
    request: null
  }),
  mounted() {
    this.fetchRaids();
  },
  created() {
    this.title = "Raids";
  },
  activated() {
    // refresh raids list
    this.fetchRaids();
    this.toggleFooter();
  },
  methods: {
    async fetchRaids() {
      this.request = this.$game.fetchCurrentRaids();

      try {
        this.raids = await this.request;
      } catch {}
    },
    summonRaid() {
      this.$router.push({ name: "raids-for-summon" });
    },
    toggleFooter() {
      this.addFooter(CustomButton, {
        cb: this.summonRaid.bind(this),
        caption: "Summon",
        type: "yellow"
      });
    },
    handleRaidClaimed(raidIndex) {
      this.raids.splice(raidIndex, 1);
    }
  }
};
</script>

<style lang="less" scoped>
.current-raids-list {
  > * {
    margin: 1rem 1rem 1rem 1rem;
  }

  min-height: 0;
}
</style>

