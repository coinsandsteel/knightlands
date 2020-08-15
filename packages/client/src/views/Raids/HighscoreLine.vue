<template>
  <div
    :class="{local: local}"
    class="font-size-18 width-100 margin-top-1 font-weight-700 flex flex-items-center flex-start"
  >
    <span v-if="index >= 0" class="margin-right-1 width-5">{{index+1}}.</span>
    <span class="margin-right-1 width-50 highscore-text">{{record.by}}</span>

    <IconWithValue valueClass="digit-font" iconClass="icon-attack icon-size-mini">
      {{record.damageDone}}
      <span v-if="local">{{$t("highscore-you-mark")}}</span>
    </IconWithValue>
  </div>
</template>
    
<script>
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  props: ["record", "index"],
  components: { IconWithValue },
  computed: {
    local() {
      return this.record.by === this.$game.account;
    }
  }
};
</script>

<style lang="less" scoped>
.highscore-text {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
}
.local {
  color: #ff0d74;
}
</style>
