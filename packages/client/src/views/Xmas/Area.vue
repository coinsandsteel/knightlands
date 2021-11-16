<template>
  <div class="flex relative flex-items-center padding-top-1">
    <div class="width-100 height-100 xmas-area" ref="wrapper"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PromptMixin from "@/components/PromptMixin.vue";
import Erorrs from "@/../../knightlands-shared/errors";

import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import { create } from "vue-modal-dialogs";

//const ShowEnemyPopup = create(EnemyPopup, "enemyId", "enemyCurrentHealth");

export default {
  mixins: [PromptMixin, NetworkRequestErrorMixin],
  components: {},
  watch: {
  },
  async mounted() {
    this._resize = this.init.bind(this);
    window.addEventListener("resize", this._resize);
  },
  activated() {
  },
  destroyed() {
    window.removeEventListener("resize", this._resize);
  },
  data: () => ({
  }),
  computed: {
    ...mapState({
      xmas: state => state.xmas.loaded,
      area: state => state.xmas.area,
      user: state => state.xmas.user
    }),
  },
  methods: {
    init() {
      //this.$set(this.cssVars, "--height", this.height);
      //this.$set(this.cssVars, "--width", this.width);
    },
  }
};
</script>

<style lang="less" scoped>
</style>
