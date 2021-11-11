<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <RaceRewardListElement
      v-for="r in localRaces"
      :key="r._id"
      :race="r"
      @claim="claimRewards"
    />
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import RaceRewardListElement from "./RaceRewardListElement.vue";
import ShowItemsMixin from "@/components/ShowItemsMixin.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

export default {
  mixins: [AppSection, ShowItemsMixin, NetworkRequestErrorMixin],
  props: ["race"],
  components: { RaceRewardListElement },
  data: () => ({
    request: null,
    localRaces: []
  }),
  created() {
    this.title = "window-preview-rewards";
  },
  async mounted() {
    if (!this.race) {
      this.localRaces = await this.performRequest(
        this.$game.getFinishedRaces()
      );
    } else {
      this.localRaces.push(...this.race);
    }
  },
  methods: {
    async claimRewards(race) {
      let rewards = await this.performRequest(
        this.$game.claimRaceRewards(race._id)
      );

      this.localRaces.splice(
        this.localRaces.findIndex(x => x == race),
        1
      );

      await this.showItems(rewards);
    }
  }
};
</script>
