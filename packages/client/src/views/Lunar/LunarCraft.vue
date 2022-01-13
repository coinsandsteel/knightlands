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
                    v-for="item in group.items"
                    :id="`i-${item.template}`"
                    :item="item.template"
                    :quantity="item.quantity"
                    :key="`i-${item.template}`"
                    :inventory="false"
                    :selected="selectedItemId === item.id"
                    :itemSlotClasses="'lunar-lantern-slot'"
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
import { mapState } from "vuex";
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
      /* DEMO items structure
      items: [
        {
          id: 1,
          template: 1,
          caption: "l111",
          quantity: 1
        }
      ]*/
    };
  },
  computed: {
    ...mapState({
      items: state => state.lunar.items
    }),
    itemsComputed() {
      // We detect a group by a caption length
      // That's a long story...
      let captionLengthToGroupMap = {
        2: ITEM_GROUP_BASIC,
        4: ITEM_GROUP_ADVANCED,
        7: ITEM_GROUP_EXPERT
      };
      return this.items.map(data => ({
        ...data,
        group: captionLengthToGroupMap[data.caption.length]
      }));
    },
    itemGroups() {
      const groups = [
        {
          id: ITEM_GROUP_BASIC,
          name: this.$t("btn-basic"),
          items: this.itemsComputed.filter(
            item => item.group === ITEM_GROUP_BASIC
          ),
          nameClasses: "group-basic-name",
          craftItemsCount: 3
        },
        {
          id: ITEM_GROUP_ADVANCED,
          name: this.$t("btn-advanced"),
          items: this.itemsComputed.filter(
            item => item.group === ITEM_GROUP_ADVANCED
          ),
          nameClasses: "group-advanced-name",
          craftItemsCount: 2
        },
        {
          id: ITEM_GROUP_EXPERT,
          name: this.$t("button-expert"),
          items: this.itemsComputed.filter(
            item => item.group === ITEM_GROUP_EXPERT
          ),
          nameClasses: "group-expert-name",
          craftItemsCount: 10
        }
      ];

      return groups;
    },
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
