<template>
  <div class="outer unit-ingr relative margin-right-half" @click="$emit('click', unit)">
    <div class="inner" v-if="unit && ingridient">
      <div v-if="ingridient.copy" class="bg absolute-stretch" :style="unitImage"></div>
      <div v-else class="bg absolute-stretch unit-bg-any"></div>
      <div
        class="flex flex-column height-100 relative flex-no-wrap flex-items-start unit-ingr-content"
      >
        <div class="unit-ingr-shadow absolute-stretch"></div>
        <UnitStars class="stars width-100 relative" :stars="ingridient.stars" size="mini" />
        <Flag :element="element" />

        <span
          class="width-100 font-size-18 font-weight-900 unit-ingr-lvl center-transform"
        >{{current}}/{{required}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import UnitGetter from "./../UnitGetterMixin.vue";
import UnitStars from "./../UnitStars.vue";
import Flag from "../Flag.vue";

export default {
  props: ["unit", "ingridient"],
  data: () => ({
    current: 0
  }),
  mixins: [UnitGetter],
  components: { UnitStars, Flag },
  computed: {
    targetElement() {
      if (this.ingridient.sameElement) {
        return this.element;
      }

      return this.element;
    },
    required() {
      return this.ingridient.amount;
    }
  }
};
</script>

<style lang="less" scoped>
.unit-ingr-content {
  display: grid;
  grid-template-columns: 25% 1fr;
  grid-template-rows: 20% 1fr 20%;
  align-items: stretch;

  & .item-badge-grid {
    grid-column: 1;
    grid-row: ~"1/3";
    justify-self: start;
  }

  & .stars {
    grid-column: ~"2/3";
    grid-row: 1;
  }
}

.outer {
  position: relative;

  &:before {
    display: block;
    content: "";
    width: 100%;
    padding-top: 100%;
  }

  & > .inner {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}

.unit-ingr-lvl {
  position: absolute;
  bottom: 0;
}

.unit-ingr-shadow {
  background-image: url("../../../assets/ui/troops_mini_shadow.png");
  background-repeat: no-repeat;
  background-size: cover;
}

.unit-ingr {
  height: 12rem;
  width: 12rem;

  background-image: url("../../../assets/ui/troops_mini_bg.png");
  background-repeat: no-repeat;
  background-size: cover;

  & .bg {
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    width: 100%;
    height: 100%;
  }
}

.unit-bg-any {
  background-image: url("../../../assets/ui/troops_mini_bg_add.png");
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
