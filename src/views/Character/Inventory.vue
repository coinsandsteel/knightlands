<template>
  <Promised class="tab-content dummy-height flex flex-column full-flex" :promise="request">
    <template v-slot:combined="{isPending, isDelayOver}">
      <loading-screen :loading="true" v-show="isDelayOver && isPending"></loading-screen>
      <AnimatedBackground></AnimatedBackground>
      <div class="tab-content dummy-height flex flex-column full-flex">
        <!-- Equipment + quick stats overview -->
        <div class="equipment-container flex flex-space-evenly">
          <div class="relative flex">
            <img class="heroImage" src="../../assets/ui/character.png" />
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

            <div class="equipment-container-row flex flex-column flex-center flex-space-between">
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
            <span
              class="font-size-20 padding-top-1 flex-self-start"
            >{{$t("character-level", {level: $game.character.level})}}</span>

            <span
              class="font-size-20 rarity-legendary padding-top-1 margin-bottom-1 flex-self-start"
            >{{$t("character-power", {power: totalPower()})}}</span>

            <div class="flex flex-no-wrap full-flex flex-space-around font-size-20">
              <div
                class="flex flex-no-wrap flex-column flex-space-evenly flex-start flex-basis-50 text-align-left"
              >
                <span v-for="stat in stats" :key="stat" class>{{$t(stat)}}</span>
              </div>

              <div
                class="flex flex-no-wrap flex-column flex-space-evenly flex-start flex-basis-50 text-align-left"
              >
                <span
                  v-for="stat in stats"
                  :key="stat"
                  class="attribute"
                  :class="{'rarity-rare': hasBonus(stat)}"
                >{{$character.getStat(stat)}}</span>
              </div>
            </div>

            <CustomButton type="grey" @click="openDetails">{{$t("btn-details")}}</CustomButton>
          </div>
        </div>

        <!-- Inventory  -->
        <LootContainer :items="filteredItems" :inventory="true" @hint="_showHint"></LootContainer>

        <!-- Loot hints -->
        <ScrollableItemHint
          ref="scrollHint"
          :items="filteredItems"
          @action="handleItemAction"
          :getHintButtons="getHintButtons"
        ></ScrollableItemHint>
      </div>

      <portal to="footer" :slim="true" v-if="isActive">
        <CustomButton type="yellow" @click="goToCraft">{{$t("btn-craft")}}</CustomButton>
        <CustomButton type="grey" @click="showItemFilter">{{$t("btn-filter")}}</CustomButton>
      </portal>
    </template>
  </Promised>
</template>

<script>
import LootContainer from "@/components/LootContainer.vue";
import { create as CreateDialog } from "vue-modal-dialogs";
import ActivityMixin from "@/components/ActivityMixin.vue";
import CustomButton from "@/components/Button.vue";
import { EquipmentSlots } from "@/../knightlands-shared/equipment_slot";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import CharacterStat from "@/../knightlands-shared/character_stat";
import ItemsReceived from "@/components/ItemsReceived.vue";
import StatDetails from "./StatDetails.vue";
import HintHandler from "@/components/HintHandler.vue";
import FilteredLootMixin from "@/components/FilteredLootMixin.vue";
import ScrollableItemHint from "@/components/ScrollableItemHint.vue";
import CompareItems from "@/components/CompareItems.vue";
import AnimatedBackground from "@/components/AnimatedBackground.vue";
const ShowItems = CreateDialog(
  ItemsReceived,
  "items",
  "soft",
  "hard",
  "exp",
  "dkt"
);
const ShowDetails = CreateDialog(StatDetails);
const ShowCompareItems = CreateDialog(CompareItems, "leftItem", "rightItem");

const CompareItemsAction = "compare";

export default {
  mixins: [ActivityMixin, HintHandler, FilteredLootMixin],
  components: {
    Loot: () => import("@/components/Loot.vue"),
    LootContainer,
    ScrollableItemHint,
    Promised,
    LoadingScreen,
    CustomButton,
    AnimatedBackground
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
    goToCraft() {
      this.$router.push({ name: "blacksmith" });
    },
    totalPower() {
      return this.$game.itemsDB.getPower(this.$game.character.maxStats);
    },
    openDetails() {
      ShowDetails();
    },
    hasBonus(stat) {
      return !!this.$game.character.buffResolver.bonusStats[stat];
    },
    getHintButtons(item) {
      if (!item) {
        return null;
      }

      let buttons = null;

      const slot = this.$game.itemsDB.getSlot(item.item.template);
      if (slot === null) {
        return null;
      }

      if (this.itemsInSlots[slot] && !item.item.equipped) {
        buttons = [
          {
            title: "btn-compare",
            response: CompareItemsAction,
            type: "grey"
          }
        ];
      }
      return buttons;
    },
    async showEquipmentHint(item) {
      if (!item) {
        return;
      }

      let action = await this.showHint(item);
      await this.handleItemAction(item, action);
    },
    async compareItems(item) {
      const slot = this.$game.itemsDB.getSlot(item.template);
      await ShowCompareItems(this.itemsInSlots[slot], item);
    },
    async handleItemAction(item, action, ...args) {
      switch (action) {
        case "equip":
          this.request = this.$game.equipItem(item.id);
          break;

        case "unequip":
          {
            const itemSlot = this.$game.itemsDB.getSlot(item.template);
            this.request = this.$game.unequipItem(itemSlot);
          }
          break;

        case "use":
          this.request = this.$game.useItem(item.id);
          break;

        case "open":
          {
            let count = args[0] || 1;
            this.request = this.$game.useItem(item.id, count);
            let items = await this.request;
            await ShowItems(items);
          }
          break;

        case CompareItemsAction:
          await this.compareItems(item);
          break;
      }
    },
    _showHint(item, index) {
      if (!item) {
        return;
      }

      this.$refs.scrollHint.showHint(index);
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
@import (reference) "./../../style/common.less";

.attribute {
  margin-left: 1rem;
}

.heroImage {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  max-width: 5rem;
}
</style>
