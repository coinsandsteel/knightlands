<template>
  <UserDialog title="raid-pl">
    <template v-slot:content>
      <div class="flex flex-column">
        <div
          class="flex flex-item-center font-size-20 width-100 text-align-left pointer"
          v-for="(player, index) in players"
          :key="player.name"
          :class="[{ 'even-bg': (index + 1) % 2 == 0 }]"
          @click="preview(player._id)"
        >
          <!-- <span :class="rankIcon" class="flex-1"></span> -->
          <span class="flex-1">#{{ index + 1 }}</span>
          <Avatar :preview="true" :avatar="player.avatar" :mini="true"></Avatar>
          <span class="flex-4">{{ player.name }}</span>
          <span class="flex-3">{{ player.damage }}</span>
        </div>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import Avatar from "@/views/Character/Avatars/Avatar.vue";

export default {
  components: { UserDialog, Avatar },
  props: ["participants", "raidId"],
  mounted() {
    this.init();
  },
  data: () => ({
    players: []
  }),
  methods: {
    async init() {
      const players = await this.$game.fetchPlayersFromRaid(this.raidId);
      for (const playerId in this.participants) {
        const data = players.find(x => x._id == playerId);
        this.players.push({
          damage: this.participants[playerId],
          ...data
        });
      }

      this.players.sort((a, b) => {
        return a.damage > b.damage;
      });
    },
    preview(id) {
      this.$router.push({
        name: "preview-char",
        params: { id }
      });
      this.$close();
    }
  }
};
</script>

<style lang="less" scoped>
.even-bg {
  background-color: #303048;
}
</style>
