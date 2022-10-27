<template>
  <Promised class="screen-content" :promise="request">
    <template v-slot:combined="{ isPending, isDelayOver }">
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

      <!-- <div class="color-panel-2 flex flex-space-evenly">
        <Title class="margin-bottom-half">{{$t("refund-items")}}</Title>
        <Loot 
          v-for="record in refundedItems"
          :key="`${record.item}${record.quantity}`"
          :gacha="true"
          :item="record.item"
          :quantity="record.quantity"
        />
      </div> -->

      <Tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab" />
      <UnitInventory
        ref="units"
        :units="units"
        :multiSelect="true"
        :autoselect="false"
        :disableSelect="maxSelected"
        @toggle="toggleUnitSelect"
      />

      <portal to="footer" v-if="isActive">
        <CustomButton type="yellow" @click="reserve" :disabled="!canReserve">{{
          $t("btn-confirm")
        }}</CustomButton>
        <CustomButton type="grey" @click="viewReserve">{{
          $t("btn-view-res")
        }}</CustomButton>
        <CustomButton type="grey" @click="reset" :disabled="!canReserve">{{
          $t("btn-reset")
        }}</CustomButton>
      </portal>
    </template>
  </Promised>
</template>

<script>
import ArmyMeta from "@/metadata/army_meta";
import TroopsMeta from "@/metadata/troops_meta";
import GeneralsMeta from "@/metadata/generals_meta";

import ActivityMixin from "@/components/ActivityMixin.vue";
import UnitItem from "../../UnitItem.vue";
import UnitInventory from "../../UnitInventory.vue";
import Tabs from "@/components/Tabs.vue";
import CustomButton from "@/components/Button.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import PromptMixin from "@/components/PromptMixin.vue";

const Troops = "troops";
const Generals = "generals";

export default {
  mixins: [NetworkRequestErrorMixin, ActivityMixin, PromptMixin],
  components: {
    UnitItem,
    Tabs,
    UnitInventory,
    CustomButton,
    LoadingScreen,
    Promised
  },
  created() {
    this.filtersStore = this.$store.getters.getUnitFilters;
  },
  activated() {
    this.reset();
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
    refundedItems: {
      troopEssence: { item: TroopsMeta.essenceItem, quantity: 0 },
      generalEssence: { item: GeneralsMeta.essenceItem, quantity: 0 },
      souls: { item: ArmyMeta.soulsItem, quantity: 0 },
      gold: { item: GeneralsMeta.goldItem, quantity: 0 }
    },
    selectedUnits: []
  }),
  computed: {
    canReserve() {
      return this.selectedUnits.length > 0;
    },
    maxSelected() {
      return this.maxUnits == this.selectedUnits.length;
    },
    units() {
      return this.$game.army.getUnitsWithFilter(
        this.currentTab == Troops,
        unit => unit.legion == -1
      );
    }
  },
  methods: {
    viewReserve() {
      this.$router.push({
        name: "units-reserve-view"
      });
    },
    getSelectedUnit(idx) {
      if (this.selectedUnits.length > idx - 1) {
        return this.selectedUnits[idx - 1];
      }
      return null;
    },
    switchTab(newTab) {
      this.currentTab = newTab;
    },
    toggleUnitSelect(unit, isSelected) {
      if (isSelected) {
        this.selectedUnits.push(unit);
      } else {
        const idx = this.selectedUnits.findIndex(x => x.id === unit.id);
        this.selectedUnits.splice(idx, 1);
      }
    },
    async reserve() {
      const confirm = await this.showPrompt(
        this.$t("pr-rsv-title"),
        this.$t("pr-rsv-msg"),
        [
          {
            type: "grey",
            title: this.$t("btn-ok"),
            response: true
          },
          {
            type: "red",
            title: this.$t("btn-cancel"),
            response: false
          }
        ]
      );

      if (!confirm) {
        return;
      }

      this.request = this.performRequest(
        this.$game.reserveUnits(this.selectedUnits.map(x => x.id))
      );
      try {
        await this.request;
      } finally {
        this.reset();
      }
    },
    reset() {
      this.$refs.units.resetSelection();
      this.selectedUnits = [];
      for (const i in this.refundedItems) {
        this.refundedItems[i].quantity = 0;
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
