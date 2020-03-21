<script>
import DoubleBuffer from "@/helpers/DoubleBuffer";

import ItemFilterComponent from "@/components/ItemFilter.vue";
import { create as CreateDialog } from "vue-modal-dialogs";

const ItemFilter = CreateDialog(ItemFilterComponent);

export default {
  data: () => ({
    filteredItems: []
  }),
  created() {
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
      this.filterItems(this.$store.getters.getItemFilters);
    },
    async showItemFilter() {
      let filters = await ItemFilter();
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