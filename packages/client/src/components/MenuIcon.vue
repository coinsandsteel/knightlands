<template>
  <LockedSection class="margin-bottom-2" :section="section">
    <router-link
      v-bind="$attrs"
      tag="div"
      :class="{ 'pointer-events-none': locked }"
    >
      <div class="flex flex-column flex-center pointer relative bg">
        <span :class="icon" class="icon-menu relative">
          <div class="marker-pos">
            <slot name="marker"></slot>
          </div>
          <span class="overlay absolute-stretch" v-if="locked">
            <span class="font-size-20 font-weight-900"
              >Lvl: {{ levelRequired }}</span
            >
          </span>
        </span>
        <span class="title-holder">
          <span class="font-size-20 capitalize">
            <slot></slot>
          </span>
        </span>
      </div>
    </router-link>
  </LockedSection>
</template>

<script>
import LockedSection from "@/components/LockedSection.vue";

export default {
  props: ["icon", "levelRequired", "section"],
  components: { LockedSection },
  computed: {
    locked() {
      if (!this.levelRequired) return false;

      return this.levelRequired > this.$game.character.level;
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "../style/common.less";

.icon-menu {
  width: 7rem;
  height: 7rem;

  // .mobile({width: 5rem; height: 5rem;});
}

.bg {
  // background-color: #15132c6b;
  border-radius: 3px;
}

.overlay {
  background-color: rgba(21, 19, 44, 0.5);

  > span {
    color: rgb(241, 76, 76);
  }
}

.title-holder {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: rgba(21, 19, 44, 0.8);
  border-radius: 0 0 3px 3px;
  min-width: 14rem;

  * > {
    white-space: normal !important;
  }
}

.marker-pos {
  position: absolute;
  top: 0;
  right: 0rem;
}
</style>
