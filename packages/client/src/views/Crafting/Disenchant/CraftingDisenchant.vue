<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <MultiSelectItemContainer
      ref="lootContainer"
      :items="items"
      :filtersStore="$store.getters.getDisenchantFilters"
      commitCmd="setDisenchantingFilters"
      @select="selectItem"
    >
      <template v-slot:content>
        <div class="color-panel-2 margin-top-1">
          <span
            class="font-size-22 margin-bottom-1 font-outline font-weight-900"
            >{{ $t("disenchant-results") }}</span
          >

          <div class="flex flex-center materials-preview">
            <template v-if="Object.keys(predictedMaterials).length > 0">
              <Loot
                v-for="(data, key) in predictedMaterials"
                :key="`${key}_${data.count}`"
                :quantity="data.count"
                :item="data.template"
              ></Loot>
            </template>

            <span class="font-size-18" v-else>{{
              $t("disenchant-no-materials")
            }}</span>
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <CustomButton
          @click="disenchantItems"
          :disabled="Object.keys(predictedMaterials).length == 0"
          type="yellow"
          >{{ $t("btn-disenchant") }}</CustomButton
        >
      </template>
    </MultiSelectItemContainer>

    <portal to="footer" :slim="true" v-if="isActive">
      <CustomButton type="grey" @click="goToUpgrade">{{
        $t("btn-dis-upgrade")
      }}</CustomButton>
    </portal>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import CustomButton from "@/components/Button.vue";
import { EquipmentSlots } from "@/../../knightlands-shared/equipment_slot";
import DisenchantingMeta from "@/disenchanting_meta";
import ShowItemsMixin from "@/components/ShowItemsMixin.vue";
import Loot from "@/components/Loot.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import MultiSelectItemContainer from "@/components/Item/MultiSelectItemContainer.vue";

export default {
  mixins: [AppSection, PromptMixin, ShowItemsMixin, NetworkRequestErrorMixin],
  components: {
    MultiSelectItemContainer,
    CustomButton,
    Loot
  },
  data: () => ({
    predictedMaterials: {}
  }),
  created() {
    this.title = "window-disenchant-items";
    this.filtersStore = this.$store.getters.disenchantFilters;
    this.commitCmd = "setDisenchantingFilters";

    this.equipmentLookup = {};
    for (const key in EquipmentSlots) {
      if (key == "Pet") {
        continue;
      }

      this.equipmentLookup[EquipmentSlots[key]] = true;
    }
  },
  computed: {
    items() {
      const items = this.$game.inventory.items;
      const filteredItems = new Array(items.length);
      const length = items.length;
      let insertedItems = 0;

      for (let index = 0; index < length; ++index) {
        const item = items[index];
        if (item.equipped || item.locked) {
          continue;
        }
        filteredItems[insertedItems++] = item;
      }

      filteredItems.length = insertedItems;
      return filteredItems;
    }
  },
  methods: {
    async disenchantItems() {
      const selectedItems = this.$refs.lootContainer.selectedItems;
      const payload = {};
      for (const itemId in selectedItems) {
        payload[itemId] = selectedItems[itemId];
      }

      const items = await this.performRequest(
        this.$game.disenchantItems(payload)
      );
      this.predictedMaterials = {};
      this.$refs.lootContainer.resetSelectedItems();
      await this.showItems(items);
    },
    customFilter(key) {
      return this.equipmentLookup[key];
    },
    selectItem({ item, count, select }) {
      this.updateMaterialsForItem(item, count, select);
    },
    updateMaterialsForItem(item, count, add) {
      const rarity = this.$game.itemsDB.getRarity(item);
      const quantity = DisenchantingMeta[rarity].dropAmountMin * count;
      // calculate total materials from selected items
      if (add) {
        if (!this.predictedMaterials[rarity]) {
          this.$set(this.predictedMaterials, rarity, {
            count: 0,
            template: DisenchantingMeta[rarity].dustItem
          });
        }
        this.predictedMaterials[rarity].count += quantity;
      } else {
        this.predictedMaterials[rarity].count -= quantity;
        if (this.predictedMaterials[rarity].count <= 0) {
          this.$delete(this.predictedMaterials, rarity);
        }
      }
    },
    goToUpgrade() {
      this.$router.push({
        name: "disenchant-convert"
      });
    }
  }
};
</script>

<style lang="less" scoped>
.materials-preview {
  height: 10rem;
}
</style>
