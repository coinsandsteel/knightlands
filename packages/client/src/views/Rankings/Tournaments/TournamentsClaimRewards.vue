<template>
  <Promised :promise="request">
    <template v-slot:combined="{ isPending, isDelayOver }">
      <div class="screen-content">
        <LoadingScreen :loading="isPending && isDelayOver" />
        <TournamentsRewardListElement
          v-for="t in localTournaments"
          :key="t._id"
          :tournament="t"
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
import TournamentsRewardListElement from "./TournamentsRewardListElement.vue";
import ShowItemsMixin from "@/components/ShowItemsMixin.vue";

export default {
  mixins: [AppSection, ShowItemsMixin],
  props: ["tournaments"],
  components: { TournamentsRewardListElement, LoadingScreen, Promised },
  data: () => ({
    request: null,
    localTournaments: []
  }),
  created() {
    this.title = "window-preview-rewards";
  },
  async mounted() {
    if (!this.tournaments) {
      this.request = this.$game.getFinishedTournaments();
      this.localTournaments = await this.request;
    } else {
      this.localTournaments.push(...this.tournaments);
    }
  },
  methods: {
    async claimRewards(tournament) {
      this.request = this.$game.claimTournamentRewards(tournament._id);
      let rewards = await this.request;

      this.localTournaments.splice(
        this.localTournaments.findIndex(x => x == tournament),
        1
      );

      await this.showItems(rewards);
    }
  }
};
</script>
