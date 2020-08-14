<template>
  <UserDialog :compact="true" @close="$close">
    <template v-slot:content>
      <div class="flex flex-no-wrap width-100 padding-top-4">
        <div class="flex-basis-50 flex flex-column flex-items-start">
          <span
            class="font-size-20 padding-1 margin-bottom-half item-title width-100"
            :class="`rarity-${getRarity(leftItem)}`"
          >{{$t(getName(leftItem))}}</span>

          <div class="flex">
            <div class="flex space-evenly">
              <loot
                class="loot-icon margin-left-1"
                :item="leftItem"
                :interactible="false"
                :hideQuantity="true"
              ></loot>

              <div class="flex flex-items-start font-size-20 margin-left-1">
                <div v-if="hasElement(leftItem)" :class="`icon-${getElement(leftItem)}`" class="big"></div>
                <div class="flex flex-center">
                  <span class="star" :class="{active: leftItem.stars >= 1}"></span>
                  <span class="star margin-right-auto" :class="{active: leftItem.stars >= 2}"></span>
                </div>
              </div>
            </div>
          </div>

          <div
            class="item-info-stats margin-bottom-2 margin-top-1 flex flex-center width-100 font-size-18 flex-space-evenly"
          >
            <div class="flex flex-2 flex-column margin-right-1 flex-item-end text-align-right">
              <div
                v-for="(statValue, statId) in getStats(leftItem)"
                :key="statId"
                class="margin-bottom-half width-100"
              >{{$t(statId)}}</div>
            </div>
            <div class="flex flex-1 flex-column text-align-left">
              <div
                v-for="(statValue, statId) in getStats(leftItem)"
                :key="statId"
                class="margin-bottom-half width-100"
              >{{statValue}}</div>
            </div>
          </div>
        </div>

        <div class="flex-basis-50 flex flex-column flex-items-end">
          <span
            class="font-size-20 padding-1 margin-bottom-half item-title width-100"
            :class="`rarity-${getRarity(rightItem)}`"
          >{{$t(getName(rightItem))}}</span>

          <div class="flex space-evenly">
              <div class="flex flex-items-start font-size-20 margin-right-1">
                <div v-if="hasElement(rightItem)" :class="`icon-${getElement(rightItem)}`" class="big"></div>
                <div class="flex flex-center">
                  <span class="star" :class="{active: rightItem.stars >= 1}"></span>
                  <span class="star margin-right-auto" :class="{active: rightItem.stars >= 2}"></span>
                </div>
              </div>

              <loot
                class="loot-icon margin-right-1"
                :item="rightItem"
                :interactible="false"
                :hideQuantity="true"
              ></loot>
            </div>

          <div
            class="item-info-stats margin-bottom-2 margin-top-1 flex flex-space-between width-100 font-size-18 flex-space-evenly"
          >
            <div class="flex flex-1 flex-column text-align-right">
              <div
                v-for="(statValue, statId) in getStats(rightItem)"
                :key="statId"
                class="margin-bottom-half width-100"
              >{{statValue}}</div>
            </div>

            <div class="flex flex-2 flex-column margin-left-1 text-align-left">
              <span
                v-for="(statValue, statId) in getStats(rightItem)"
                :key="statId"
                class="margin-bottom-half white-space-no-wrap"
              >{{$t(statId)}}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="flex width-100">
        <ItemProperties class="flex-basis-50" :item="leftItem"></ItemProperties>
        <ItemProperties class="flex-basis-50" :item="rightItem"></ItemProperties>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import ItemInfo from "@/components/ItemInfo.vue";
import Loot from "@/components/Loot.vue";
import ItemProperties from "@/components/ItemProperties.vue";
const ItemType = require("@/../knightlands-shared/item_type");
const {
  EquipmentSlots,
  getSlot
} = require("@/../knightlands-shared/equipment_slot");

export default {
  props: ["leftItem", "rightItem"],
  components: { UserDialog, ItemInfo, Loot, ItemProperties },
  methods: {
    getName(item) {
      return this.$game.itemsDB.getName(item.template);
    },
    getRarity(item) {
      return this.$game.itemsDB.getRarity(item.template);
    },
    getStats(item) {
      return this.$game.itemsDB.getStats(item);
    },
    hasElement(item) {
      const template = this.$game.itemsDB.getTemplate(item.template);
      if (template.type != ItemType.Equipment) {
        return false;
      }

      if (getSlot(template.equipmentType) != EquipmentSlots.MainHand) {
        return false;
      }

      return template.element != "physical";
    },
    getElement(item) {
        return this.$game.itemsDB.getTemplate(item.template).element;
    },
    getType(item) {
      const template = this.$game.itemsDB.getTemplate(item.template);
      let type = template.type;
      if (template.type == ItemType.Equipment) {
        type = template.equipmentType;
      }

      return `${this.$t(template.rarity)} ${this.$t(type)}`;
    }
  }
};
</script>

<style lang="less" scoped>
.item-title {
  background-color: #333333;
}
</style>