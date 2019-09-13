<template>
  <user-dialog title="filter" @close="$close(itemFilters)">
    <template v-slot:content>
      <div class="flex flex-space-between margin-top-3 font-size-25">
        <p-check
          v-for="(_, filter) in itemFilters.rarity"
          :key="filter"
          class="checkbox margin-bottom-1"
          :class="`rarity-${filter}`"
          style="p-default p-curve p-thick"
          name="check"
          color="warning"
          v-model="itemFilters.rarity[filter]"
        >{{filter}}</p-check>
      </div>
    </template>
  </user-dialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";

export default {
  props: ["id", "types"],
  components: { UserDialog },
  data() {
    return {
      allFilters: true,
      itemFilters: {}
    };
  },
  created() {
    let filters = this.$store.getters.getRecipeFilters(this.id);
    this.itemFilters = filters;
  },
  watch: {
    allFilters() {
      this.setAllFilters(this.allFilters);
    },
    itemFilters: {
      deep: true,
      handler() {
        this.$store.commit("setRecipeFilters", {
          id: this.id,
          filters: this.itemFilters
        });
      }
    }
  },
  methods: {
    allFiltersState() {
      // if all filters except 'All' are unchecked - uncheck All too
      let uncheckAll = true;
      for (let key in this.itemFilters) {
        if (this.itemFilters[key]) {
          uncheckAll = false;
          break;
        }
      }

      if (uncheckAll) {
        this.allFilters = !uncheckAll;
      }

      return !uncheckAll;
    },
    setAllFilters(value) {
      for (let key in this.itemFilters) {
        this.itemFilters[key] = value;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.checkbox {
  flex-basis: 50%;
  min-width: 40%;
  text-align: left;
  flex: 1;
}
</style>


