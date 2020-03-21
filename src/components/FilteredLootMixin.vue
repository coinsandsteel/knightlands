<script>
import DoubleBuffer from "@/helpers/DoubleBuffer";

import ItemFilterComponent from "@/components/ItemFilter.vue";
import { create as CreateDialog } from "vue-modal-dialogs";

const ItemFilter = CreateDialog(ItemFilterComponent);

export default {
  data: () => ({
    filteredItems: [],
    filtersStore: null
  }),
  created() {
    this.filtersStore = this.$store.getters.getItemFilters;
    this.commitCmd = "setItemFilters";
    this.filteredItemsBuffer = new DoubleBuffer();
  },
  mounted() {
    this.updateItems();
  },
  watch: {
    items() {
      this.updateItems();
    }
  },
  computed: {
    items() {
      return this.$game.inventory.items;
    }
  },
  methods: {
    updateItems() {
      this.filterItems(this.filtersStore);
    },
    async showItemFilter(options) {
      options = options || {};
      options.stateFilters = this.filtersStore;
      options.commitCmd = this.commitCmd;

      const filters = await ItemFilter(options);
      if (filters) {
        this.filterItems(filters);
      }
    },
    filterItems(filters) {
      this.filteredItems = this.$game.inventory.filterItemsByType(
        filters,
        this.filteredItemsBuffer.get()
      );
    }
  }
};
</script>