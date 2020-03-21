<template>
  <user-dialog title="filter" @close="$close(computedFilters)">
    <template v-slot:content>
      <div class="flex width-100 padding-1 flex-space-evenly margin-top-3 font-size-25">
        <p-check
          style="p-default p-curve p-thick"
          class="checkbox margin-bottom-1"
          name="check"
          color="warning"
          :checked="allFiltersState()"
          v-model="allFilters"
        >{{$t("all-filters")}}</p-check>

        <p-check
          v-for="(_, filter) in computedFilters"
          :key="filter"
          class="checkbox margin-bottom-1"
          style="p-default p-curve p-thick"
          name="check"
          color="warning"
          v-model="computedFilters[filter]"
        >{{$t(filter)}}</p-check>
      </div>
    </template>
  </user-dialog>
</template>

<script>
import UserDialog from "./UserDialog.vue";

export default {
  components: { UserDialog },
  props: ["customFilter", "stateFilters", "commitCmd"],
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
      },
      deep: true
    },
    allFilters() {
      this.setAllFilters(this.allFilters);
    }
  },
  methods: {
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


