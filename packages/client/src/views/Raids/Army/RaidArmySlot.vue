<template>
  <div class="unit-item relative" @click="$emit('click', unit)">
    <template v-if="unit">
      <div class="bg absolute-stretch" :style="unitImage"></div>

      <div class="selected" v-show="selected"></div>
      <div
        class="flex flex-column height-100 relative flex-no-wrap flex-items-start unit-item-content"
      >
        <UnitStars class="stars width-100 relative" :stars="stars" />
        <!-- <Flag
          class="item-badge-grid"
          :weaponType="weaponType"
          :element="element"
          :type="unitType"
        /> -->
        <span
          class="width-100 font-size-20 font-weight-900 unit-item-lvl center-transform font-outline"
          >{{ $t("unit-lvl", { lvl: level }) }}</span
        >
      </div>
    </template>
  </div>
</template>

<script>
import UnitGetter from "../../Army/UnitGetterMixin.vue";
import UnitStars from "../../Army/UnitStars.vue";
// import Flag from "../../Army/Flag.vue";
import anime from "animejs/lib/anime.es.js";

export default {
  props: ["unit", "selected", "empty"],
  mixins: [UnitGetter],
  components: { UnitStars },
  data: () => ({
    damageDone: 123456
  }),
  methods: {
    showDamage(damage) {
      this.damageDone = damage;

      const FontSize = this.crit ? "4rem" : "*=3";
      const color = this.crit ? "#fdc64f" : "#ff3e3e";
      const easing = "easeOutElastic";

      let timeline = anime.timeline({
        targets: this.$refs.damageText
      });

      timeline.add({
        "font-size": "0rem",
        opacity: 0,
        duration: 0,
        delay: 0
      });

      timeline.add({
        duration: 600,
        easing: easing,
        color: color,
        "font-size": FontSize,
        translateY: "-5rem",
        opacity: 1
      });

      timeline.add({
        duration: 1000,
        "font-size": FontSize,
        opacity: 0,
        translateY: 0
      });
    }
  }
};
</script>

<style lang="less" scoped>
.selected {
  background-image: url("../../../assets/ui/slot_selected.png");
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.unit-item-content {
  display: grid;
  grid-template-columns: 30% 1fr;
  grid-template-rows: 20% 1fr 20%;
  align-items: stretch;

  & .item-badge-grid {
    grid-column: 1;
    grid-row: ~"1/4";
  }

  & .stars {
    grid-column: ~"1/3";
    grid-row: 1;
  }
}

.unit-item-lvl {
  position: absolute;
  bottom: 0;
}

.unit-item-shadow {
  // background-image: url("../../../assets/ui/troops_mini_shadow.png");
  background-repeat: no-repeat;
  background-size: cover;
}

.unit-item {
  &:before {
    background-image: url("../../../assets/ui/troops_mini_bg.png");
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 0.4;
  }

  & .bg {
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    width: 100%;
    height: 100%;
  }

  // & ::before {
  //   padding-top: 100%;
  // }
}

.damage-text {
  z-index: 99;
}
</style>
