<template>
  <UserDialog title="battle units filter" @close="closeHandler()" emitClose>
    <template v-slot:content>
      <div class="font-size-25 capitalize flex width-100 flex-column padding-1">
        <div class="flex width-100 flex-space-evenly">
          <p-check
            v-for="tierOption in tierOptions"
            :key="tierOption.value"
            class="checkbox margin-bottom-1"
            color="warning"
            :checked="selectedTiersFilter.includes(tierOption.value)"
            @change="tierCheckHandler(tierOption)"
            >{{ $t(tierOption.label) }}</p-check
          >
        </div>
        <div class="flex width-100 flex-space-evenly margin-top-2">
          <p-check
            v-for="classOption in classOptions"
            :key="classOption.value"
            class="checkbox margin-bottom-1"
            color="warning"
            :checked="selectedClassesFilter.includes(classOption.value)"
            @change="classCheckHandler(classOption)"
            >{{ $t(classOption.label) }}</p-check
          >
        </div>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import { mapState } from "vuex";
import cloneDeep from "lodash/cloneDeep";
import * as battle from "@/../../knightlands-shared/battle";

export default {
  data() {
    return {
      // selectedTierOptions: [],
      // selectedClassOptions: []
    };
  },
  computed: {
    ...mapState("battle", ["selectedTiersFilter", "selectedClassesFilter"]),
    tierOptions() {
      return [
        {
          value: 1,
          label: "Tier 1"
        },
        {
          value: 2,
          label: "Tier 2"
        },
        {
          value: 3,
          label: "Tier 3"
        }
      ];
    },
    classOptions() {
      return [
        {
          value: battle.UNIT_CLASS_MELEE,
          label: "Melee"
        },
        {
          value: battle.UNIT_CLASS_RANGE,
          label: "Range"
        },
        {
          value: battle.UNIT_CLASS_MAGE,
          label: "Mage"
        },
        {
          value: battle.UNIT_CLASS_TANK,
          label: "Tank"
        },
        {
          value: battle.UNIT_CLASS_SUPPORT,
          label: "Support"
        }
      ];
    }
  },
  created() {},
  methods: {
    closeHandler(result) {
      this.$close(result);
      if (!result) {
        return;
      }
    },
    tierCheckHandler(option) {
      const values = cloneDeep(this.selectedTiersFilter);
      const index = values.findIndex(item => option.value === item);

      if (index > -1) {
        values.splice(index, 1);
      } else {
        values.push(option.value);
      }

      this.$store.dispatch("battle/setTiersFilter", values);
    },
    classCheckHandler(option) {
      const values = cloneDeep(this.selectedClassesFilter);
      const index = values.findIndex(item => option.value === item);

      if (index > -1) {
        values.splice(index, 1);
      } else {
        values.push(option.value);
      }

      this.$store.dispatch("battle/setClassesFilter", values);
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
