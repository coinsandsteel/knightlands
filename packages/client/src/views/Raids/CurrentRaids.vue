<template>
  <Promised :promise="request" :pendingDelay="200">
    <template v-slot:combined="{ isPending, isDelayOver }">
      <div class="screen-content">
        <div class="screen-background"></div>
        <loading-screen :loading="isPending && isDelayOver"></loading-screen>

        <div v-bar v-show="raids.length > 0">
          <div class="flex flex-column current-raids-list">
            <current-raid-element
              v-for="(raidState, index) in raids"
              :key="raidState.id"
              :raidState="raidState"
              @claimed="handleRaidClaimed(index)"
            ></current-raid-element>
          </div>
        </div>

        <div
          class="flex flex-column flex-center height-100 width-100"
          v-show="raids.length == 0"
        >
          <span class="font-size-22 margin-bottom-2">{{
            $t("raids-empty")
          }}</span>
          <CustomButton type="yellow" @click="summonRaid" id="btn-summon">{{
            $t("raid-summon-now")
          }}</CustomButton>
        </div>
      </div>

      <portal to="footer" v-if="isActive">
        <CustomButton type="yellow" @click="summonRaid" id="btn-summon">{{
          $t("btn-summon")
        }}</CustomButton>
      </portal>
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
  },
  methods: {
    async fetchRaids() {
      this.request = this.$game.fetchCurrentRaids();

      try {
        this.raids = await this.request;
      } catch (e) {
        console.error(e);
      }
    },
    summonRaid() {
      this.$router.push({ name: "raids-for-summon" });
    },
    handleRaidClaimed(raidIndex) {
      this.raids.splice(raidIndex, 1);
    }
  }
};
</script>

<style lang="less" scoped>
.current-raids-list {
  min-height: 0;
}
</style>
