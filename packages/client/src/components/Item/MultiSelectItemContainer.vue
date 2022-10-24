<template>
  <div class="height-100 flex flex-column flex-no-wrap">
    <div v-bar class="width-100 height-100 dummy-height item-list">
      <div>
        <div class="item-container dummy-height">
          <loot
            v-for="mat in filteredItems"
            :key="mat.id"
            :item="mat"
            @hint="selectItem(mat)"
            :selected="itemsCount[mat.id] > 0"
          >
            <div
              class="select-overlay flex flex-center"
              :class="{ s: mat.id == selectedItem }"
              v-if="itemsCount[mat.id]"
            >
              <span class="font-size-22 font-outline font-weight-900"
                >x{{ itemsCount[mat.id] }}</span
              >
            </div>
          </loot>
        </div>
      </div>
    </div>

    <slot name="content"></slot>

    <div class="flex flex-center margin-top-1">
      <NumericValue
        class="margin-right-2"
        :value="currentItemCount"
        :decreaseCondition="currentItemCount >= 1"
        :increaseCondition="canIncreaseItemCount"
        @inc="incItemCount"
        @dec="decItemCount"
        @max="setMax"
        @reset="reset"
      ></NumericValue>

      <slot name="footer"></slot>
    </div>

    <portal to="footer" :slim="true" v-if="isActive">
      <CustomButton type="grey" @click="showItemFilter">{{
        $t("btn-filter")
      }}</CustomButton>
    </portal>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
import FilteredLootMixin from "@/components/FilteredLootMixin.vue";
import NumericValue from "@/components/NumericValue.vue";
import Loot from "@/components/Loot.vue";

export default {
  mixins: [ActivityMixin, FilteredLootMixin],
  components: { NumericValue, Loot, CustomButton },
  props: {
    shouldResetAll: Boolean
  },
  data: () => ({
    itemsCount: {},
    selectedItem: null,
    item: null
  }),
  computed: {
    canIncreaseItemCount() {
      if (!this.itemsCount[this.selectedItem]) {
        return false;
      }
      return this.item.count > this.itemsCount[this.selectedItem];
    },
    currentItemCount() {
      return this.itemsCount[this.selectedItem] || 0;
    },
    selectedItems() {
      return this.itemsCount;
    }
  },
  methods: {
    setMax() {
      this.incItemCount(this.item.count - this.currentItemCount);
    },
    reset() {
      if (this.shouldResetAll) {
        this.resetSelectedItems();
        this.$emit("reset");
        return;
      }
      this.decItemCount(this.currentItemCount);
    },
    resetSelectedItems() {
      this.itemsCount = {};
      this.selectedItem = null;
    },
    incItemCount(count) {
      count = count || 1;
      if (!this.itemsCount[this.selectedItem]) {
        this.$set(this.itemsCount, this.selectedItem, count);
      } else {
        this.itemsCount[this.selectedItem] += count;
      }

      let item = this.$game.inventory.getItem(this.selectedItem);
      this.$emit("select", { item, count, select: true });
    },
    decItemCount(count) {
      count = count || 1;
      this.itemsCount[this.selectedItem] -= count;
      let item = this.$game.inventory.getItem(this.selectedItem);
      this.$emit("select", { item, count, select: false });
      if (this.selectedItem && this.itemsCount[this.selectedItem] <= 0) {
        this.$delete(this.itemsCount, this.selectedItem);
        this.selectedItem = null;
      }
    },
    selectItem(item) {
      if (item.locked) {
        return;
      }

      let selected = this.selectedItem == item.id;
      let count = 0;
      if (selected) {
        this.selectedItem = null;
        count = this.itemsCount[item.id];
        this.$delete(this.itemsCount, item.id);
      } else {
        this.selectedItem = item.id;
        this.item = item;

        if (!this.itemsCount[item.id]) {
          this.$set(this.itemsCount, item.id, item.count);
          count = this.itemsCount[item.id];
        }
      }

      this.$emit("select", { item, count, select: !selected });
    }
  }
};
</script>

<style lang="less" scoped>
.item-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  justify-items: center;
}

.select-overlay {
  background-color: #102a2491;
  border-radius: 2px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  &.s {
    top: 0.5rem;
    left: 0.5rem;
    right: 0.5rem;
    bottom: 0.5rem;
  }
}
.item-list {
  height: 60%;
  overflow: hidden;
}
</style>
