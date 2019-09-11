<template>
  <user-dialog title="filter" @close="$close(itemFilters)">
    <template v-slot:content>
      <div class="flex flex-space-between margin-top-3 font-size-25">
        <p-check
          style="p-default p-curve p-thick"
          class="checkbox margin-bottom-1"
          name="check"
          color="warning"
          :checked="allFiltersState()"
          v-model="allFilters"
        >All</p-check>

        <p-check
          v-for="(_, filter) in itemFilters"
          :key="filter"
          class="checkbox margin-bottom-1"
          style="p-default p-curve p-thick"
          name="check"
          color="warning"
          v-model="itemFilters[filter]"
        >{{filter}}</p-check>
      </div>
    </template>
  </user-dialog>
</template>

<script>
import UserDialog from "./UserDialog.vue";

export default {
  components: { UserDialog },
  data() {
    return {
      allFilters: true,
      itemFilters: {}
    };
  },
  created() {
    this.itemFilters = Object.assign({}, this.$store.getters.getItemFilters);
  },
  watch: {
    allFilters() {
      this.setAllFilters(this.allFilters);
    },
    itemFilters: {
      deep: true,
      handler() {
        this.$store.commit("setItemFilters", this.itemFilters);
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


