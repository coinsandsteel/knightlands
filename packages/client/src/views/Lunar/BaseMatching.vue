<template>
  <!-- <div class="full-flex dummy-height width-100"> -->
  <div class="full-flex dummy-height width-100">
    <div
      class="width-100 height-100 dummy-height flex flex-column flex-no-wrap font-weight-900"
    >
      <MatchingContainer />
      <ElementContainer />

      <!-- <Inventory
      class="full-flex width-100 height-100 margin-top-1"
      _commitCmd="setEquipmentFilters"
      :_hideBg="true"
      :_filtersStore="$store.getters.getEquipmentFilters"
    ></Inventory> -->
    </div>
  </div>
</template>
<script>
// import Inventory from "@/views/Character/Inventory.vue";
import ElementContainer from "@/views/Lunar/ElementContainer.vue";
import MatchingContainer from "@/views/Lunar/MatchingContainer.vue";
export default {
  components: {
    // Inventory
    ElementContainer,
    MatchingContainer
  },
  data() {
    return {};
  }
};
</script>
