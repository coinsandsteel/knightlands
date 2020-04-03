<template>
  <Promised :promise="request" >
    <template v-slot:combined="{ isPending, isDelayOver, data }">
        <div class="screen-content"> 
            <LoadingScreen :loading="true" :opacity="0.7" v-show="isPending && isDelayOver"></LoadingScreen>

            <TournamentListElement v-for="t in tournaments" :key="t.id" :tournament="t"></TournamentListElement>
        </div>

    </template>
  </Promised>
</template>

<script>
import AppSection from "@/AppSection";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import TournamentListElement from "./TournamentListElement.vue";

export default {
  mixins: [AppSection],
  components: { Promised, LoadingScreen, TournamentListElement },
  created() {
    this.title = "window-tournaments";
  },
  mounted() {
    this.fetchList();
  },
  data: () => ({
    request: null,
    tournaments: []
  }),
  methods: {
    async fetchList() {
      this.request = this.$game.fetchTournaments();
      this.tournaments = await this.request;
      console.log(this.tournaments)
    }
  }
};
</script>