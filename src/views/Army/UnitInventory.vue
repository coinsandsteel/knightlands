<template>
  <div v-bar>
    <div class="flex-full dummy-height">
      <div class="padding-half">
        <div class="width-100 flex">
          <!-- <UnitItem @click="$emit('unitSelect', null)" /> -->
          <UnitItem
            class="width-20"
            v-for="unit in units"
            :key="unit.id"
            :unit="unit"
            :active="unit == selectedUnit"
            @click="$emit('unitSelect', unit)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UnitItem from "./UnitItem.vue";

export default {
  props: ["units", "selectedUnit"],
  components: { UnitItem }
};
</script>

<style lang="less" scoped>
.unit-items {
  float: left;
}
</style>
