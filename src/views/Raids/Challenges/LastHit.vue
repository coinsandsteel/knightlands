<template>
  <div
    class="width-100 height-100 flex flex-column flex-no-wrap flex-items-center flex-end"
  >{{$t("LastHit-desc")}}</div>
</template>

<script>
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  name: "LastHit",
  props: ["data"],
  components: { IconWithValue }
};
</script>

<style lang="less" scoped>
.damage-line {
  margin-top: 1%;
}
</style>