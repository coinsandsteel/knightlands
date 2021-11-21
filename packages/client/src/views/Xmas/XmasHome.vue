<template>
  <div class="screen-content flex-items-center full-flex">
    <div class="screen-background"></div>

    <div class="wrapper relative width-100 height-100">
      <XmasMap ref="area" />
      <ModeSwitch />
    </div>

    <portal to="footer">
      <CustomButton type="blue">{{
        $t("btn-cp")
      }}</CustomButton>
    </portal>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import AppSection from "@/AppSection.vue";
import Title from "@/components/Title.vue";
import UiConstants from "@/ui_constants";
import ProgressBar from "@/components/ProgressBar.vue";
import anime from "animejs/lib/anime.es.js";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import PromptMixin from "@/components/PromptMixin.vue";

import XmasMap from "./XmasMap.vue";
import ModeSwitch from "./ModeSwitch.vue";

export default {
  mixins: [AppSection, NetworkRequestErrorMixin, PromptMixin],
  components: {
    XmasMap,
    ModeSwitch,
    Title,
    ProgressBar,
    CustomButton,
    IconWithValue
  },
  data: () => ({}),
  activated() {},
  created() {
    this.title = "w-xmas";
  },
  destroyed() {},
  computed: {
    ...mapState({
      area: state => state.xmas.area,
      user: state => state.xmas.user
    }),
    ...mapGetters({
      playerStats: "xmas/playerStats"
    })
  },
  methods: {}
};
</script>

<style lang="less" scoped>
@import (reference) "../../style/common.less";
</style>
