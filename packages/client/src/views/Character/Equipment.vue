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
        <div class="equipment-container flex flex-space-evenly flex-no-wrap">
          <div class="equipment-slots relative flex">
            <img class="heroImage" src="/images/portraits/test.png" />
            <loot
              v-for="slot in equipment()"
              :key="slot"
              :class="slot"
              :item="itemsInSlots[slot]"
              :equipment="true"
              :equipmentSlot="slot"
              @hint="showEquipmentHint"
            ></loot>
          </div>

          <div class="flex flex-column height-100">
            <span
              class="font-size-20 font-outline padding-top-1 flex-self-start"
              >{{
                $t("character-level", { level: $game.character.level })
              }}</span
            >

            <span
              class="font-size-20 font-outline rarity-legendary padding-top-1 margin-bottom-1 font-weight-900 flex-self-start"
              >{{ $t("character-power", { power: totalPower() }) }}</span
            >

            <div
              class="flex flex-no-wrap font-outline full-flex flex-space-around font-size-20"
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

        <Inventory
          class="full-flex"
          commitCmd="setEquipmentFilters"
          :filtersStore="$store.getters.getEquipmentFilters"
        ></Inventory>
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
import StatDetails from "./StatDetails.vue";
import HintHandler from "@/components/HintHandler.vue";
import AnimatedBackground from "@/components/AnimatedBackground.vue";
import Loot from "@/components/Loot.vue";
import ItemActionHandler from "./ItemActionHandler.vue";
import Inventory from "./Inventory.vue";

const ShowDetails = CreateDialog(StatDetails);

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
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "./../../style/common.less";

.attribute {
  margin-left: 1rem;
}

.heroImage {
  max-width: 8rem;
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
</style>
