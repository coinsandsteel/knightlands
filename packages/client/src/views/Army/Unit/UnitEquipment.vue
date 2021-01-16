<template>
  <div class="screen-content">
    <div class="color-panel-2 flex flex-column flex-center">
      <div class="flex flex-center">
        <loot
          v-for="slot in equipmentSlots"
          :key="slot"
          class="margin-half"
          :selected="selectedSlot == slot"
          :equipment="true"
          :equipmentSlot="slot"
          :item="unit.items[slot]"
          @hint="handleSlotSelection(slot)"
        ></loot>
      </div>

      <CustomButton
        class="margin-top-1"
        type="grey"
        @click="viewSelectedSlot"
        :disabled="!unit.items[selectedSlot]"
        >{{ $t("btn-view") }}</CustomButton
      >
    </div>

    <LootContainer
      :items="filteredItems"
      :inventory="true"
      @hint="_handleHint"
      :hideFilters="true"
    ></LootContainer>

    <ScrollableItemHint
      ref="scrollHint"
      :items="hintItems"
      :equippedItems="unit.items"
      @action="handleEquipmentAction"
      :getHintButtons="getHintButtons"
    ></ScrollableItemHint>

    <portal to="footer" v-if="isActive">
      <CustomButton @click="autoEquip" type="grey">{{
        $t("eq-all")
      }}</CustomButton>
    </portal>
  </div>
</template>

<script>
import ActivityMixin from "@/components/ActivityMixin.vue";
import Loot from "@/components/Loot.vue";
import ScrollableItemHint from "@/components/Item/ScrollableItemHint.vue";
import HintHandler from "@/components/HintHandler.vue";
import LootContainer from "@/components/LootContainer.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import CustomButton from "@/components/Button.vue";
import ItemActionHandler from "@/components/Item/ItemActionHandler.vue";
import { EquipmentSlots } from "@/../../knightlands-shared/equipment_slot";
const ItemActions = require("@/../../knightlands-shared/item_actions");

export default {
  props: ["unit"],
  mixins: [
    HintHandler,
    ActivityMixin,
    NetworkRequestErrorMixin,
    ItemActionHandler
  ],
  components: {
    Loot,
    LootContainer,
    CustomButton,
    ScrollableItemHint
  },
  data: () => ({
    selectedSlot: -1,
    filteredItems: [],
    equippedHint: true
  }),
  computed: {
    equipmentSlots() {
      let slots = [];
      slots.push(EquipmentSlots.MainHand);
      slots.push(EquipmentSlots.OffHand);
      slots.push(EquipmentSlots.Helmet);
      slots.push(EquipmentSlots.Chest);
      slots.push(EquipmentSlots.Gloves);
      slots.push(EquipmentSlots.Cape);
      slots.push(EquipmentSlots.Boots);
      return slots;
    },
    items() {
      return this.$game.inventory.items;
    },
    hintItems() {
      if (this.equippedHint) {
        let items = [];
        for (let i in this.unit.items) {
          items.push(this.unit.items[i]);
        }
        return items;
      }

      return this.filteredItems;
    }
  },
  watch: {
    items() {
      this.handleSlotSelection(this.selectedSlot);
    }
  },
  methods: {
    async autoEquip() {
      const itemsToEquip = [];
      for (const slotId of this.equipmentSlots) {
        const items = this.$game.inventory.filterItemsByType({
          filters: { [slotId]: true }
        });

        // pick the best item
        if (items.length == 0) {
          continue;
        }

        for (const item of items) {
          if (item.equipped) {
            continue;
          }
          itemsToEquip.push(item.id);
        }
      }

      await this.performRequest(
        this.$game.unitEquipItem(this.unit.id, itemsToEquip)
      );
    },
    async viewSelectedSlot() {
      const item = this.unit.items[this.selectedSlot];
      const action = await this.showHint(item, [], {
        showButtons: true,
        equippedItems: this.unit.items,
        actions: { equip: true }
      });
      await this.handleEquipmentAction(item, action);
    },
    unequipSelectedSlot() {
      this.performRequest(
        this.$game.unitUnequipItem(this.unit.id, this.selectedSlot)
      );
    },
    handleSlotSelection(slot) {
      this.equippedHint = false;
      this.selectedSlot = slot;
      this.filteredItems = this.$game.inventory.filterItemsByType({
        filters: { [slot]: true }
      });
    },
    async handleEquipmentAction(item, action) {
      if (action === ItemActions.Equip) {
        let equip = true;
        if (item.equipped && item.holder != this.unit.id) {
          equip = await this.showEquipWarning(item);
        }

        if (equip) {
          this.performRequest(
            this.$game.unitEquipItem(this.unit.id, [item.id])
          );
        }
      } else if (action === ItemActions.Unequip) {
        this.performRequest(
          this.$game.unitUnequipItem(
            this.unit.id,
            this.$game.itemsDB.getSlot(item.template)
          )
        );
      }
    },
    getHintButtons(item) {
      let buttons;
      if (
        !this.equippedHint &&
        this.unit.items[this.selectedSlot] &&
        !item.equipped
      ) {
        buttons = [
          {
            title: "btn-compare",
            response: "compare",
            type: "grey"
          }
        ];
      }
      return buttons;
    },
    async _handleHint(item, index) {
      if (!item) {
        return;
      }

      this.$refs.scrollHint.showHint(index);
    }
  }
};
</script>
