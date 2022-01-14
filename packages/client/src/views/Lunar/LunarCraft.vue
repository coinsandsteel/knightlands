<template>
  <div class="screen-content">
    <div class="full-flex dummy-height width-100">
      <div
        class="width-100 height-100 dummy-height flex flex-column flex-no-wrap"
      >
        <CraftContainer
          :maxSelectedItems="selectedGroup ? selectedGroup.craftItemsCount : 0"
          :selectedItems="selectedItems"
          :hasCrafted="hasCrafted"
          :isCrafting="isCrafting"
          :selectedGroupId="selectedGroupId"
          :class="
            selectedGroupId ? `craft-container--${selectedGroupId}` : null
          "
          @item-removed="itemRemovedHandler"
          @reset-requested="itemsResetHandler"
          @craft-requested="craftHandler"
        />
        <div class="inv-root dummy-height full-flex width-100 height-100">
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
                    :itemSlotClasses="
                      item && item.itemSlotClasses ? item.itemSlotClasses : null
                    "
                    :iconClasses="
                      item && item.iconClasses ? item.iconClasses : null
                    "
                    :class="{
                      'opacity-50':
                        selectedGroupId && item.group !== selectedGroupId
                    }"
                    @hint="handleHint"
                  />
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- levels switcher -->
    <portal v-if="isActive" to="footer" :slim="true">
      <LunarElementLevelsSwitcher @level-updated="levelUpdatedHandler" />
    </portal>
  </div>
</template>
<script>
import CraftContainer from "@/views/Lunar/CraftContainer.vue";
import LunarElementLevelsSwitcher from "@/views/Lunar/LunarElementLevelsSwitcher.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
import Loot from "@/components/Loot.vue";

const GROUP = {
  BASIC: "basic",
  ADVANCED: "advanced",
  EXPERT: "expert"
};

export default {
  components: {
    CraftContainer,
    Loot,
    LunarElementLevelsSwitcher
  },
  mixins: [ActivityMixin],
  data() {
    return {
      selectedItems: [],
      lootClasses: [],
      selected: {},
      selectedItemId: null,
      maxSelectedItems: 3,
      selectedGroupId: null,
      hasCrafted: false
    };
  },
  computed: {
    itemGroups() {
      const groups = [];

      // basic
      let group = {
        id: GROUP.BASIC,
        name: this.$t("basic-elements"),
        items: [],
        nameClasses: "group-basic-name",
        craftItemsCount: 3
      };
      for (let i = 1; i < 15; i++) {
        const index = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
        group.items.push({
          id: i,
          itemSlotClasses: "lunar-lantern-slot",
          iconClasses: "basic-lantern" + index,
          isCustomElement: true,
          // template: 2928
          count: index,
          group: GROUP.BASIC
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
        id: GROUP.ADVANCED,
        name: this.$t("advanced-elements"),
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
          group: GROUP.ADVANCED
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
        id: GROUP.EXPERT,
        name: this.$t("expert-elements"),
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
          group: GROUP.EXPERT
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
    },

    isCrafting() {
      return this.selectedItemIds.length > 0;
    }

    // nextLevel() {
    //   switch (this.selectedGroupId) {
    //     case GROUP.BASIC:
    //       return GROUP.ADVANCED;
    //     case GROUP.ADVANCED:
    //       return GROUP.EXPERT;
    //     case GROUP.EXPERT:
    //       return "nft";

    //     default:
    //       return null;
    //   }
    // }
  },
  // watch: {
  //   "$route.params.group": {
  //     handler: function(group) {
  //       if (this.$route.name !== "lunar-craft") {
  //         return;
  //       }
  //       if (group && !Object.values(GROUP).includes(group)) {
  //         this.$router.replace({ params: null });
  //         return;
  //       }
  //       // eslint-disable-next-line no-console
  //       console.log("group", group);
  //       // if () {

  //       // }
  //     },
  //     deep: true,
  //     immediate: true
  //   }
  // },
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
      this.selectedGroupId = null;
      this.hasCrafted = false;
    },

    levelUpdatedHandler(level) {
      if (this.selectedGroupId === level) {
        return;
      }
      this.itemsResetHandler();
      this.selectedGroupId = level;
    },

    craftHandler() {
      if (this.hasCrafted) {
        return;
      }

      this.hasCrafted = true;
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
