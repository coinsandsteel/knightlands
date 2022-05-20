<template>
  <div
    v-if="ability"
    class="battle-unit-ability inline-block"
    :class="'battle-unit-ability--' + ability.abilityGroup"
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
.battle-unit-ability--attack {
  background-image: url("/images/battle/abilities/attack.png");
}
.battle-unit-ability--support {
  background-image: url("/images/battle/abilities/support.png");
}
.battle-unit-ability--jump {
  background-image: url("/images/battle/abilities/jump.png");
}
.battle-unit-ability--buff {
  background-image: url("/images/battle/abilities/buff.png");
}
.battle-unit-ability--self_buff {
  background-image: url("/images/battle/abilities/self_buff.png");
}
.battle-unit-ability--de_buff {
  background-image: url("/images/battle/abilities/de_buff.png");
}
</style>
