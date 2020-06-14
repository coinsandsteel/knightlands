<template>
  <Promised class="screen-content" :promise="request">
    <template v-slot:combined="{isPending, isDelayOver}">
      <div class="screen-background"></div>
      <LoadingScreen :loading="isPending && isDelayOver" />
      <div class="flex">
        <UnitItem
          class="width-20"
          v-for="i in maxUnits"
          :key="i"
          :unit="getSelectedUnit(i)"
          :empty="true"
        />
      </div>

      <div class="color-panel-2 flex flex-space-evenly">
        <Title class="margin-bottom-half">{{$t("refund-items")}}</Title>
        <Loot
          v-for="record in refundedItems"
          :key="`${record.item}${record.quantity}`"
          :gacha="true"
          :item="record.item"
          :quantity="record.quantity"
        />
      </div>

      <Tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab" />
      <UnitInventory ref="units" :units="filteredUnits" :multiSelect="!maxSelected" @toggle="toggleUnitSelect" />

      <portal to="footer" v-if="isActive">
        <CustomButton type="yellow" @click="banish" :disabled="!canBanish">{{$t("btn-banish")}}</CustomButton>
        <CustomButton type="green" @click="autofill">{{$t("btn-autofill")}}</CustomButton>
        <CustomButton type="grey" @click="showUnitFilters">{{$t("btn-filter")}}</CustomButton>
      </portal>
    </template>
  </Promised>
</template>

<script>
import ArmyMeta from "@/army_meta";
import TroopsMeta from "@/troops_meta";
import GeneralsMeta from "@/generals_meta";

import AppSection from "@/AppSection.vue";
import Loot from "@/components/Loot.vue";
import UnitItem from "../UnitItem.vue";
import UnitInventory from "../UnitInventory.vue";
import Tabs from "@/components/Tabs.vue";
import CustomButton from "@/components/Button.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import Title from "@/components/Title.vue";

import DoubleBuffer from "@/helpers/DoubleBuffer";
import ItemFilterComponent from "@/components/ItemFilter.vue";
import { create as CreateDialog } from "vue-modal-dialogs";

const ItemFilter = CreateDialog(ItemFilterComponent);

const Troops = "troops";
const Generals = "generals";

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  components: {
    UnitItem,
    Tabs,
    UnitInventory,
    CustomButton,
    LoadingScreen,
    Promised,
    Loot,
    Title
  },
  created() {
    this.title = "window-banishment";
    this.$options.useRouterBack = true;
    this.filteredUnitsBuffer = new DoubleBuffer();
    this.filtersStore = this.$store.getters.getUnitFilters;
  },
  data: () => ({
    maxUnits: 10,
    request: null,
    tabs: [
      { title: Troops, value: Troops },
      {
        title: Generals,
        value: Generals
      }
    ],
    currentTab: Troops,
    filteredUnits: [],
    refundedItems: {
      troopEssence: { item: TroopsMeta.essenceItem, quantity: 0 },
      generalEssence: { item: GeneralsMeta.essenceItem, quantity: 0 },
      souls: { item: ArmyMeta.soulsItem, quantity: 0 },
      gold: { item: GeneralsMeta.goldItem, quantity: 0 }
    },
    selectedUnits: []
  }),
  mounted() {
    this.filterUnits();
  },
  computed: {
    canBanish() {
      return this.selectedUnits.length > 0;
    },
    maxSelected() {
      return this.maxUnits == this.selectedUnits.length;
    }
  },
  methods: {
    getSelectedUnit(idx) {
      if (this.selectedUnits.length > idx - 1) {
        return this.selectedUnits[idx - 1];
      }
      return null;
    },
    async showUnitFilters() {
      const filters = await ItemFilter({
        stateFilters: this.filtersStore,
        commitCmd: "setUnitFilters",
        filterLocalisation: "unit-s-filter"
      });

      if (filters) {
        this.filterUnits();
      }
    },
    switchTab(newTab) {
      this.currentTab = newTab;
      this.filterUnits();
    },
    filterUnits() {
      this.filteredUnits = this.$game.army.filterUnits(
        this.currentTab == Troops,
        this.filtersStore,
        this.filteredUnitsBuffer.get()
      );
    },
    toggleUnitSelect(unit, isSelected) {
      let sign = 1;
      if (isSelected) {
        this.selectedUnits.push(unit);
      } else {
        const idx = this.selectedUnits.findIndex(x => x.id === unit.id);
        this.selectedUnits.splice(idx, 1);
        sign = -1;
      }

      this.refundedItems.gold.quantity += Math.floor(
        sign * unit.gold * ArmyMeta.refund.gold
      );
      this.refundedItems.souls.quantity += Math.floor(
        sign * unit.souls * ArmyMeta.refund.souls
      );
      if (unit.troop) {
        this.refundedItems.troopEssence.quantity += Math.floor(
          sign * unit.essence * ArmyMeta.refund.troopEssence
        );
      } else {
        this.refundedItems.generalEssence.quantity += Math.floor(
          sign * unit.essence * ArmyMeta.refund.generalEssence
        );
      }

      this.refundedItems.souls.quantity +=
        sign * ArmyMeta.soulsFromBanishment[this.$game.armyDB.getStars(unit)];
    },
    async banish() {
      this.request = this.performRequest(
        this.$game.banishUnits(this.selectedUnits.map(x => x.id))
      );
      try {
        await this.request;
      } finally {
        this.$nextTick(() => {
          this.filterUnits();
        });
        this.$refs.units.resetSelection();
        this.selectedUnits = [];
        for (const i in this.refundedItems) {
            this.refundedItems[i].quantity = 0;
        }
      }
    },
    autofill() {
      let i = this.filteredUnits.length - 1;
      for (; i >= 0; i--) {
        if (this.maxSelected) {
          break;
        }
        const unit = this.filteredUnits[i];
        const idx = this.selectedUnits.findIndex(x => x.id === unit.id);
        if (idx != -1) {
            continue;
        }
        this.$refs.units.toggleSlot(unit);
      }
    }
  }
};
</script>
