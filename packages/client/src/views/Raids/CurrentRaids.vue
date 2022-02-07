<template>
  <Promised :promise="request" :pendingDelay="200">
    <template v-slot:combined="{ isPending, isDelayOver }">
      <div class="screen-content">
        <div class="screen-background"></div>
        <loading-screen :loading="isPending && isDelayOver"></loading-screen>

        <div v-bar v-show="currentActiveRaids.length > 0">
          <div class="flex flex-column current-raids-list">
            <current-raid-element
              v-for="(raidState, index) in currentActiveRaids"
              :key="raidState.id"
              :raidState="raidState"
              @claimed="handleRaidClaimed(index)"
            ></current-raid-element>
          </div>
        </div>

        <div
          class="flex flex-column flex-center height-100 width-100"
          v-if="currentActiveRaids.length == 0"
        >
          <span class="font-size-22 margin-bottom-2">{{
            $t("raids-empty")
          }}</span>
          <CustomButton
            :disabled="!canSummonCurrentRaid"
            type="yellow"
            @click="summonRaid"
            id="btn-summon"
            >{{ $t("raid-summon-now") }}</CustomButton
          >
        </div>
      </div>
    </template>
  </Promised>
</template>

<script>
import { mapGetters } from "vuex";
import CustomButton from "@/components/Button.vue";
import CurrentRaidElement from "./CurrentRaidElement.vue";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";

export default {
  mixins: [ActivityMixin],
  name: "current-raids",
  components: {
    CurrentRaidElement,
    Promised,
    LoadingScreen,
    CustomButton
  },
  data: () => ({
    request: null
  }),
  computed: {
    ...mapGetters("raids", ["currentActiveRaids", "canSummonCurrentRaid"])
  },
  activated() {
    // refresh raids list
    this.fetchRaids();
  },
  methods: {
    fetchRaids() {
      this.request = this.$store.dispatch("raids/fetchCurrentRaids");
    },
    handleRaidClaimed() {
      this.fetchRaids();
    },
    summonRaid() {
      this.$router.push({ name: "raids-for-summon" });
    }
  }
};
</script>

<style lang="less" scoped>
.current-raids-list {
  min-height: 0;
}
</style>
