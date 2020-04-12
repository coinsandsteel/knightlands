<template>
  <Promised :promise="request">
    <template v-slot:combined="{ isPending, isDelayOver }">
      <div class="screen-content">
        <LoadingScreen :loading="true" :opacity="0.7" v-show="isPending && isDelayOver"></LoadingScreen>

        <div v-bar>
          <div>
            <TournamentListElement
              v-for="t in tournaments"
              :key="t.id"
              :tournament="t"
              :currentRank="joined(t) ? current : null"
              @join="join(t)"
              @ranks="showRanks(t)"
              @rewards="showRewards(t)"
            ></TournamentListElement>
          </div>
        </div>

        <portal to="footer" :slim="true" v-if="isActive">
          <CustomButton type="green" @click="previewRewards" :disabled="finishedTournaments.length == 0">{{$t("claim-rewards")}}</CustomButton>
        </portal>
      </div>
    </template>
  </Promised>
</template>

<script>
import AppSection from "@/AppSection.vue";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import CustomButton from "@/components/Button.vue";
import TournamentListElement from "./TournamentListElement.vue";
import PromptMixin from "@/components/PromptMixin.vue";

export default {
  mixins: [AppSection, PromptMixin],
  components: { Promised, LoadingScreen, TournamentListElement, CustomButton },
  created() {
    this.title = "window-tournaments";
  },
  mounted() {
    this.fetchList();
    this.fetchFinishedTournaments();
  },
  data: () => ({
    request: null,
    tournaments: [],
    current: null,
    finishedTournaments: []
  }),
  methods: {
    previewRewards() {
      this.$router.push({
        name: "tournament-claim-rewards",
        params: {
          tournaments: this.finishedTournaments
        }
      });
    },
    async fetchFinishedTournaments() {
      this.finishedTournaments = await this.$game.getFinishedTournaments();
    },
    async fetchList() {
      this.request = this.$game.fetchTournaments();

      const info = await this.request;
      this.tournaments = info.list;
      this.current = info.currentTournament;
    },
    joined(tournament) {
      if (!this.current) return false;
      return tournament._id == this.current.id;
    },
    async join(tournament) {
      if (this.current) {
        // if already joined tournament
        let response = await this.showPrompt(
          this.$t("prompt-confirm-title"),
          this.$t("tourn-leave-desc"),
          [
            {
              type: "yellow",
              title: "btn-ok",
              response: true
            },
            {
              type: "rd",
              title: "btn-cancel",
              response: false
            }
          ]
        );

        if (!response) {
          return;
        }
      }

      this.request = this.$game.joinTournament(tournament._id);
      await this.request;
      await this.fetchList();
    },
    async showRanks(tournament) {
      this.$router.push({ name: "tournament", params: { id: tournament._id } });
      this.$router.replace({
        name: "tournament-ranks",
        params: { id: tournament._id }
      });
    },
    async showRewards(tournament) {
      this.$router.push({ name: "tournament", params: { id: tournament._id } });
      this.$router.replace({
        name: "tournament-rewards",
        params: { id: tournament._id }
      });
    }
  }
};
</script>