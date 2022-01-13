<template>
  <div class="screen-content">
    <div class="full-flex dummy-height width-100">
      <div
        class="width-100 height-100 dummy-height flex flex-column flex-no-wrap"
      >
        <CraftContainer
          :maxSelectedItems="selectedGroup ? selectedGroup.craftItemsCount : 0"
          :selectedItems="selectedItems"
          @item-removed="itemRemovedHandler"
          @items-reset="itemsResetHandler"
        />
        <div
          class="inv-root dummy-height full-flex width-100 height-100 margin-top-1"
        >
          <div v-bar class="center width-100 height-100 dummy-height">
            <div>
              <template v-for="(group, groupIndex) in itemGroups">
                <div
                  class="group-name font-size-25 text-align-left padding-top-1 padding-bottom-1 padding-left-2 padding-right-2"
                  :key="`group-name-${groupIndex}`"
                  :class="group.nameClasses"
                >
                  {{ group.name }}
                </div>
                <div
                  :key="`group-${groupIndex}`"
                  class="element-group width-100 dummy-height inventory-container margin-top-1 margin-bottom-1  padding-left-1 padding-right-1"
                >
                  <Loot
                    v-for="(item, itemIndex) in group.items"
                    :id="`i-${item.template}`"
                    :item="item"
                    :key="itemIndex"
                    :inventory="false"
                    :selected="selectedItemId === item.id"
                    :itemSlotClasses="
                      item && item.itemSlotClasses ? item.itemSlotClasses : null
                    "
                    :iconClasses="
                      item && item.iconClasses ? item.iconClasses : null
                    "
                    @hint="handleHint"
                  >
                    <div
                      v-if="
                        selectedItemIds.includes(item.id) &&
                          selectedItemId !== item.id
                      "
                      class="select-overlay flex flex-center"
                    />
                  </Loot>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CraftContainer from "@/views/Lunar/CraftContainer.vue";
import Loot from "@/components/Loot.vue";

import {
  ITEM_GROUP_BASIC,
  ITEM_GROUP_ADVANCED,
  ITEM_GROUP_EXPERT
} from "@/../../knightlands-shared/lunar";

export default {
  components: { CraftContainer, Loot },
  data() {
    return {
      selectedItems: [],
      lootClasses: [],
      selected: {},
      selectedItemId: null,
      maxSelectedItems: 3,
      selectedGroupId: null
    };
  },
  computed: {
    itemGroups() {
      const groups = [];

      // basic
      let group = {
        id: ITEM_GROUP_BASIC,
        name: this.$t("btn-basic"),
        items: [],
        nameClasses: "group-basic-name",
        craftItemsCount: 3
      };
      for (let i = 1; i < 50; i++) {
        const index = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
        group.items.push({
          id: i,
          itemSlotClasses: "lunar-lantern-slot",
          iconClasses: "basic-lantern" + index,
          isCustomElement: true,
          // template: 2928
          count: index,
          group: ITEM_GROUP_BASIC
          // level: 1,
          // exp: 0,
          // equipped: false,
          // breakLimit: 0,
          // unique: false,
          // rarity: "epic",
          // element: "physical",
          // index: 13
        });
      }
      groups.push(group);

      // advanced
      group = {
        id: ITEM_GROUP_ADVANCED,
        name: this.$t("btn-advanced"),
        items: [],
        nameClasses: "group-advanced-name",
        craftItemsCount: 2
      };
      for (let i = 1; i < 50; i++) {
        const index = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
        group.items.push({
          id: i,
          itemSlotClasses: "lunar-lantern-slot",
          iconClasses: "basic-lantern" + index,
          isCustomElement: true,
          // template: 2928
          count: index,
          group: ITEM_GROUP_ADVANCED
          // level: 1,
          // exp: 0,
          // equipped: false,
          // breakLimit: 0,
          // unique: false,
          // rarity: "epic",
          // element: "physical",
          // index: 13
        });
      }
      groups.push(group);

      // expert
      group = {
        id: ITEM_GROUP_EXPERT,
        name: this.$t("button-expert"),
        items: [],
        nameClasses: "group-expert-name",
        craftItemsCount: 10
      };
      for (let i = 1; i < 50; i++) {
        const index = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
        group.items.push({
          id: i,
          itemSlotClasses: "lunar-lantern-slot",
          iconClasses: "basic-lantern" + index,
          isCustomElement: true,
          // template: 2928
          count: index,
          group: ITEM_GROUP_EXPERT
          // level: 1,
          // exp: 0,
          // equipped: false,
          // breakLimit: 0,
          // unique: false,
          // rarity: "epic",
          // element: "physical",
          // index: 13
        });
      }
      groups.push(group);

      return groups;
    },
    // items() {
    //   const items = [];

    //   for (let i = 1; i < 100; i++) {
    //     const index = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
    //     items.push({
    //       id: i,
    //       itemSlotClasses: "lunar-lantern-slot",
    //       iconClasses: "basic-lantern" + index,
    //       isCustomElement: true,
    //       // template: 2928
    //       count: index
    //       // level: 1,
    //       // exp: 0,
    //       // equipped: false,
    //       // breakLimit: 0,
    //       // unique: false,
    //       // rarity: "epic",
    //       // element: "physical",
    //       // index: 13
    //     });
    //   }

    //   return items;
    // },
    selectedItemIds() {
      return this.selectedItems.map(({ id }) => id);
    },
    selectedGroup() {
      if (!this.selectedGroupId) {
        return null;
      }

      return this.itemGroups.find(({ id }) => id === this.selectedGroupId);
    }
  },
  methods: {
    handleHint(item) {
      if (this.selectedGroupId && item.group !== this.selectedGroupId) {
        return;
      }
      // if (this.selectedItems.length <= 0) {
      //   this.selectedGroupId = item.group;
      // }
      const index = this.selectedItems.findIndex(({ id }) => id === item.id);
      // if (index >= 0) {
      //   this.selectedItems.splice(index, 1);
      //   this.selectedItemId = null;
      // } else if (this.selectedItems.length < this.maxSelectedItems) {
      //   this.selectedItems.push(item);
      //   this.selectedItemId = item.id;
      // } else {
      //   this.selectedItemId = null;
      // }
      if (
        index < 0 &&
        (!this.selectedGroup ||
          (this.selectedGroup &&
            this.selectedItems.length < this.selectedGroup.craftItemsCount))
      ) {
        this.selectedItems.push(item);
        this.selectedItemId = item.id;
        this.selectedGroupId = item.group;
        return;
      }
      this.selectedItemId = null;
    },

    itemRemovedHandler(item) {
      const index = this.selectedItems.findIndex(({ id }) => id === item.id);
      this.selectedItems.splice(index, 1);
      this.selectedItemId = null;
      if (this.selectedItems.length <= 0) {
        this.selectedGroupId = null;
      }
    },

    itemsResetHandler() {
      this.selectedItems = [];
      this.selectedItemId = null;
    }
  }
};
</script>
<style scoped lang="less">
.v-bar-fix {
  & > div {
    overflow: auto !important;
  }
}
.element-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  justify-items: center;
  grid-gap: 2rem;
}
.group-name {
  background: rgba(0, 0, 0, 0.5);
}
.group-advanced-name {
  color: #09fa08;
}
.group-expert-name {
  color: #fe55ff;
}
</style>
