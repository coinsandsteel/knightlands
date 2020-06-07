<template>
<div class="height-100" @click="show">
  <div class="screen-background"></div>
  <div class="height-100" v-bar>
    <div class="flex-full dummy-height">
      <div class="width-100 padding-half results">
        <UnitSlot class="preview-u" v-for="unit in units" :key="unit.id" :unit="unit" />
      </div>
    </div>
  </div>
</div>
</template>

<script>
import UnitSlot from "../../Army/UnitSlot.vue";
import anime from "animejs/lib/anime.es.js";

const duration = 400;

export default {
  props: ["units"],
  components: { UnitSlot },
  watch: {
    units: {
      immediate: true,
      handler() {
        anime.remove(".preview-u");
        anime.set(".preview-u", { opacity: 0, scale: 0 });

        this.$nextTick(()=>{
          this.show();
        });
      }
    }
  },
  methods: {
    async show() {
      console.log("show")
      anime({
        targets: ".preview-u",
        opacity: {
          value: [0, 1],
          easing: "linear",
          duration: duration
        },
        scale: {
          value: [0, 1],
          easing: "easeOutElastic(1, 2)"
        },
        duration: duration,
        delay: anime.stagger(50)
      });
    }
  }
};
</script>

<style lang="less" scoped>

.results {
  display: grid;
  grid-template-columns: repeat(3, 33%);
  grid-auto-rows: 26rem;
  justify-items: stretch;
  column-gap: 0.5%;
  row-gap: 1rem;
}

</style>
