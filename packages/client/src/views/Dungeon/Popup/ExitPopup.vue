<template>
  <UserDialog :title="$t('d-exit-t')" class="font-size-22" @close="$close">
    <template v-slot:content>
      <div v-if="maze.enemiesLeft">
        <span>{{ $t('defeat-to-leave') }}</span>
      </div>
      <div v-else-if="canLeave">
        <span>{{ $t('go-deeper') }}</span>
      </div>
      <div v-else>
        <div class="margin-left-2 flex flex-center">
          {{ $t('until-next-floor') }}:
          {{ timer.value }}
        </div>
      </div>
    </template>

    <template v-slot:footer>
      <CustomButton type="yellow" @click="$close">{{
        $t("btn-ok")
      }}</CustomButton>
      <CustomButton type="green" @click="handle" v-if="canLeave">{{
        $t("btn-leave")
      }}</CustomButton>
    </template>
  </UserDialog>
</template>

<script>
import { mapState } from "vuex";
import UserDialog from "@/components/UserDialog.vue";
import CustomButton from "@/components/Button.vue";
import timer from "@/timer";

export default {
  components: { UserDialog, CustomButton },
  data: () => ({
    timer: new timer(true),
    canLeave: false
  }),
  computed: {
    ...mapState({
      maze: state => state.dungeon.maze
    })
  },
  mounted() {
    this.updateNextFloorTimer();
  },
  methods: {
    updateNextFloorTimer() {
      const diff = this.$game.nowSec - this.maze.startTime;
      this.timer.timeLeft = 86400 - (diff % 86400);

      const maxFloor = Math.max(Math.ceil(diff / 86400), 0);
      this.canLeave = maxFloor > this.maze.floor && this.maze.enemiesLeft <= 0;
    },
    handle() {
      // Do stuff
      this.$close(true);
    }
  }
};
</script>
