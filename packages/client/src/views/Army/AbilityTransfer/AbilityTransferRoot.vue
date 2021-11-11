<template>
  <keep-alive>
    <router-view
      @selectFrom="handleSelectFromUnit"
      @selectTo="handleSelectToUnit"
      @resetToUnit="toUnit = null"
      :fromUnit="fromUnit"
      :toUnit="toUnit"
    ></router-view>
  </keep-alive>
</template>

<script>
export default {
  data: () => ({
    fromUnit: null,
    toUnit: null
  }),
  methods: {
    handleSelectFromUnit(unit) {
      this.fromUnit = unit;
    },
    handleSelectToUnit(unit) {
      this.toUnit = unit;
    }
  }
};
</script>
