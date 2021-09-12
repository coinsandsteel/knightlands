<template>
  <div class="flex flex-column flag-icons flex-no-wrap">
    <span v-if="element" :class="`unit_element_${element}`"></span>
    <span v-if="weaponType" :class="`weapon-badge ${weaponType}`"></span>
    <span :class="`unit_type_${type}`"></span>
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
    max-width: 45px;
    flex-basis: 45px;
  }
}
</style>
