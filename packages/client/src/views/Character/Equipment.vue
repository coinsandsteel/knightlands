<template>
  <Promised
    class="tab-content dummy-height flex flex-column full-flex"
    :promise="request"
  >
    <template v-slot:combined="{ isPending, isDelayOver }">
      <loading-screen :loading="isDelayOver && isPending"></loading-screen>
      <AnimatedBackground></AnimatedBackground>
      <div
        class="tab-content dummy-height flex flex-column flex-no-wrap full-flex"
      >
        <!-- Equipment + quick stats overview -->
        <div class="equipment-container flex flex-space-evenly">
          <div class="relative flex">
            <img class="heroImage" src="/images/portraits/test.png" />
            <div class="equipment-container-row flex flex-column flex-center">
              <loot
                v-for="slot in equipmentRow1()"
                :key="slot"
                class="equipment-slot"
                :item="itemsInSlots[slot]"
                :equipment="true"
                :equipmentSlot="slot"
                @hint="showEquipmentHint"
              ></loot>
            </div>

            <div
              class="equipment-container-row flex flex-column flex-center flex-space-between"
            >
              <loot
                v-for="slot in equipmentRow2()"
                :key="slot"
                class="equipment-slot"
                :item="itemsInSlots[slot]"
                :equipment="true"
                :equipmentSlot="slot"
                @hint="showEquipmentHint"
              ></loot>
            </div>

            <div class="equipment-container-row flex flex-column flex-center">
              <loot
                v-for="slot in equipmentRow3()"
                :key="slot"
                class="equipment-slot"
                :item="itemsInSlots[slot]"
                :equipment="true"
                :equipmentSlot="slot"
                @hint="showEquipmentHint"
              ></loot>
            </div>
          </div>

          <div class="flex flex-column height-100">
            <span class="font-size-20 padding-top-1 flex-self-start">{{
              $t("character-level", { level: $game.character.level })
            }}</span>

            <span
              class="font-size-20 rarity-legendary padding-top-1 margin-bottom-1 flex-self-start"
              >{{ $t("character-power", { power: totalPower() }) }}</span
            >

            <div
              class="flex flex-no-wrap full-flex flex-space-around font-size-20"
            >
              <div
                class="flex flex-no-wrap flex-column flex-space-evenly flex-start flex-basis-50 text-align-left"
              >
                <span v-for="stat in stats" :key="stat" class>{{
                  $t(stat)
                }}</span>
              </div>

              <div
                class="flex flex-no-wrap flex-column flex-space-evenly flex-start flex-basis-50 text-align-left"
              >
                <span
                  v-for="stat in stats"
                  :key="stat"
                  class="attribute"
                  :class="{ 'rarity-rare': hasBonus(stat) }"
                  >{{ $character.getStat(stat) }}</span
                >
              </div>
            </div>

            <CustomButton type="grey" @click="openDetails">{{
              $t("btn-details")
            }}</CustomButton>
          </div>
        </div>

        <Inventory class="full-flex"></Inventory>
      </div>
    </template>
  </Promised>
</template>

<script>
import { create as CreateDialog } from "vue-modal-dialogs";
import ActivityMixin from "@/components/ActivityMixin.vue";
import CustomButton from "@/components/Button.vue";
import { EquipmentSlots } from "@/../../knightlands-shared/equipment_slot";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import CharacterStat from "@/../../knightlands-shared/character_stat";
import StatDetails from "./../StatDetails.vue";
import HintHandler from "@/components/HintHandler.vue";
import AnimatedBackground from "@/components/AnimatedBackground.vue";
import Loot from "@/components/Loot.vue";
import ItemActionHandler from "../ItemActionHandler.vue";

const ShowDetails = CreateDialog(StatDetails);

import Inventory from "../Inventory.vue";

export default {
  mixins: [ActivityMixin, HintHandler, ItemActionHandler],
  components: {
    Loot,
    Promised,
    LoadingScreen,
    CustomButton,
    AnimatedBackground,
    Inventory
  },
  data() {
    return {
      slots: {},
      itemsInSlots: this.$character.equipment,
      showHintItems: false,
      request: null,
      showDetails: false
    };
  },
  computed: {
    stats() {
      let stats = [];
      stats.push(CharacterStat.Health);
      stats.push(CharacterStat.Attack);
      stats.push(CharacterStat.Defense);

      stats.push(CharacterStat.Energy);
      stats.push(CharacterStat.Stamina);

      return stats;
    }
  },
  methods: {
    totalPower() {
      return this.$game.itemsDB.getPower(this.$game.character.maxStats);
    },
    openDetails() {
      ShowDetails();
    },
    hasBonus(stat) {
      return !!this.$game.character.buffResolver.bonusStats[stat];
    },
    async showEquipmentHint(item) {
      if (!item) {
        return;
      }

      let action = await this.showHint(item);
      await this.handleItemAction(item, action);
    },
    equipmentRow1() {
      return [
        EquipmentSlots.Necklace,
        EquipmentSlots.Ring,
        EquipmentSlots.Pet,
        EquipmentSlots.MainHand
      ];
    },
    equipmentRow2() {
      return [EquipmentSlots.Helmet, EquipmentSlots.OffHand];
    },
    equipmentRow3() {
      return [
        EquipmentSlots.Chest,
        EquipmentSlots.Cape,
        EquipmentSlots.Gloves,
        EquipmentSlots.Boots
      ];
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "./../../../style/common.less";

.attribute {
  margin-left: 1rem;
}

.heroImage {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  max-width: 8rem;
}
</style>
