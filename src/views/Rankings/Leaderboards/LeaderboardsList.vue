<template>
  <div class="screen-content">
    <div v-bar>
      <div>
        <LeaderboardListElement
          v-for="type in LeaderboardsMeta"
          :key="type"
          :type="type"
          @view="openLeaderboard"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import LeaderboardsMeta from "@/leaderboards_meta";
import LeaderboardListElement from "./LeaderboardListElement.vue";

export default {
  mixins: [AppSection],
  components: { LeaderboardListElement },
  data: () => ({
    LeaderboardsMeta
  }),
  created() {
    this.title = "window-leaderboards";
  },
  methods: {
    openLeaderboard(type) {
      this.$router.push({ name: "leaderboard-view", params: { id: type } });
    }
  }
};
</script>