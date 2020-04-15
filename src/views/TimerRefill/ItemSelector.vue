<template>
  <div class="flex flex-column flex-center">
    <NumericValue
      :showMax="true"
      :value="selected"
      :maxValue="item.count"
      :decreaseCondition="selected > 0"
      :increaseCondition="canAdd()"
      @inc="inc"
      @dec="dec"
    >
      <template v-slot:between>
        <Loot class="margin-1" :item="item" :hideQuantity="true" @hint="handleHint"></Loot>
      </template>
    </NumericValue>
    <span class="font-size-18">{{selected}}/{{item.count}}</span>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";
import NumericValue from "@/components/NumericValue.vue";
import CharacterStat from "@/../knightlands-shared/character_stat";

export default {
  props: ["item", "maxStat", "predictedHp"],
  components: { NumericValue, Loot },
  data: () => ({
    selected: 0
  }),
  methods: {
    canAdd() {
      return this.selected < this.item.count && this.predictedHp < this.maxStat;
    },
    handleHint(item) {
      this.$emit("hint", item);
    },
    inc() {
      this.selected++;
      this.emitChanged();
    },
    dec() {
      this.selected--;
      this.emitChanged();
    },
    emitChanged() {
      this.$emit("changed", this.selected, this.item);
    }
  }
};
</script>