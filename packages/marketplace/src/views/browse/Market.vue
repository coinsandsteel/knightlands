<template>
  <div class="d-flex flex-grow-1">
      <SearchOptions />
      <ItemLotContainer class="flex-grow-1" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SearchOptions from "./SearchOptions.vue";
import ItemLotContainer from "@/components/ItemLotContainer.vue";

export default Vue.extend({
  name: "Home",
  components: {
    SearchOptions,
    ItemLotContainer
  }
});
</script>
