<template>
  <div class="flex flex-column">
    <div class="flex flex-center width-100">
      <div class="flex flex-column relative">
        <span class="font-size-20 absolute-top white-space-no-wrap">{{
          $t(fromTitle)
        }}</span>
        <Loot
          :item="itemFrom"
          :hideQuantity="true"
          :quantity="conversionRate"
          @hint="onHint"
        ></Loot>
        <span class="font-size-18 absolute-bottom"
          >{{ requiredCount }}&nbsp;/&nbsp;{{ totalCount }}</span
        >
      </div>

      <span class="arror right-arrow margin-left-2 margin-right-2"></span>

      <div class="flex flex-column relative">
        <span class="font-size-20 absolute-top white-space-no-wrap">{{
          $t(toTitle)
        }}</span>
        <NumericValue
          :showMax="true"
          :value="requiredCount"
          :maxValue="totalCount"
          :decreaseCondition="requiredCount > 0"
          :increaseCondition="canAdd()"
          @inc="inc"
          @dec="dec"
          @max="setMax"
          @reset="reset"
        >
          <template v-slot:between>
            <Loot
              :hideQuantity="true"
              :item="itemTo"
              @hint="onHint"
              :quantity="1"
            ></Loot>
          </template>
        </NumericValue>
        <span class="font-size-18 absolute-bottom">{{ resultCount }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";
import NumericValue from "@/components/NumericValue.vue";

export default {
  components: {
    Loot,
    NumericValue
  },
  props: ["itemFrom", "itemTo", "conversionRate", "fromTitle", "toTitle", "id"],
  data: () => ({
    requiredCount: 0,
    resultCount: 0
  }),
  computed: {
    itemDataFrom() {
      return this.$game.inventory.getItemByTemplate(this.itemFrom);
    },
    totalCount() {
      return this.itemDataFrom.count;
    }
  },
  methods: {
    setMax() {
      this.resultCount = Math.floor(this.totalCount / this.conversionRate);
      this.requiredCount += this.resultCount * this.conversionRate;
      this.emitChanged();
    },
    reset() {
      this.requiredCount = 0;
      this.resultCount = 0;
      this.emitChanged();
    },
    canAdd() {
      return this.requiredCount + this.conversionRate <= this.totalCount;
    },
    inc() {
      this.requiredCount += this.conversionRate;
      this.resultCount++;
      this.emitChanged();
    },
    dec() {
      this.requiredCount -= this.conversionRate;
      this.resultCount--;
      this.emitChanged();
    },
    emitChanged() {
      this.$emit("changed", this.resultCount, this.id);
    },
    onHint(item) {
      this.$emit("hint", item);
    }
  }
};
</script>

<style lang="less" scoped>
.absolute-bottom {
  position: absolute;
  bottom: 0;
  transform: translateY(100%) translateX(-50%);
  left: 50%;
}

.absolute-top {
  position: absolute;
  top: 0;
  transform: translateY(-100%) translateX(-50%);
  left: 50%;
}
</style>
