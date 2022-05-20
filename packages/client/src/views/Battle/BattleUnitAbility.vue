<template>
  <div
    v-if="ability"
    class="battle-unit-ability inline-block"
    :class="'battle-unit-ability--' + ability.abilityClass"
  ></div>
</template>
<script>
export default {
  props: {
    ability: Object
  },
  data() {
    return {};
  }
};
</script>
<style scoped lang="less">
.battle-unit-ability {
  width: 4rem;
  height: 4rem;
  background-image: url("/images/battle/abilities/ability-1.png");
  border-radius: 50%;
  background-size: 100%;
  background-repeat: none;
  position: relative;
}
.battle-unit-ability--combat {
  background-image: url("/images/battle/abilities/combat.png");
}
.battle-unit-ability--support_and_heal {
  background-image: url("/images/battle/abilities/support_and_heal.png");
}
.battle-unit-ability--buff {
  background-image: url("/images/battle/abilities/buff.png");
}
.battle-unit-ability--debuff {
  background-image: url("/images/battle/abilities/debuff.png");
}
</style>
