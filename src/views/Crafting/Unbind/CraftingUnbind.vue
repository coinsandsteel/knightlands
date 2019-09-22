<template>
  <div class="padding-1 height-100 dummy-height">
    <div class="flex full-flex dummy-height">
      <div v-bar class="width-100 height-100 dummy-height" v-if="items.length > 0">
        <LootContainer :items="items" @hint="openUnbind" :lootProps="{showUnbindLevels: true, showLevel: true}"></LootContainer>
      </div>
      <div class="flex flex-center width-100 height-100" v-else>
        <span class="font-size-20">{{$t("upgrade-list-empty-msg")}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import LootContainer from "@/components/LootContainer.vue"
const ItemType = require("@/../knightlands-shared/item_type");

export default {
  mixins: [AppSection],
  components: {LootContainer},
  created() {
    this.title = "window-unbind-items-list";
  },
  computed: {
    items() {
      let filteredItems = [];
      let items = this.$game.inventory.items;
      let i = 0;
      const length = items.length;

      for (; i < length; ++i) {
        let item = items[i];
        let template = this.$game.itemsDB.getTemplate(item.template);

        if (!template.unbindable || item.breakLimit == 2) {
          continue;
        }

        if (this.$game.inventory.getItemsCountByTemplate(item.template) < 2) {
          continue;          
        }

        filteredItems.push(item);
      }

      return filteredItems;
    }
  },
  methods: {
    openUnbind(item) {
      this.$router.push({ name: "unbind-item", params: { itemId: item.id } });
    }
  }
}
</script>