<template>
  <Promised class="tab-content dummy-height flex flex-column full-flex" :promise="request">
    <template v-slot:combined="{isPending, isDelayOver}">
      <loading-screen :loading="true" v-show="isDelayOver && isPending"></loading-screen>

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
        <div class="flex full-flex dummy-height">
          <div v-bar class="width-100 height-100 dummy-height">
            <loot-container :items="filteredItems" :inventory="true" @hint="_showHint"></loot-container>
          </div>
        </div>

        <!-- Loot hints -->
        <div v-show="showHintItems">
          <transition>
            <div
              class="items-bg-mask relative flex flex-center"
              @click.self="showHintItems = false"
            >
              <Hooper
                ref="hooper"
                style="height: 100%"
                :infiniteScroll="true"
                :autoPlay="false"
                @slide="updateHintItems"
              >
                <slide v-for="(item, index) in hintItems" :key="index">
                  <LootHint
                    :item="item.item"
                    :equip="!item.equipped"
                    :unequip="item.equipped"
                    :hideMask="true"
                    :showButtons="true"
                    :buttons="getHintButtons(item)"
                    @close="handleItemAction"
                  ></LootHint>
                </slide>
              </Hooper>

              <div class="flex flex-center flex-space-between absolute-stretch pointer-events-none">
                <div class="nav-arrow left"></div>
                <div class="nav-arrow"></div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </template>
  </Promised>
</template>

<script>
import { Hooper, Slide } from "hooper";
import "hooper/dist/hooper.css";

import ItemFilterComponent from "@/components/ItemFilter.vue";
import LootContainer from "@/components/LootContainer.vue";
import { create as CreateDialog } from "vue-modal-dialogs";
import AppSection from "@/AppSection";
import CustomButton from "@/components/Button.vue";
import {
  EquipmentSlots,
  getSlot
} from "@/../knightlands-shared/equipment_slot";
import ItemType from "@/../knightlands-shared/item_type";
import EquipmentType from "@/../knightlands-shared/equipment_type";
import CharacterStats from "@/../knightlands-shared/character_stat.js";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import CharacterStat from "@/../knightlands-shared/character_stat";
import ItemsReceived from "@/components/ItemsReceived.vue";
import StatDetails from "./StatDetails.vue";
import HintHandler from "@/components/HintHandler.vue";
const ItemActions = require("@/../knightlands-shared/item_actions");
import LootHint from "@/components/LootHint.vue";
import CompareItems from "@/components/CompareItems.vue";

const ItemFilter = CreateDialog(ItemFilterComponent);
const ShowItems = CreateDialog(ItemsReceived, "items", "soft", "hard", "exp", "dkt");
const ShowDetails = CreateDialog(StatDetails);
const ShowCompareItems = CreateDialog(CompareItems, "leftItem", "rightItem");

const CompareItemsAction = "compare";

export default {
  mixins: [AppSection, HintHandler],
  components: {
    Loot: () => import("@/components/Loot.vue"),
    LootContainer,
    LootHint,
    Hooper,
    Slide,
    ItemInfo: () => import("@/components/ItemInfo.vue"),
    Promised,
    LoadingScreen,
    CustomButton
  },
  props: {
    items: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      filteredItems: [],
      slots: {},
      itemsInSlots: this.$character.equipment,
      hintItems: [],
      showHintItems: false,
      currentSlideIndex: 0,
      request: null,
      showDetails: false
    };
  },
  watch: {
    items() {
      this.updateItems();
    }
  },
  created() {
    this.filteredItemsBuffers = [[], []];
    this.bufferIndex = 0;
  },
  mounted() {
    this.updateItems();
  },
  activated() {
    this.addFooter(CustomButton, {
      cb: this.showItemFilter.bind(this),
      caption: this.$t("btn-filter"),
      type: "grey"
    });
  },
  deactivated() {
    this.removeFooter();
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
    updateItems() {
      this.filterItems(this.$store.getters.getItemFilters);
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
            type:"grey"
          }
        ];
      }
      return buttons;
    },
    updateHintItems(index) {
      let currentSlide = this.currentSlideIndex;
      let maxSlideIndex =
        (this.filteredItems.length < 3 ? this.filteredItems.length : 3) - 1;
      let direction = 1;
      let cs = index.currentSlide;
      let fs = index.slideFrom;

      if (typeof index == "object") {
        currentSlide = index.currentSlide;

        if (currentSlide < 0) {
          currentSlide = maxSlideIndex;
        } else if (currentSlide > maxSlideIndex) {
          currentSlide = 0;
          direction = -1;
        }

        // get item by slide
        if (this.hintItems.length <= currentSlide) {
          index = 0;
        } else {
          index = this.hintItems[currentSlide].index;
        }
      }

      this.currentSlideIndex = currentSlide;

      for (let i = -1; i < maxSlideIndex; ++i) {
        // find correct indicies for items to place
        let offsetSlideIndex = currentSlide + i;
        if (offsetSlideIndex < 0) {
          offsetSlideIndex = maxSlideIndex;
        } else if (offsetSlideIndex > maxSlideIndex) {
          offsetSlideIndex = 0;
        }

        // find index of corresponding item
        let hintItemIndex = index + i;
        if (hintItemIndex < 0) {
          hintItemIndex = this.filteredItems.length - 1;
        } else if (hintItemIndex == this.filteredItems.length) {
          hintItemIndex = 0;
        }

        this.$set(this.hintItems, offsetSlideIndex, {
          item: this.filteredItems[hintItemIndex],
          index: hintItemIndex,
          slide: offsetSlideIndex
        });
      }
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
    async handleItemAction(item, action) {
      this.showHintItems = false;

      switch (action) {
        case "equip":
          this.request = this.$game.equipItem(item.id);
          break;

        case "unequip":
          const itemSlot = this.$game.itemsDB.getSlot(item.template);
          this.request = this.$game.unequipItem(itemSlot);
          break;

        case "use":
          this.request = this.$game.useItem(item.id);
          break;

        case "open":
          let template = item.template;
          this.request = this.$game.useItem(item.id);
          let items = await this.request;
          await ShowItems(items);
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

      this.updateHintItems(index);

      this.showHintItems = true;

      this.$nextTick(() => {
        this.$refs.hooper.updateWidth();
      });
    },
    async showItemFilter() {
      let filters = await ItemFilter();
      if (filters) {
        this.filterItems(filters);
      }
    },
    filterItems(filters) {
      let itemsDB = this.$game.itemsDB;
      let buffer = this.filteredItemsBuffers[this.bufferIndex++ % 2];
      buffer.length = 0;

      let i = 0;
      const length = this.items.length;

      for (; i < length; ++i) {
        let item = this.items[i];
        let template = item.template;
        const templateData = itemsDB.getTemplate(template);

        if (templateData.type == ItemType.Consumable) {
          // skip buffs
          if (
            templateData.action.action == ItemActions.Buff ||
            templateData.action.action == ItemActions.RaidBuff
          ) {
            continue;
          }
        }

        if (
          filters[itemsDB.getItemType(template)] ||
          (templateData.type == ItemType.Equipment &&
            filters[itemsDB.getSlot(template)])
        ) {
          buffer.push(item);
        }
      }

      this.filteredItems = buffer;
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

.items-bg-mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.616);
  z-index: 900;
}

.heroImage {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  max-width: 5rem;
}
</style>