<template>
  <div
    class="item-info-stats font-size-18 margin-bottom-2 margin-top-1 flex flex-center flex-space-evenly"
    :class="{ matched: matchedWithOtherItem }"
  >
    <div class="flex width-45 flex-column text-align-right">
      <div
        v-for="(statValue, statId) in stats"
        :key="statId"
        class="margin-bottom-half width-100"
      >
        {{ $t(statId) }}
      </div>
    </div>
    <div class="flex width-15 flex-column text-align-left">
      <div
        v-for="(statValue, statId) in stats"
        :key="statId"
        class="margin-bottom-half width-100"
      >
        {{ format(statId, statValue) }}
      </div>
    </div>
  </div>
</template>

<script>
import ItemGetterMixin from "@/components/Item/ItemGetterMixin.vue";
import StatsFormatter from "@/components/Item/StatsFormatter.vue";

export default {
  mixins: [ItemGetterMixin, StatsFormatter]
};
</script>

<style lang="less" scoped>
.item-info-stats {
  align-items: flex-start;

  & > div {
    white-space: nowrap;
  }

  &.matched {
    color: #00ac21;
  }
}
</style>
