<template>
  <div class="tab-content dummy-height flex flex-column full-flex">
    <Inventory
      class="full-flex"
      commitCmd="setMiscFilters"
      :filtersStore="$store.getters.getMiscFilters"
      :additionalFilter="additionalFilter"
    ></Inventory>
  </div>
</template>

<script>
import Inventory from "./Inventory.vue";
import TrainingCampMeta from "@/training_camp";

const BannedItemTable = {}

for (const meta of TrainingCampMeta) {
  BannedItemTable[meta.resource] = true;
}

export default {
  components: {
    Inventory
  },
  methods: {
    additionalFilter(item, template) {
      // skip usable buffs
      if (BannedItemTable[template.id]) {
        return false;
      }

      return true;
    }
  }
};
</script>
