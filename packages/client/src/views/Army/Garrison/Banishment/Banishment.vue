<template>
  <div class="screen-content">
    <div class="screen-background"></div>
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
      <Title :stackTop="true" class="margin-bottom-half">{{
        $t("refund-items")
      }}</Title>
      <Loot
        v-for="record in refundedItems"
        :key="`${record.item}${record.quantity}`"
        :gacha="true"
        :item="record.item"
        :quantity="record.quantity"
      />
    </div>

    <Tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab" />
    <UnitInventory
      ref="units"
      :units="units"
      :autoselect="false"
      :multiSelect="true"
      :disableSelect="maxSelected"
      @toggle="toggleUnitSelect"
    />

    <portal to="footer" v-if="isActive">
      <CustomButton type="yellow" @click="banish" :disabled="!canBanish">{{
        $t("btn-banish")
      }}</CustomButton>
      <CustomButton type="green" @click="autofill">{{
        $t("btn-autofill")
      }}</CustomButton>
      <CustomButton type="grey" @click="reset" :disabled="!canBanish">{{
        $t("btn-reset")
      }}</CustomButton>
    </portal>
  </div>
</template>

<script>
import ArmyMeta from "@/army_meta";
import TroopsMeta from "@/troops_meta";
import GeneralsMeta from "@/generals_meta";

import ActivityMixin from "@/components/ActivityMixin.vue";
import Loot from "@/components/Loot.vue";
import UnitItem from "../../UnitItem.vue";
import UnitInventory from "../../UnitInventory.vue";
import Tabs from "@/components/Tabs.vue";
import CustomButton from "@/components/Button.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import Title from "@/components/Title.vue";
import PromptMixin from "@/components/PromptMixin.vue";

const Troops = "troops";
const Generals = "generals";

export default {
  mixins: [ActivityMixin, NetworkRequestErrorMixin, PromptMixin],
  components: {
    UnitItem,
    Tabs,
    UnitInventory,
    CustomButton,
    Loot,
    Title
  },
  created() {
    this.filtersStore = this.$store.getters.getUnitFilters;
  },
  activated() {
    this.reset();
  },
  data: () => ({
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
      souls: { item: ArmyMeta.soulsItem, quantity: 0 },
      gold: { item: GeneralsMeta.goldItem, quantity: 0 }
    },
    selectedUnits: []
  }),
  computed: {
    maxUnits() {
      return 10;
    },
    canBanish() {
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
  watch: {
    selectedUnits() {
      for (const key in this.refundedItems) {
        this.refundedItems[key].quantity = 0;
      }

      for (const unit of this.selectedUnits) {
        this.refundedItems.gold.quantity += Math.floor(
          unit.gold * ArmyMeta.refund.gold
        );
        this.refundedItems.souls.quantity += Math.floor(
          unit.souls * ArmyMeta.refund.souls
        );

        this.refundedItems.troopEssence.quantity += Math.floor(
          unit.essence * ArmyMeta.refund.troopEssence
        );

        this.refundedItems.souls.quantity +=
          ArmyMeta.soulsFromBanishment[this.$game.armyDB.getStars(unit) - 1];
      }
    }
  },
  methods: {
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
    async banish() {
      const confirm = await this.showPrompt(
        this.$t("pr-rsv-title"),
        this.$t("pr-dms-msg"),
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
        this.$game.banishUnits(this.selectedUnits.map(x => x.id))
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
      let i = this.units.length - 1;
      for (; i >= 0; i--) {
        if (this.maxSelected) {
          break;
        }

        const unit = this.units[i];
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
