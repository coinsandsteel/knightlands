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
      return (
        this.$game.itemsDB.getMaxLevel(this.itemData, 2) < this.itemData.level
      );
    },
    itemData() {
      let item = this.item;
      if (typeof this.item != "object") {
        // if template was passed it means that new item was created
        // search for non-unique version of item
        const items = this.$game.inventory.getItemsByTemplate(this.item);
        for (const i of items) {
          if (!i.unique) {
            item = i;
            break;
          }
        }
      }

      return item;
    }
  },
  methods: {
    levelUp() {
      const query = { returnTo: this.$route.query.returnTo };
      if (this.itemData.breakLimit != 2) {
        this.$router.push({
          name: "unbind-item",
          params: { itemId: this.itemData.id },
          query
        });
      } else if (this.isAtMaxLevel) {
        this.$router.push({
          name: "upgrade-item",
          params: { itemId: this.itemData.id },
          query
        });
      }

      this.$close();
    }
  }
};
</script>
