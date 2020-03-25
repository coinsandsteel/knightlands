<template>
  <div class="padding-1 height-100">
    <Promised class="screen-content" :promise="request">
      <template v-slot:combined="{ isPending, isDelayOver, data }">
        <LoadingScreen :loading="isPending && isDelayOver"></LoadingScreen>

        <LootContainer
          ref="lootContainer"
          :items="filteredItems"
          :selectSlots="true"
          :multiSelect="true"
          :lootProps="{showUnbindLevels: true, showLevel: true, }"
          @selected="handleItemSelected"
        ></LootContainer>

        <span class="font-size-22 margin-top-3 margin-bottom-1 title">{{$t("disenchant-results")}}</span>

        <div class="flex flex-center materials-preview">
          <template v-if="Object.keys(predictedMaterials).length > 0">
            <Loot
              v-for="(data, key) in predictedMaterials"
              :key="key"
              :quantity="data.count"
              :item="data.template"
            ></Loot>
          </template>

          <span class="font-size-20" v-else>{{$t("disenchant-no-materials")}}</span>
        </div>

        <div class="flex flex-center margin-top-1">
          <CustomButton
            @click="disenchantItems"
            :disabled="Object.keys(predictedMaterials).length == 0"
            type="yellow"
          >{{$t("btn-disenchant")}}</CustomButton>
        </div>
      </template>
    </Promised>

    <portal to="footer" :slim="true" v-if="isActive">
      <CustomButton
        type="grey"
        @click="showItemFilter({customFilter: customFilter})"
      >{{$t("btn-filter")}}</CustomButton>
      <CustomButton type="green" @click="goToUpgrade">{{$t("btn-dis-upgrade")}}</CustomButton>
    </portal>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import { Promised } from "vue-promised";
import PromptMixin from "@/components/PromptMixin.vue";
import LootContainer from "@/components/LootContainer.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import FilteredLootMixin from "@/components/FilteredLootMixin.vue";
import CustomButton from "@/components/Button.vue";
import { EquipmentSlots } from "@/../knightlands-shared/equipment_slot";
import DisenchantingMeta from "@/disenchanting_meta";
import Loot from "@/components/Loot.vue";
import ShowItemsMixin from "@/components/ShowItemsMixin.vue";

export default {
  mixins: [AppSection, PromptMixin, FilteredLootMixin, ShowItemsMixin],
  components: {
    LoadingScreen,
    LootContainer,
    Promised,
    CustomButton,
    Loot
  },
  data: () => ({
    request: null,
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
  methods: {
    async disenchantItems() {
      const selectedItems = this.$refs.lootContainer.selectedItems();
      const payload = {};
      for (const itemId in selectedItems) {
        payload[itemId] = 1;
      }

      try {
        this.request = this.$game.disenchantItems(payload);
        const items = await this.request;
        this.predictedMaterials = {};
        await this.showItems(items);
      } catch {
        this.showPrompt(
          this.$t("prompt-snap-title"),
          this.$t("prompt-snap-msg"),
          [
            {
              type: "yellow",
              title: "btn-ok",
              response: true
            }
          ]
        );
      }
    },
    customFilter(key) {
      return this.equipmentLookup[key];
    },
    handleItemSelected(item, index, selected) {
      const rarity = this.$game.itemsDB.getRarity(item);
      const quantity = DisenchantingMeta[rarity].dropAmountMin;
      // calculate total materials from selected items
      if (selected) {
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