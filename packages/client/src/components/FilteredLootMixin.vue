<script>
import DoubleBuffer from "@/helpers/DoubleBuffer";

import ItemFilterComponent from "@/components/ItemFilter.vue";
import { create as CreateDialog } from "vue-modal-dialogs";
import debounce from "lodash.throttle";

const ItemFilter = CreateDialog(ItemFilterComponent);

export default {
  props: ["commitCmd", "filtersStore", "items", "value", "filters"],
  data: () => ({
    filteredItems: []
  }),
  created() {
    this.filteredItemsBuffer = new DoubleBuffer();
    this._updateItems = debounce(this.updateItems.bind(this), 50);
  },
  mounted() {
    this._updateItems();
  },
  watch: {
    items() {
      this._updateItems();
    },
    filters: {
      deep: true,
      handler() {
        this.updateItems();
      }
    },
    filtersStore: {
      deep: true,
      handler() {
        this.updateItems();
      }
    }
  },
  computed: {
    computedItems() {
      return this.items || this.$game.inventory.items;
    }
  },
  methods: {
    updateItems(filters) {
      this.filterItems(filters || this.filtersStore);
      this.$emit("input", this.filteredItems);
    },
    async showItemFilter(options) {
      options = options || {};
      options.stateFilters = this.filtersStore;
      options.commitCmd = this.commitCmd;

      await ItemFilter(options);
    },
    filterItems(filters) {
      if (!this.filters && !filters) {
        this.filteredItems = this.computedItems;
        return;
      }

      this.filteredItems = this.$game.inventory.filterItemsByType({
        filters: this.filters || filters,
        buffer: this.filteredItemsBuffer.get(),
        filter: this.additionalFilter,
        items: this.computedItems
      });
    }
  }
};
</script>
