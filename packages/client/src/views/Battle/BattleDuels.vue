<template>
  <div>
    <div v-for="item in items" :key="item.user.id">
      <div class="battle-unit-list">
        <BattleUnit
          v-for="unit in item.units"
          :key="unit.id"
          @click="unitClickHandler"
        />
      </div>
      <div>
        <CustomButton
          type="yellow"
          width="20rem"
          class="inline-block"
          @click="handleStart"
          >{{ $t("fight???") }}</CustomButton
        >
      </div>
    </div>
  </div>
</template>
<script>
import BattleUnit from "@/views/Battle/BattleUnit.vue";
export default {
  components: {
    BattleUnit
  },
  data() {
    return {};
  },
  computed: {
    items() {
      const result = [];
      result.push({
        user: { id: 1 },
        units: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
      });
      result.push({
        user: { id: 2 },
        units: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
      });
      result.push({
        user: { id: 3 },
        units: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
      });
      return result;
    }
  },
  methods: {
    unitClickHandler() {},
    handleStart() {
      this.$router.push({
        name: "battle-duels-play",
        params: { id: 123 }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.battle-unit-list {
  display: grid;
  grid-template-columns: repeat(5, minmax(10rem, 1fr));
  justify-items: center;
  row-gap: 0.5rem;
  column-gap: 0.5rem;
}
// .battle-enemy-unit-list {
//   display: grid;
//   grid-template-columns: repeat(5, minmax(10rem, 1fr));
//   justify-items: center;
//   row-gap: 0.5rem;
//   column-gap: 0.5rem;
// }
.battle-unit {
  width: 100%;
}
</style>
