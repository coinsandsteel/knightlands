<template>
  <div class="flex flex-column flex-no-wrap">
    <LegionSelector class="margin-bottom-half" :legion="0" :army="_army" />

    <div class="flex flex-column flex-no-wrap">
      <!-- <Title class="margin-bottom-1" :title="$t('generals')" /> -->

      <div class="width-100 units-grid margin-bottom-2">
        <div v-for="unit in generals()" :key="unit.id">
          <UnitSlot :unit="unit" />

          <div class="items-grid">
            <Loot
              v-for="item in unit.items"
              :key="item.id"
              :item="item"
              :showEquipped="false"
              :showLevel="true"
              :showUnique="false"
              @hint="handleHint"
            ></Loot>
          </div>
        </div>
      </div>

      <!-- <Title class="margin-bottom-1 margin-top-1" :title="$t('troops')" /> -->

      <div class="units-grid width-100">
        <div v-for="unit in troops()" :key="unit.id">
          <UnitSlot :unit="unit" />

          <div class="items-grid">
            <Loot
              v-for="item in unit.items"
              :key="item.id"
              :item="item"
              :showEquipped="false"
              :showLevel="true"
              :showUnique="false"
              @hint="handleHint"
            ></Loot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LegionSelector from "@/views/Army/LegionSelector.vue";
import UnitSlot from "@/views/Army/UnitSlot.vue";
import Loot from "@/components/Loot.vue";
import Army from "@/army/army";
import Inventory from "@/inventory";
import HintHandler from "@/components/HintHandler.vue";

export default {
  props: ["army", "items"],
  mixins: [HintHandler],
  components: { Loot, UnitSlot, LegionSelector },
  watch: {
    army: {
      immediate: true,
      handler() {
        this.reload();
      }
    }
  },
  methods: {
    generals() {
      return this._army.getUnits(false);
    },
    troops() {
      return this._army.getUnits(true);
    },
    reload() {
      if (!this.army) {
        return;
      }

      for (const legion of this.army.legions) {
        for (const slotId in legion.units) {
          const unit = legion.units[slotId];
          for (const slotItemId in unit.items) {
            unit.items[slotItemId] = this.items.find(
              x => x.id == unit.items[slotItemId].id
            );
          }
        }
      }

      if (!this._army) {
        this._army = new Army(
          null,
          this.$game.itemsDB.itemStatResolver,
          this.$game.armyDB,
          new Inventory(this.$game.itemsDB),
          this.character
        );
      }
      this._army.loadFromData(this.army, true);

      this.$forceUpdate();
    }
  }
};
</script>

<style lang="less" scoped>
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6.5rem, 1fr));
  justify-items: center;
  row-gap: 0.5rem;
}

.units-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
  row-gap: 1rem;
  column-gap: 1rem;
}
</style>
