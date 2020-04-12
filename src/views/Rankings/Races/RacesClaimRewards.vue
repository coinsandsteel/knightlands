<template>
  <Promised :promise="request">
    <template v-slot:combined="{ isPending, isDelayOver }">
      <div class="screen-content">
        <LoadingScreen :loading="true" :opacity="0.7" v-show="isPending && isDelayOver"></LoadingScreen>
        <RaceRewardListElement
          v-for="r in localRaces"
          :key="r._id"
          :race="r"
          @claim="claimRewards"
        />
      </div>
    </template>
  </Promised>
</template>

<script>
import AppSection from "@/AppSection.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import { Promised } from "vue-promised";
import RaceRewardListElement from "./RaceRewardListElement.vue";
import ShowItemsMixin from "@/components/ShowItemsMixin.vue";

export default {
  mixins: [AppSection, ShowItemsMixin],
  props: ["race"],
  components: { RaceRewardListElement, LoadingScreen, Promised },
  data: () => ({
    request: null,
    localRaces: []
  }),
  created() {
    this.title = "window-preview-rewards";
  },
  async mounted() {
    if (!this.race) {
      this.request = this.$game.getFinishedrace();
      this.localRaces = await this.request;
    } else {
      this.localRaces.push(...this.race);
    }
  },
  methods: {
    async claimRewards(race) {
      this.request = this.$game.claimRaceRewards(race._id);
      let rewards = await this.request;

      this.localRaces.splice(
        this.localRaces.findIndex(x => x == race),
        1
      );

      await this.showItems(rewards);
    }
  }
};
</script>