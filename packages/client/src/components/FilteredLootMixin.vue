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
    this._updateItems = debounce(this.updateItems.bind(this), 50);
    this.filteredItemsBuffer = new DoubleBuffer();
  },
  mounted() {
    this._updateItems();
  },
  watch: {
    "$game.inventory.items"() {
      this._updateItems();
    },
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
      let items = this.items || this.$game.inventory.items;
      items = items.filter(item => {
        const template = this.$game.itemsDB.getTemplate(item.template);
        return template.type !== "lunarResource";
      });
      return items;
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
