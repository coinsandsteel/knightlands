<template>
  <UserDialog :title="$t('item-crafted-title')" @close="$close">
    <template v-slot:content>
      <ItemInfo :item="item" :quantity="amount"></ItemInfo>
    </template>

    <template v-slot:footer>
      <CustomButton type="grey" @click="$close">{{
        $t("btn-continue")
      }}</CustomButton>
      <CustomButton type="grey" v-if="!isAtMaxLevel" @click="levelUp">{{
        $t("btn-level-up")
      }}</CustomButton>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import ItemInfo from "@/components/ItemInfo.vue";
import CustomButton from "@/components/Button.vue";

export default {
  props: ["item", "amount"],
  components: { UserDialog, ItemInfo, CustomButton },
  computed: {
    isAtMaxLevel() {
      return this.$game.itemsDB.getMaxLevel(this.item, 2) < this.item.level;
    }
  },
  methods: {
    levelUp() {
      if (this.item.breakLimit != 2) {
        this.$router.push({
          name: "unbind-item",
          params: { itemId: this.item.id }
        });
      } else if (this.isAtMaxLevel) {
        this.$router.push({
          name: "upgrade-item",
          params: { itemId: this.item.id }
        });
      }

      this.$close();
    }
  }
};
</script>
