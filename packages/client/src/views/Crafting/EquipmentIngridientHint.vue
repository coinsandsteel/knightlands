<template>
  <LootHint
    :item="item"
    :buttons="buttons"
    :actions="actions"
    @close="handleClose"
  >
    <div
      class="width-100 margin-top-2 font-size-20 font-weight-900 font-outline color-panel-1"
    >
      <span class="font-error" v-if="notMaxLevel">{{
        $t("item-max-lvl", { lvl: maxLevel })
      }}</span>
    </div>
  </LootHint>
</template>

<script>
import LootHint from "@/components/LootHint.vue";

export default {
  components: { LootHint },
  props: ["type", "item", "buttons", "actions"],
  computed: {
    notMaxLevel() {
      return this.type == "not-max-lvl";
    },
    maxLevel() {
      return this.$game.itemsDB.getMaxLevel(this.item, 2);
    }
  },
  methods: {
    handleClose(item, response, ...args) {
      if (this.$close) {
        this.$close(response, ...args);
      } else {
        this.$emit("close", item, response, ...args);
      }
    }
  }
};
</script>
