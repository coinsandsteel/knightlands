<script>
import DoubleBuffer from "@/helpers/DoubleBuffer";

import ItemFilterComponent from "@/components/ItemFilter.vue";
import { create as CreateDialog } from "vue-modal-dialogs";
import debounce from "lodash.throttle";

const ItemFilter = CreateDialog(ItemFilterComponent);

export default {
  props: [],
  data: () => ({
    filteredItems: []
  }),
  created() {
    this.filtersStore = this.$store.getters.getItemFilters;
    this.commitCmd = "setItemFilters";
    this.filteredItemsBuffer = new DoubleBuffer();
    this._updateItems = debounce(this.updateItems.bind(this), 50);
  },
  mounted() {
    this._updateItems();
  },
  watch: {
    items() {
      this._updateItems();
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
      options.filterChangedCb = this.filterItems.bind(this);

      await ItemFilter(options);
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
