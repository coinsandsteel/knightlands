<template>
  <user-dialog title="filter" @close="$close(computedFilters)">
    <template v-slot:content>
      <div class="font-size-25 capitalize flex width-100 flex-column padding-1">
        <p-check
          style="p-default p-curve p-thick"
          class="checkbox margin-bottom-1"
          name="check"
          color="warning"
          :checked="allFiltersState()"
          v-model="allFilters"
          >{{ $t("all-filters") }}</p-check
        >
        <div class="flex width-100 flex-space-evenly">
          <p-check
            v-for="(_, filter) in computedFilters"
            :key="filter"
            class="checkbox margin-bottom-1"
            name="check"
            color="warning"
            v-model="computedFilters[filter]"
            >{{ $t(localisedFilter(filter)) }}</p-check
          >
        </div>
      </div>
    </template>
  </user-dialog>
</template>

<script>
import UserDialog from "./UserDialog.vue";

export default {
  components: { UserDialog },
  props: [
    "customFilter",
    "stateFilters",
    "commitCmd",
    "filterLocalisation",
    "filterChangedCb"
  ],
  data() {
    return {
      allFilters: true,
      itemFilters: {},
      computedFilters: {}
    };
  },
  created() {
    this.itemFilters = Object.assign({}, this.stateFilters);
    for (const key in this.itemFilters) {
      if (this.customFilter && !this.customFilter(key)) {
        this.itemFilters[key] = false;
      } else {
        this.$set(this.computedFilters, key, this.itemFilters[key]);
      }
    }
  },
  watch: {
    computedFilters: {
      handler() {
        for (let key in this.itemFilters) {
          this.itemFilters[key] = false;
        }

        for (let key in this.computedFilters) {
          this.itemFilters[key] = this.computedFilters[key];
        }

        this.$store.commit(this.commitCmd, this.itemFilters);
        if (this.filterChangedCb) {
          this.filterChangedCb(this.itemFilters);
        }
      },
      deep: true
    },
    allFilters() {
      this.setAllFilters(this.allFilters);
    }
  },
  methods: {
    localisedFilter(filter) {
      if (this.filterLocalisation) {
        return this.$t(this.filterLocalisation, { filter });
      }

      return this.$t(filter);
    },
    allFiltersState() {
      // if all filters except 'All' are unchecked - uncheck All too
      let uncheckAll = true;
      for (let key in this.computedFilters) {
        if (this.computedFilters[key]) {
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
      for (let key in this.computedFilters) {
        this.computedFilters[key] = value;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.checkbox {
  min-width: 40%;
  text-align: left;
  flex: 1;
}
</style>
