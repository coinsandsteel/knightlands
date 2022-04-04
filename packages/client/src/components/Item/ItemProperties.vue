<template>
  <div class="flex flex-items-center font-size-18 flex-column flex-no-wrap">
    <div
      class="margin-bottom-half"
      v-for="p in properties"
      :key="p"
      v-html="p"
    ></div>
    <div
      class="margin-bottom-half"
      v-for="p in accessoryProperties"
      :key="p"
      v-html="p"
    ></div>
    <div class="margin-bottom-half" v-if="action" v-html="action"></div>
    <span class="margin-bottom-half" v-if="template.maxStack > 0">{{
      $t("max-stacks", { max: template.maxStack })
    }}</span>

    <span
      class="loot-desc desc-font font-size-20 margin-bottom-1"
      v-if="!onlyStats && desc && item"
      >{{ desc }}</span
    >

    <span
      class="loot-desc desc-font font-size-20"
      v-if="!onlyStats && isOffHand && item"
      >{{ $t(`${template.equipmentType}-bonus`) }}</span
    >
  </div>
</template>

<script>
const ItemActions = require("@/../../knightlands-shared/item_actions");
import ItemProperties from "@/../../knightlands-shared/item_properties";
import ItemGetterMixin from "./ItemGetterMixin.vue";
import AccessoryPropertiesViewMixin from "./AccessoryPropertiesViewMixin.vue";
import RaidsMeta from "@/metadata/raids_meta";
import CharacterStat from "@/../../knightlands-shared/character_stat";

export default {
  mixins: [ItemGetterMixin, AccessoryPropertiesViewMixin],
  props: ["onlyStats", "accOptions"],
  computed: {
    action() {
      let action = this.template.action;
      if (
        !action ||
        action.action == ItemActions.OpenBox ||
        action.action == ItemActions.SummonUnit
      ) {
        return "";
      }

      let params = { ...action };

      if (action.action == ItemActions.Buff) {
        params.duration = Math.floor((params.duration / 3600) * 100) / 100;
      } else if (action.action == ItemActions.RaidBuff) {
        params.raid = this.$t(RaidsMeta[params.raid].name);
      }

      if (action.relative) {
        params.suffix = "%";
      } else {
        params.suffix = "";
      }

      if (action.stat == CharacterStat.ExtraExp) {
        params.suffix = "%";
        params.value /= 10;
      }

      if (params.stat) {
        params.stat = this.$t(params.stat);
      }

      return this.$t(action.action, params);
    },
    accessoryProperties() {
      if (!this.item || !this.item.properties) {
        return [];
      }
      return this.viewAccessoryProps(this.item, this.accOptions);
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
.loot-desc {
  margin-top: 1.5rem;
  margin-left: 0.5rem;
  color: #dcb850;
}
</style>
