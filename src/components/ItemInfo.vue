<template>
  <div class="flex flex-column flex-no-wrap relative width-100 item-info-container">
    <span
      class="title font-size-20 margin-bottom-1"
      :class="`rarity-${template.rarity}`"
      v-if="!hideTitle"
    >{{$t(template.caption)}}</span>

    <loot
      class="loot-icon hintFix margin-left-1"
      :class="{'offset-loot': !hideTitle}"
      :item="item"
      :interactible="false"
      v-bind="lootProps"
    ></loot>

    <div class="flex flex-center font-size-20">
      <span :class="{'margin-right-1': !hasElement}">{{type}}</span>
      <div v-if="hasElement" :class="elementIcon" class="big"></div>
      <slot name="afterType"></slot>
    </div>

    <slot name="beforeStats"></slot>

    <slot name="stats">
      <div
        class="item-info-stats margin-bottom-2 margin-top-1 flex flex-center font-size-20 flex-space-evenly"
      >
        <div class="flex width-40 flex-column flex-item-end text-align-right">
          <div
            v-for="(statValue, statId) in stats"
            :key="statId"
            class="margin-bottom-half width-100"
          >{{$t(statId)}}</div>
        </div>
        <div class="flex width-40 flex-column text-align-left">
          <div
            v-for="(statValue, statId) in stats"
            :key="statId"
            class="margin-bottom-half width-100"
          >{{statValue}}</div>
        </div>
      </div>
    </slot>

    <slot name="afterStats"></slot>

    <div v-if="!onlyStats" class="flex flex-items-center font-size-18 flex-column flex-no-wrap">
      <div class="margin-bottom-half" v-for="p in properties" :key="p" v-html="p"></div>
      <div class="margin-bottom-half" v-if="action" v-html="action"></div>
      <span
        class="margin-bottom-half"
        v-if="template.maxStacks > 0"
      >{{$t("max-stacks", {max: template.maxStacks})}}</span>
    </div>

    <span
      class="loot-desc desc-font font-size-20 margin-bottom-1"
      v-if="!onlyStats && desc"
    >{{desc}}</span>

    <span
      class="loot-desc desc-font font-size-20"
      v-if="!onlyStats && isOffHand"
    >{{$t(`${template.equipmentType}-bonus`)}}</span>
  </div>
</template>

<script>
const ItemActions = require("@/../knightlands-shared/item_actions");
import Loot from "@/components/Loot.vue";
const ItemType = require("@/../knightlands-shared/item_type");
const {
  EquipmentSlots,
  getSlot
} = require("@/../knightlands-shared/equipment_slot");
import ItemProperties from "@/../knightlands-shared/item_properties";
import RaidsMeta from "@/raids_meta";

export default {
  props: {
    item: [Object, Number],
    hideTitle: Boolean,
    onlyStats: Boolean,
    lootProps: Object
  },
  components: { Loot },
  computed: {
    isOffHand() {
      if (this.template.type != ItemType.Equipment) {
        return false;
      }

      return getSlot(this.template.equipmentType) == EquipmentSlots.OffHand;
    },
    template() {
      return this.$game.itemsDB.getTemplate(this.item);
    },
    elementIcon() {
      return `icon-${this.template.element}`;
    },
    hasElement() {
      if (this.template.type != ItemType.Equipment) {
        return false;
      }

      if (getSlot(this.template.equipmentType) != EquipmentSlots.MainHand) {
        return false;
      }

      return this.template.element != "physical";
    },
    desc() {
      return this.$t(this.template.description, "");
    },
    type() {
      let type = this.template.type;
      if (this.template.type == ItemType.Equipment) {
        type = this.template.equipmentType;
      }

      return `${this.$t(this.template.rarity)} ${this.$t(type)}`;
    },
    stats() {
      return this.$game.itemsDB.getStats(this.item);
    },
    action() {
      let action = this.template.action;
      if (!action || action.action == ItemActions.OpenBox) {
        return "";
      }

      let params = { ...action };

      if (action.action == ItemActions.Buff) {
        params.duration = params.duration / 3600;
      } else if (action.action == ItemActions.RaidBuff) {
        params.raid = this.$t(RaidsMeta[params.raid].name);
      }

      if (action.relative) {
        params.suffix = "%";
      } else {
        params.suffix = "";
      }

      if (params.stat) {
        params.stat = this.$t(params.stat);
      }

      return this.$t(action.action, params);
    },
    properties() {
      if (!this.template.properties) {
        return [];
      }

      let props = new Array(this.template.properties.length);

      let i = 0;
      let propIndex = 0;
      const length = this.template.properties.length;
      for (; i < length; i++) {
        const property = this.$game.itemsDB.getProperty(
          this.template.properties[i]
        );
        if (!property) {
          continue;
        }

        let locKey = property.type;
        if (property.type == ItemProperties.IncreasedStatBasedOnMood) {
          if (property.value2 > 0) {
            locKey = ItemProperties.IncreasedStatBasedOnMood + "_positive";
          } else {
            locKey = ItemProperties.IncreasedStatBasedOnMood + "_negative";
          }
        }

        let locParams = { ...property };

        if (locParams.rarity) {
          locParams.rarityClass = locParams.rarity;
          locParams.rarity = this.$t(locParams.rarity);
        }

        if (locParams.item) {
          locParams.rarityClass = this.$game.itemsDB.getRarity(locParams.item);
        }

        if (locParams.item) {
          locParams.item = this.$t(this.$game.itemsDB.getName(locParams.item));
        } else if (property.type == ItemProperties.ExtraStatIfItemNotEquipped) {
          locParams.rarityClass = this.$game.itemsDB.getRarity(this.item);
          locParams.item = this.$t(this.$game.itemsDB.getName(this.item));
          locParams.maxItemCount = locParams.maxItemCount || 1;
        }

        if (locParams.hasOwnProperty("raidStage")) {
          let stage = "normal";

          switch (locParams.raidStage) {
            case 1:
              stage = "hard";
              break;

            case 2:
              stage = "ruthless";
              break;

            case 3:
              stage = "torment";
              break;
          }

          locParams.raidStage = this.$t(stage);
        }

        if (locParams.stat) {
          locParams.stat = this.$t(locParams.stat);
        }

        if (locParams.baseStat) {
          locParams.baseStat = this.$t(locParams.baseStat);
        }

        props[propIndex++] = this.$t(locKey, locParams);
      }
      return props;
    }
  }
};
</script>

<style lang="less" scoped>
.item-info-stats {
  align-items: flex-start;
  padding-top: 1rem;

  & > div {
    white-space: nowrap;
  }
}

.loot-desc {
  margin-top: 1.5rem;
  margin-left: 0.5rem;
  color: #dcb850;
}

.loot-icon {
  position: absolute;
  left: 0;
  top: 0;

  &.offset-loot {
    top: 3rem;
  }
}

.item-info-container {
  min-height: 10rem;
}
</style>