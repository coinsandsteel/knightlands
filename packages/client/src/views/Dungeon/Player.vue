<template>
  <div
    class="dungeon-player flex flex-center pointer-events-none"
    :style="style"
    :class="{ invis: user.invis > 0 }"
    @click="handleClick"
  >
    <div class="avatar">
      <Avatar :preview="true" />
    </div>

    <div class="border absolute-stretch"></div>
  </div>
</template>

<script>
import anime from "animejs/lib/anime.es.js";
import Avatar from "@/views/Character/Avatars/Avatar.vue";
import { mapState } from "vuex";

export default {
  data: () => ({
    pos: {
      x: 0,
      y: 0
    }
  }),
  components: { Avatar },
  computed: {
    style() {
      return {
        left: this.pos.x + "px",
        top: this.pos.y + "px"
      };
    },
    ...mapState({
      user: state => state.dungeon.user
    })
  },
  methods: {
    handleClick() {
      this.$emit("click", { index: -1 });
    },
    snapToPosition({ x, y }) {
      this.pos.x = x;
      this.pos.y = y;
    },
    async moveToPosition({ x, y }) {
      anime.remove(this.pos);

      const timeline = anime({
        targets: this.pos,
        x,
        y,
        duration: 1500,
        easing: "easeOutElastic(1, .6)"
      });

      await timeline.finished;
    }
  }
};
</script>

<style lang="less" scoped>
.dungeon-player {
  & .avatar {
    width: calc(var(--item-size) * 0.55);
    height: calc(var(--item-size) * 0.55);

    & img {
      max-width: 100% !important;
    }
  }

  & .border {
    background-image: url("/images/halloween_assets/avatar_border1.png");
    background-position: center;
    background-size: contain;
  }

  &.invis {
    opacity: 0.5;
  }
}
</style>
