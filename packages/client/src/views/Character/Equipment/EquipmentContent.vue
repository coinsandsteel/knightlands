<template>
  <div
    key="slots"
    class="equipment-container flex flex-space-evenly flex-no-wrap font-weight-900"
  >
    <div class="equipment-slots relative flex">
      <Avatar :avatar="avatar"></Avatar>
      <loot
        v-for="slot in equipment"
        :key="slot"
        :class="slot"
        :item="itemsInSlots[slot]"
        :equipment="true"
        :equipmentSlot="slot"
        :showLevel="true"
        :id="slot"
        @hint="$emit('hint', slot)"
      ></loot>
    </div>

    <div class="flex flex-column padding-top-1">
      <div class="flex flex-items-center flex-self-start margin-bottom-half">
        <span :class="classIcon" @click="$emit('changeClass')"></span>
        <span class="font-size-22 font-weight-900 font-shadow">{{
          nickname
        }}</span>
        <span
          class="icon-edit"
          v-if="nickname == $game.character.nickname"
          @click="$emit('changeName')"
        ></span>
      </div>

      <span
        class="font-size-20 font-shadow flex-self-start margin-bottom-half"
        >{{ $t("character-level", { level: level }) }}</span
      >
      <IconWithValue iconClass="icon-exp" valueClass="font-size-15">
        {{ $t("char-exp", { c: currentExp, n: nextExp }) }}
      </IconWithValue>

      <!-- <span
        class="font-size-20 font-shadow rarity-legendary margin-top-1 font-weight-900 flex-self-start"
        >{{ $t("character-power", { power: totalPower() }) }}</span
      > -->

      <IconWithValue
        @click="$emit('details')"
        class="margin-top-1"
        iconClass="icon-info"
        valueClass="font-size-20 font-shadow rarity-legendary font-weight-900"
      >
        {{ $t("character-power", { power: totalPower() }) }}
      </IconWithValue>

      <div
        class="flex flex-no-wrap font-shadow full-flex flex-space-around font-size-20"
      >
        <div
          class="flex flex-no-wrap flex-column flex-space-evenly flex-start flex-basis-50 text-align-left"
        >
          <span v-for="stat in statsToShow" :key="stat">{{ $t(stat) }}</span>
        </div>

        <div
          class="flex flex-no-wrap flex-column flex-space-evenly flex-start flex-basis-50 text-align-left"
        >
          <span
            v-for="stat in statsToShow"
            :key="stat"
            class="attribute"
            :class="{ 'rarity-rare': hasBonus[stat] }"
            >{{ stats[stat] }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EquipmentSlots } from "@/../../knightlands-shared/equipment_slot";
import CharacterStat from "@/../../knightlands-shared/character_stat";
import Loot from "@/components/Loot.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import Avatar from "../Avatars/Avatar.vue";

export default {
  props: [
    "itemsInSlots",
    "level",
    "stats",
    "hasBonus",
    "nickname",
    "classIcon",
    "avatar"
  ],
  components: { Loot, IconWithValue, Avatar },
  computed: {
    currentExp() {
      return this.$game.character.exp;
    },
    nextExp() {
      return this.$game.getRequiredExperience(this.$game.character.level);
    },
    equipment() {
      return [
        EquipmentSlots.Necklace,
        EquipmentSlots.Ring,
        EquipmentSlots.Pet,
        EquipmentSlots.MainHand,
        EquipmentSlots.Helmet,
        EquipmentSlots.OffHand,
        EquipmentSlots.Chest,
        EquipmentSlots.Cape,
        EquipmentSlots.Gloves,
        EquipmentSlots.Boots
      ];
    },
    statsToShow() {
      let stats = [];
      stats.push(CharacterStat.Health);
      stats.push(CharacterStat.Attack);
      stats.push(CharacterStat.Defense);

      return stats;
    }
  },
  methods: {
    totalPower() {
      return this.$game.itemsDB.getPower(this.stats);
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "./../../../style/common.less";

.attribute {
  margin-left: 1rem;
}

.equipment-slots {
  display: grid;
  place-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;

  & .heroImage {
    grid-row: ~"2/4";
    grid-column: 2;
  }

  & .mainHand {
    grid-row: 4;
    grid-column: 1;
  }
  & .offHand {
    grid-row: 4;
    grid-column: 2;
  }
  & .ring {
    grid-row: 4;
    grid-column: 3;
  }
  & .necklace {
    grid-row: 3;
    grid-column: 3;
  }
  & .helmet {
    grid-row: 1;
    grid-column: 1;
  }
  & .boots {
    grid-row: 2;
    grid-column: 3;
  }
  & .chest {
    grid-row: 2;
    grid-column: 1;
  }
  & .cape {
    grid-row: 1;
    grid-column: 3;
  }
}

@iconSize: 3rem;

.classIcon(@class) {
  background-image: url("../../../assets/ui/@{class}.png");
  background-size: contain;
  background-repeat: no-repeat;
  width: @iconSize;
  height: @iconSize;
}

.barbarian {
  .classIcon("class1");
}

.archer {
  .classIcon("class2");
}

.mage {
  .classIcon("class3");
}
</style>
