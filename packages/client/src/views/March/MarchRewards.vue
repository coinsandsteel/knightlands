<template>
  <div class="font-size-22 text-center">
    <div class="">March rewards</div>

    <div class="flex flex-no-wrap flex-center margin-top-2">
      <div class="margin-right-2">Reward 1:</div>
      <Loot :id="`i-${reward1.template}`" :item="reward1" :inventory="true" />
    </div>
    <div class="flex flex-no-wrap flex-center margin-top-2">
      <div class="margin-right-2">Reward 2:</div>
      <Loot :id="`i-${reward2.template}`" :item="reward2" :inventory="true" />
    </div>
    <div class="flex flex-no-wrap flex-center margin-top-2">
      <div class="margin-right-2">Reward 3:</div>
      <Loot :id="`i-${reward3.template}`" :item="reward3" :inventory="true" />
    </div>
  </div>
</template>
<script>
import Loot from "@/components/Loot.vue";

export default {
  components: { Loot },
  computed: {
    reward1() {
      return {
        id: 4260,
        template: 3448,
        count: 1,
        level: 1,
        exp: 0,
        equipped: false,
        breakLimit: 0,
        unique: false,
        index: 8
      };
    },
    reward2() {
      return {
        id: 4252,
        template: 3450,
        count: 1,
        level: 1,
        exp: 0,
        equipped: false,
        breakLimit: 0,
        unique: false,
        index: 13
      };
    },
    reward3() {
      return {
        id: 3006,
        template: 2677,
        count: 1,
        level: 48,
        exp: 90,
        equipped: false,
        breakLimit: 0,
        unique: true,
        rarity: "legendary",
        element: "physical",
        locked: false,
        index: 20
      };
    }
  }
};
</script>
<style scoped lang="less"></style>
