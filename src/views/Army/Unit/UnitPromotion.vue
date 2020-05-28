<template>
  <div class="screen-content">
    <div class="color-panel-3 stats-grid font-size-18">
      <span class="left">Damage 9999</span>
      <span class="right-arrow"></span>
      <span class="right">Damage 99999</span>

      <span class="left">Lv 9999</span>
      <span class="right-arrow"></span>
      <span class="right">Lv 99999</span>

      <UnitStars :stars="stars" class="left"></UnitStars>
      <span class="right-arrow"></span>
      <UnitStars :stars="starsNext" class="right"></UnitStars>
    </div>

    <div class="color-panel-4">
        
    </div>
  </div>
</template>

<script>
import UnitItem from "../UnitItem.vue";
import UnitStars from "../UnitStars.vue";
import UnitGetterMixin from "../UnitGetterMixin.vue";

import TroopsMeta from "@/troops_meta";
import GeneralsMeta from "@/generals_meta";

export default {
  mixins: [UnitGetterMixin],
  props: ["unit"],
  data: () => ({}),
  components: { UnitStars, UnitItem },
  computed: {
    starsNext() {
      if (this.stars < 10) {
        return this.stars + 1;
      }

      return this.stars;
    },
    recipe() {
      let meta = GeneralsMeta.fusionMeta;
      if (this.unit.troop) {
        meta = TroopsMeta.fusionMeta;
      }

      let template = meta.templates.find(t => t.stars == this.stars);
      return template;
    }
  }
};
</script>

<style lang="less" scoped>
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 4rem 1fr;
  grid-auto-rows: 3rem;
  align-items: center;
  justify-items: center;

  & .left {
    justify-self: end;
  }

  & .right {
    justify-self: start;
  }
}
</style>
