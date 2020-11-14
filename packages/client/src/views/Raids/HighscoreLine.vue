<template>
  <div
    :class="{local: local}"
    class="font-size-18 margin-top-1 flex flex-center"
  >
    <span v-if="index >= 0" class="margin-right-1 width-5">{{index+1}}.</span>
    <span class="margin-right-1 width-60 trim-text">{{record.by}}</span>

    <IconWithValue valueClass="digit-font font-weight-700" iconClass="icon-attack small">
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

.local {
  color: #ff0d74;
}
</style>
