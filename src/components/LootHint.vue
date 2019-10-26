<template>
  <user-dialog
    :title="$t(template.caption)"
    @close="handleClose"
    :titleClass="`rarity-${template.rarity}`"
    :compact="true"
    :hideMask="hideMask"
  >
    <template v-slot:content>
      <ItemInfo :item="item" :hideTitle="true">
        <template v-slot:afterType v-if="isEquipment">
          <div class="flex flex-center">
            <span class="star" :class="{active: stars >= 1}"></span>
            <span class="star margin-right-auto" :class="{active: stars >= 2}"></span>
            <span class="arrow-up" v-if="stars<2" @click="upgradeItem"></span>
          </div>
        </template>

        <template v-slot:beforeStats>
          <div class="progress-bar-margin">
            <div
              v-if="isEquipment && item.level"
              class="text-align-left font-size-20 margin-bottom-half"
            >
              <span>Lvl: {{item.level}}</span>
            </div>

            <progress-bar
              class="margin-top-small"
              v-model="item.exp"
              height="2rem"
              width="70%"
              barType="green"
              barClasses="margin-right-auto"
              :maxValue="nextExp"
              :plusButton="item.equipped?'':'green'"
              @refill="handleLevelProgressClick"
              v-if="isEquipment"
            ></progress-bar>
          </div>
        </template>
      </ItemInfo>
    </template>

    <template v-slot:footer>
      <div class="flex width-100 flex-space-evenly" v-if="showButtons">
        <custom-button
          type="yellow"
          v-if="actions.equip && equip && isEquipment"
          class="common-btn center"
          @click="handleClose('equip')"
        >{{$t('btn-equip')}}</custom-button>

        <custom-button
          v-if="actions.equip && unequip && isEquipment"
          type="grey"
          class="common-btn center"
          @click="handleClose('unequip')"
        >{{$t('btn-unequip')}}</custom-button>

        <CustomButton type="yellow" v-if="isBox" @click="handleClose('open')">{{$t('btn-open-box')}}</CustomButton>

        <CustomButton
          type="yellow"
          v-else-if="isConsumable"
          @click="handleClose('use')"
        >{{$t('btn-use-consumable')}}</CustomButton>

        <custom-button
          type="yellow"
          v-for="(btn, index) in buttons"
          :key="index"
          :class="btn.type"
          @click="handleClose(btn.response)"
        >{{$t(btn.title)}}</custom-button>
      </div>
    </template>
  </user-dialog>
</template>

<script>
import CustomButton from "./Button.vue";
import ProgressBar from "./ProgressBar.vue";
import UserDialog from "./UserDialog.vue";
import ItemInfo from "@/components/ItemInfo.vue";
const ItemType = require("@/../knightlands-shared/item_type");
import Stat from "@/../knightlands-shared/character_stat";
const ItemActions = require("@/../knightlands-shared/item_actions");

// Button object
// { type:"yellow", title, response }

export default {
  props: {
    item: {
      type: Object
    },
    equip: {
      type: Boolean
    },
    unequip: {
      type: Boolean
    },
    actions: {
      type: Object,
      default: () => ({
        equip: true
      })
    },
    hideMask: Boolean,
    buttons: Array,
    showButtons: Boolean
  },
  components: {
    CustomButton,
    ProgressBar,
    UserDialog,
    ItemInfo,
    Loot: () => import("./Loot.vue")
  },
  computed: {
    isEquipment() {
      return this.template.type == ItemType.Equipment;
    },
    isConsumable() {
      return this.template.type == ItemType.Consumable;
    },
    isBox() {
      if (!this.isConsumable) {
        return false;
      }

      return this.template.action.action == ItemActions.OpenBox;
    },
    template() {
      return this.$game.itemsDB.getTemplate(this.item.template);
    },
    nextExp() {
      return this.$game.itemsDB.getNextExp(this.item.level);
    },
    maxLevel() {
      return this.$game.itemsDB.getMaxLevel(this.item);
    },
    type() {
      let type = this.template.type;
      if (this.template.type == ItemType.Equipment) {
        type = this.template.equipmentType;
      }

      return `${this.$t(this.template.rarity)} ${this.$t(type)}`;
    },
    stats() {
      return this.$game.itemsDB.getStats(this.item);
    },
    stars() {
      return this.item.breakLimit;
    }
  },
  methods: {
    upgradeItem() {
      this.handleClose();
      this.$router.push({ name: "unbind-item", params: { itemId: this.item.id } });
    },
    handleLevelProgressClick() {
      if (this.item.equipped) {
        return;
      }
      
      this.handleClose();
      this.$router.push({
        name: "upgrade-item",
        params: { itemId: this.item.id }
      });
    },
    handleClose(response) {
      if (this.$close) {
        this.$close(response);
      } else {
        this.$emit("close", this.item, response);
      }
    },
    statName(statId) {
      return Stat.toString(statId);
    }
  }
};
</script>

<style lang="less" scoped>
.stats {
  align-items: flex-start;
  margin-top: 1rem;
  padding-top: 1rem;

  > div {
    width: 40%;
  }
}

.loot-icon {
  margin-right: 10px;
}

.progress-bar-margin {
  margin-top: 1rem;
  margin-left: 10rem;
}

.info {
  justify-content: space-between;
}

.loot-desc {
  margin-top: 1.5rem;
  margin-left: 0.5rem;
  color: #dcb850;
}

.stat-container {
  margin-top: 0.4rem;
}

.hint-header {
  border-bottom: 0.2rem solid #949a8e;
  padding-bottom: 1rem;
  border-image-outset: calc(1rem + 1px);
  border-image-width: 0 0 0.8rem 0;
}
</style>

