<template>
  <div class="flex flex-column flag-icons flex-no-wrap">
    <span v-if="type" :class="`unit_type_${type}`"></span>
    <span v-if="element" :class="`unit_element_${element}`"></span>
    <span v-if="weaponType" :class="`weapon-badge ${weaponType}`"></span>
    <span v-if="!type"></span>
    <span v-if="!element"></span>
    <span v-if="!weaponType"></span>
  </div>
</template>

<script>
export default {
  props: ["weaponType", "element", "type"]
};
</script>

<style lang="less" scoped>
.flag-icons {
  & > span {
    width: unset !important;
    height: unset !important;
    max-height: 45px;
    max-width: 45px;
    flex-basis: 45px;
  }
}
</style>
