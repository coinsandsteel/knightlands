<template>
  <Promised :request="request" class="screen-content" v-if="unit">
    <template v-slot:combined="{ isPromised, isDelayOver }">
      <LoadingScreen :loading="isPromised && isDelayOver" />

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
      ></LootContainer>

      <ScrollableItemHint
        ref="scrollHint"
        :items="hintItems"
        :equippedItems="unit.items"
        @action="handleItemAction"
        :getHintButtons="getHintButtons"
      ></ScrollableItemHint>
    </template>
  </Promised>
</template>

<script>
import Loot from "@/components/Loot.vue";
import ScrollableItemHint from "@/components/Item/ScrollableItemHint.vue";
import HintHandler from "@/components/HintHandler.vue";
import LootContainer from "@/components/LootContainer.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import CustomButton from "@/components/Button.vue";
import ItemActionHandler from "@/components/Item/ItemActionHandler.vue";
import { EquipmentSlots } from "@/../../knightlands-shared/equipment_slot";

export default {
  props: ["unit"],
  mixins: [HintHandler, NetworkRequestErrorMixin, ItemActionHandler],
  components: {
    Loot,
    LootContainer,
    Promised,
    LoadingScreen,
    CustomButton,
    ScrollableItemHint
  },
  data: () => ({
    selectedSlot: -1,
    filteredItems: [],
    request: null,
    equippedHint: true
  }),
  computed: {
    equipmentSlots() {
      let slots = [];
      if (this.unit.troop) {
        slots.push(EquipmentSlots.MainHand);
        slots.push(EquipmentSlots.OffHand);
      } else {
        slots.push(EquipmentSlots.Helmet);
        slots.push(EquipmentSlots.Chest);
        slots.push(EquipmentSlots.Gloves);
        slots.push(EquipmentSlots.Cape);
        slots.push(EquipmentSlots.Boots);
      }
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
    async viewSelectedSlot() {
      const item = this.unit.items[this.selectedSlot];
      const action = await this.showHint(item);
      await this.handleItemAction(item, action);
    },
    unequipSelectedSlot() {
      this.request = this.performRequest(
        this.$game.unitUnequipItem(this.unit.id, this.selectedSlot)
      );
    },
    handleSlotSelection(slot) {
      this.equippedHint = false;
      this.selectedSlot = slot;
      this.filteredItems = this.$game.inventory.filterItemsByType(
        { [slot]: true },
        this.filteredItems
      );
    },
    async handleItemAction(item, action) {
      if (action === "equip") {
        let equip = true;
        if (item.holder != this.unit.id) {
          equip = await this.showEquipWarning(item);
        }

        if (equip) {
          this.request = this.performRequest(
            this.$game.unitEquipItem(this.unit.id, item.id)
          );
        }
      } else if (action === "unequip") {
        this.request = this.performRequest(
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
