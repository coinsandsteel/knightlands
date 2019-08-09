<template>
  <user-dialog
    :title="template.caption"
    @close="$close"
    :titleClass="`rarity-${template.rarity}`"
    :compact="true"
  >
    <template v-slot:content>
      <div class="info flex flex-column">
        <div class="flex hint-header panel-light">
          <loot class="loot-icon" :item="item" :interactible="false"></loot>
          <div class="flex flex-column font-size-25 full-flex">
            <div class="text-align-left">
              <span>{{type}}</span>
            </div>
            <div v-if="isEquipment" class="text-align-left font-size-20">
              <span>Lvl: {{item.level}}</span>
            </div>
            <progress-bar
              class="margin-top-small"
              v-model="item.exp"
              height="2rem"
              width="80%"
              barType="yellow"
              :maxValue="nextExp"
              plusButton="green"
              v-if="isEquipment"
            ></progress-bar>
          </div>
        </div>
        <div class="stats flex flex-center font-size-25 flex-space-evenly">
          <div class="flex flex-column flex-item-end text-align-right">
            <div
              v-for="(statValue, statId) in stats"
              :key="statId"
              class="stat-container width-100"
            >{{statId}}</div>
          </div>
          <div class="flex flex-column text-align-left">
            <div
              v-for="(statValue, statId) in stats"
              :key="statId"
              class="stat-container width-100"
            >{{statValue}}</div>
          </div>
        </div>
      </div>

      <span class="loot-desc" v-if="item.description">{{template.description}}</span>
    </template>
    <template v-slot:footer>
      <div class="flex">
        <custom-button
          v-if="actions.equip && equip && isEquipment"
          class="common-btn center"
          @click="$close('equip')"
        >Equip</custom-button>
        <custom-button
          v-if="actions.equip && unequip && isEquipment"
          type="grey"
          class="common-btn center"
          @click="$close('unequip')"
        >Unequip</custom-button>
      </div>
    </template>
  </user-dialog>
</template>

<script>
import CustomButton from "./Button.vue";
import ProgressBar from "./ProgressBar.vue";
import UserDialog from "./UserDialog.vue";
const ItemType = require("@/../knightlands-shared/item_type");
import Stat from "@/../knightlands-shared/character_stat.js";

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
    }
  },
  components: {
    CustomButton,
    ProgressBar,
    UserDialog,
    Loot: () => import("./Loot.vue")
  },
  computed: {
    isEquipment() {
      return this.template.type == ItemType.Equipment;
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

      return `${this.template.rarity} ${type}`;
    },
    stats() {
      return this.$game.itemsDB.getStats(this.item);
    }
  },
  methods: {
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

.info {
  margin-top: 1.25rem;
  justify-content: space-between;
}

.loot-desc {
  margin-top: 1.5rem;
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

