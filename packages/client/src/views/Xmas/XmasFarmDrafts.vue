<template>
  <div ref="list" class="farm-draft-list width-100">
    <vue-horizontal-list :items="items" :options="options">
      <template v-slot:default="{ item }">
        <div class="farm-draft-item font-size-20" @click="handleItemClick">Tier {{ item.tier }}</div>
      </template>
    </vue-horizontal-list>
  </div>
</template>

<script>
import anime from "animejs/lib/anime.es.js";
import { mapState } from "vuex";

import VueHorizontalList from "vue-horizontal-list";

export default {
  components: {
    VueHorizontalList
  },
  watch: {
    mode(value) {
      let animeParams = {
        targets: this.$refs.list,
        duration: 350,
        easing: "easeInCubic"
      };

      if (value === "collect") {
        anime({ ...animeParams, bottom: "-15rem" });
      } else {
        anime({ ...animeParams, bottom: "0rem" });
      }
    }
  },
  data() {
    return {
      items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
        return {
          tier: i
        };
      }),
      options: {
        item: {
          class: "",
          padding: 0
        },
        responsive: [{ size: 4 }]
      }
    };
  },
  computed: {
    ...mapState({
      mode: state => state.xmas.mode
    })
  },
  methods: {
    handleItemClick() {
      this.$app.$emit("farm-blur");
    },
    triggerVisibility() {
      anime({
        targets: ".dom-attribute-demo input",
        value: [0, 1000],
        round: 1,
        easing: "easeInOutExpo"
      });
    }
  }
};
</script>

<style lang="less" scoped>
.farm-draft-list {
  position: absolute;
  bottom: 0rem;
  right: 0;
  z-index: 10;
}
.farm-draft-item {
  padding-top: 6rem;
  height: 15rem;
  background: green;
}
</style>
