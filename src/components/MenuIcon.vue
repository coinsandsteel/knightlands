<template>
  <router-link v-bind="$attrs" tag="div" class="flex-basis-30" :class="{'pointer-events-none': locked}">
    <div class="flex flex-column flex-center pointer relative">
      <span :class="icon" class="icon-menu relative">
        <slot name="marker"></slot>
        <span class="overlay absolute-stretch" v-if="locked">
          <span class="font-size-20 font-weight-900">Lvl: {{levelRequired}}</span>
        </span>
      </span>
      <span class="title-holder">
        <span class="font-size-20 capitalize">
        <slot></slot>
      </span>
      </span>
    </div>
  </router-link>
</template>

<script>
export default {
  props: ["icon", "levelRequired"],
  computed: {
    locked() {
      if (!this.levelRequired) return false;

      return this.levelRequired > this.$game.character.level;
    }
  }
};
</script>

<style lang="less" scoped>
.icon-menu {
  width: 7rem;
  height: 7rem;
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
  border-radius: 3px;
  min-width: 14rem;
}
</style>
