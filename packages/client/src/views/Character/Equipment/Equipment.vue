<template>
  <Promised class="screen-content" :promise="request">
    <template v-slot:combined="{ isPending, isDelayOver }">
      <loading-screen :loading="isDelayOver && isPending"></loading-screen>
      <AnimatedBackground></AnimatedBackground>
      <Flipper :flipKey="slotPreview" class="full-flex dummy-height width-100">
        <div
          class="width-100 height-100 dummy-height flex flex-column flex-no-wrap font-weight-900"
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
            <EquipmentContent
              v-show="!slotPreview"
              :hasBonus="bonuses"
              :level="$game.character.level"
              :stats="$game.character.maxStats"
              :itemsInSlots="itemsInSlots"
              :nickname="$game.character.nickname"
              :classIcon="$game.character.class"
              @hint="showEquipmentHint"
              @details="openDetails"
              @changeName="changeName"
              @changeClass="changeClass"
            ></EquipmentContent>
          </div>

          <Flipped
            flipId="inventory"
            inverse-flip-id="equipment"
            :translate="true"
          >
            <Inventory
              class="full-flex width-100 height-100 margin-top-1"
              commitCmd="setEquipmentFilters"
              :hideBg="true"
              :filters="forceFilters"
              :filtersStore="$store.getters.getEquipmentFilters"
            ></Inventory>
          </Flipped>
        </div>
      </Flipper>

      <dialogs-wrapper name="equipment" />
    </template>
  </Promised>
</template>

<script>
import { create as CreateDialog } from "vue-modal-dialogs";
import ActivityMixin from "@/components/ActivityMixin.vue";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import CharacterStat from "@/../../knightlands-shared/character_stat";
import StatDetails from "./StatDetails.vue";
import HintHandler from "@/components/HintHandler.vue";
import AnimatedBackground from "@/components/AnimatedBackground.vue";
import ItemActionHandler from "@/components/Item/ItemActionHandler.vue";
import Inventory from "./../Inventory.vue";
import EquipmentPreview from "./EquipmentPreview.vue";
import EquipmentContent from "./EquipmentContent.vue";
import { Flipper, Flipped } from "vue-flip-toolkit";

import ChangeNickname from "@/views/Character/ChangeNickname.vue";
const ShowChangeNickname = CreateDialog({
  component: ChangeNickname,
  wrapper: "equipment"
});
const ShowDetails = CreateDialog(StatDetails);

import SelectClass from "@/views/SelectClass/SelectClass.vue";
const ShowSelectClass = CreateDialog(SelectClass);

export default {
  mixins: [ActivityMixin, HintHandler, ItemActionHandler],
  components: {
    Promised,
    LoadingScreen,
    AnimatedBackground,
    Inventory,
    EquipmentPreview,
    EquipmentContent,
    Flipper,
    Flipped
  },
  data() {
    return {
      slots: {},
      request: null,
      showDetails: false,
      slotPreview: false,
      selectedSlot: ""
    };
  },
  computed: {
    itemsInSlots() {
      let items = {};
      for (const slotId in this.$character.equipment) {
        items[slotId] = this.$game.inventory.getItem(
          this.$character.equipment[slotId].id
        );
      }
      return items;
    },
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
    },
    bonuses() {
      const bonuses = {};
      for (const stat of this.stats) {
        bonuses[stat] = this.hasBonus(stat);
      }
      return bonuses;
    }
  },
  methods: {
    changeName() {
      ShowChangeNickname();
    },
    totalPower() {
      return this.$game.itemsDB.getPower(this.$game.character.maxStats);
    },
    openDetails() {
      ShowDetails();
    },
    hasBonus(stat) {
      return !!this.$game.character.buffResolver.bonuses[stat];
    },
    async changeClass() {
      ShowSelectClass();
    },
    async showEquipmentHint(slot) {
      this.slotPreview = true;
      this.selectedSlot = slot;
    }
  }
};
</script>
