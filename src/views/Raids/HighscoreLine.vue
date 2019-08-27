<template>
  <div
    :class="{local: local}"
    class="font-size-15 width-100 damage-line font-weight-700 flex flex-items-center flex-start"
  >
    <span v-if="index >= 0" class="margin-right-1">{{index+1}}.</span>
    <span class="margin-right-1">
      {{record.by}}
      <span v-if="local">{{$t("highscore-you-mark")}}</span>
    </span>

    <IconWithValue
      valueClass="digit-font"
      iconClass="icon-attack icon-size-mini"
    >{{record.damageDone}}</IconWithValue>
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
.damage-line {
  margin-top: 1%;
}

.local {
  color: #ff0d74;
}
</style>
