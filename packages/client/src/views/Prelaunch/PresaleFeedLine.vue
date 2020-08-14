<template>
  <div
    ref="root"
    :class="[{'width-90': expanded}, {'center': expanded}]"
    class="flex flex-center flex-space-between"
  >
    <loot
      :item="feedRecord.item.item"
      :quantity="feedRecord.item.quantity"
      :hideQuantity="true"
      @hint="handleHint"
      size="small"
    ></loot>

    <span class="flex flex-full flex-center flex-column font-size-18 yellow-title">
      <div>
        {{$game.shortAccount(feedRecord.user)}}
        <span>has obtained</span>
      </div>
      <span
        :class="`rarity-${getRarity(feedRecord.item.item)}`"
      >{{$t(getItemName(feedRecord.item.item))}}</span>
    </span>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";

export default {
  props: ["feedRecord", "expanded"],
  components: { Loot },
  methods: {
    handleHint(item) {
      this.$emit("hint", item);
    },
    getItemName(template) {
      return this.$game.itemsDB.getName(template);
    },
    getRarity(template) {
      return this.$game.itemsDB.getRarity(template);
    }
  }
};
</script>

