<template>
  <Promised
    class="screen-content"
    :promise="request"
  >
    <template v-slot:combined="{ isPending, isDelayOver }">
      <loading-screen :loading="isDelayOver && isPending"></loading-screen>
      <AnimatedBackground></AnimatedBackground>
      <Flipper :flipKey="slotPreview" class="full-flex dummy-height width-100">
        <div
          class="width-100 height-100 dummy-height flex flex-column"
        >
          <div class="width-100 equipment" :class="{ preview: slotPreview }">
            <EquipmentPreview
              key="preview"
              class="equipment-preview"
              :itemSlot="selectedSlot"
              v-show="slotPreview"
              @close="slotPreview = false"
            ></EquipmentPreview>

            <!-- Equipment + quick stats overview -->
            <div
              key="slots"
              class="equipment-container flex flex-space-evenly flex-no-wrap"
              v-show="!slotPreview"
            >
              <div class="equipment-slots relative flex">
                <img class="heroImage" src="/images/portraits/test.png" />
                <loot
                  v-for="slot in equipment()"
                  :key="slot"
                  :class="slot"
                  :item="itemsInSlots[slot]"
                  :equipment="true"
                  :equipmentSlot="slot"
                  @hint="showEquipmentHint(slot)"
                ></loot>
              </div>

              <div class="flex flex-column">
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
          </div>

          <Flipped
            flipId="inventory"
            inverse-flip-id="equipment"
            :translate="true"
          >
            <Inventory
              class="full-flex width-100"
              commitCmd="setEquipmentFilters"
              :hideBg="true"
              :filters="forceFilters"
              :filtersStore="$store.getters.getEquipmentFilters"
            ></Inventory>
          </Flipped>
        </div>
      </Flipper>
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
import EquipmentPreview from "./EquipmentPreview.vue";
import { Flipper, Flipped } from "vue-flip-toolkit";

const ShowDetails = CreateDialog(StatDetails);

export default {
  mixins: [ActivityMixin, HintHandler, ItemActionHandler],
  components: {
    Loot,
    Promised,
    LoadingScreen,
    CustomButton,
    AnimatedBackground,
    Inventory,
    EquipmentPreview,
    Flipper,
    Flipped
  },
  data() {
    return {
      slots: {},
      itemsInSlots: this.$character.equipment,
      request: null,
      showDetails: false,
      slotPreview: false,
      selectedSlot: ""
    };
  },
  computed: {
    forceFilters() {
      if (!this.slotPreview) {
        return null;
      }

      return { [this.selectedSlot]: true };
    },
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
    async showEquipmentHint(slot) {
      this.slotPreview = true;
      this.selectedSlot = slot;
      // if (!item) {
      //   return;
      // }

      // let action = await this.showHint(item);
      // await this.handleItemAction(item, action);
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

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

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
