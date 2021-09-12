<template>
  <UserDialog @close="$close()">
    <template v-slot:content>
      <!-- Stars -->

      <div class="stars-grid width-100 margin-bottom-5 margin-top-5">
        <CustomButton type="blue" @click="toggleAll('starsFilter')">{{
          !all_starsFilter ? $t("all") : $t("none")
        }}</CustomButton>
        <IconCheckbox
          v-for="star in stars"
          :key="star"
          class="margin-right-1"
          v-model="starsFilter[star]"
          onClass="star op active"
          offClass="star op"
        >
          {{ star }}
        </IconCheckbox>
      </div>

      <div class="flex flex-center margin-bottom-5">
        <CustomButton type="blue" @click="toggleAll('elementFilter')">{{
          !all_elementFilter ? $t("all") : $t("none")
        }}</CustomButton>
        <IconCheckbox
          v-for="element in elements"
          :key="element"
          class="margin-right-1"
          v-model="elementFilter[element]"
          :onClass="`op unit_element_${element} active`"
          :offClass="`op unit_element_${element}`"
        >
        </IconCheckbox>
      </div>

      <div class="types-grid width-100 margin-bottom-5">
        <CustomButton type="blue" @click="toggleAll('typeFilter')">{{
          !all_typeFilter ? $t("all") : $t("none")
        }}</CustomButton>
        <IconCheckbox
          v-for="(type, id) in types"
          :key="type"
          class="margin-right-1 margin-bottom-2"
          v-model="typeFilter[id]"
          :onClass="`op unit_type_${type} active`"
          :offClass="`op unit_type_${type}`"
        >
        </IconCheckbox>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import IconCheckbox from "@/components/IconCheckbox.vue";
import CustomButton from "@/components/Button.vue";
import Elements from "@/../../knightlands-shared/elements";
import ArmyUnitTypes from "@/army_unit_types";

export default {
  props: ["filter", "filterChangedCb", "commitCmd"],
  components: { UserDialog, IconCheckbox, CustomButton },
  data: () => ({
    stars: 10,
    elements: Elements,
    types: ArmyUnitTypes,
    starsFilter: {},
    elementFilter: {},
    typeFilter: {}
  }),
  mounted() {
    this.starsFilter = Object.assign({}, this.filter.star);
    this.elementFilter = Object.assign({}, this.filter.element);
    this.typeFilter = Object.assign({}, this.filter.type);
  },
  computed: {
    all_starsFilter() {
      let all = true;
      for (const k in this.starsFilter) {
        if (!this.starsFilter[k]) {
          all = false;
          break;
        }
      }
      return all;
    },
    all_elementFilter() {
      let all = true;
      for (const k in this.elementFilter) {
        if (!this.elementFilter[k]) {
          all = false;
          break;
        }
      }
      return all;
    },
    all_typeFilter() {
      let all = true;
      for (const k in this.typeFilter) {
        if (!this.typeFilter[k]) {
          all = false;
          break;
        }
      }
      return all;
    }
  },
  watch: {
    starsFilter: {
      deep: true,
      handler() {
        this.$store.commit(this.commitCmd, {
          star: this.starsFilter,
          type: this.typeFilter,
          element: this.elementFilter
        });
        this.onFilterChanged();
      }
    },
    elementFilter: {
      deep: true,
      handler() {
        this.$store.commit(this.commitCmd, {
          star: this.starsFilter,
          type: this.typeFilter,
          element: this.elementFilter
        });
        this.onFilterChanged();
      }
    },
    typeFilter: {
      deep: true,
      handler() {
        this.$store.commit(this.commitCmd, {
          star: this.starsFilter,
          type: this.typeFilter,
          element: this.elementFilter
        });
        this.onFilterChanged();
      }
    }
  },
  methods: {
    toggleAll(filterName) {
      const all = this[`all_${filterName}`];
      for (const k in this[filterName]) {
        this[filterName][k] = !all;
      }
    },
    onFilterChanged() {
      if (this.filterChangedCb) {
        this.filterChangedCb({
          star: this.starsFilter,
          type: this.typeFilter,
          element: this.elementFilter
        });
      }
    }
  }
};
</script>

<style lang="less">
.op {
  opacity: 0.4;
  width: 5rem !important;
  height: 5rem !important;
  transition: opacity 0.2s ease-in;

  &.active {
    opacity: 1;
  }
}
</style>

<style lang="less" scoped>
.types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
}

.stars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  row-gap: 1rem;
}
</style>
