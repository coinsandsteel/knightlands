<template>
  <div class="padding-1">
    <div class="flex full-flex dummy-height">
      <div v-bar class="width-100 height-100 dummy-height" v-if="items.length > 0">
        <LootContainer :items="items" @hint="openUpgrade" :lootProps="{showLevel:true, hideQuantity:true}"></LootContainer>
      </div>
      <div class="flex flex-center width-100 height-100" v-else>
        <span class="font-size-20">{{$t("leveling-list-empty-msg")}}</span>
      </div>
    </div>
    
  </div>
</template>

<script>
import LootContainer from "@/components/LootContainer.vue";
import AppSection from "@/AppSection";
const ItemType = require("@/../knightlands-shared/item_type");

export default {
  mixins: [AppSection],
  components: { LootContainer },
  created() {
    this.title = "window-upgrade-items-list";
  },
  computed: {
    items() {
      let filteredItems = [];
      let items = this.$game.inventory.items;
      let upgradableSlots = this.$game.itemsDB.getUpgradableSlots();
      let i = 0;
      const length = items.length;

      for (; i < length; ++i) {
        let item = items[i];
        let template = this.$game.itemsDB.getTemplate(item.template);

        if (
          template.type != ItemType.Equipment || !upgradableSlots[this.$game.itemsDB.getSlot(item.template)]
        ) {
          continue;
        }

        if (item.level < this.$game.itemsDB.getMaxLevel(item)) {
          filteredItems.push(item);
        }
      }

      return filteredItems;
    }
  },
  methods: {
    openUpgrade(item) {
      this.$router.push({ name: "upgrade-item", params: { itemId: item.id } });
    }
  }
};
</script>