<template>
  <UserDialog :title="$t('d-exit-t')" class="font-size-22" @close="$close">
    <template v-slot:content>
      <div v-if="canLeave">
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
import { mapState, mapGetters } from "vuex";
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
    ...mapGetters({
      maxFloor: "dungeon/maxFloor"
    }),
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
      this.canLeave = this.maxFloor > this.maze.floor;
    },
    handle() {
      // Do stuff
      this.$close(true);
    }
  }
};
</script>
