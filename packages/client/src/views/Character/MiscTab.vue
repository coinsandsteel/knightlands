<template>
  <div class="tab-content dummy-height flex flex-column full-flex">
    <Inventory
      class="full-flex"
      commitCmd="setMiscFilters"
      :filtersStore="$store.getters.getMiscFilters"
    ></Inventory>
  </div>
</template>

<script>
import Inventory from "./Inventory.vue";

export default {
  components: {
    Inventory
  }
};
</script>
