<template>
  <div class="padding-1 dummy-height full-flex">
    <div class="padding-1 dummy-height full-flex flex flex-center flex-column panel" v-if="item">
      <ItemInfo :item="item" :onlyStats="true" :lootProps="{onlyIcon:true}">
        <!-- Add leveling bar -->
        <template v-slot:beforeStats>
          <div class="progress-bar-margin">
            <div class="text-align-left font-size-20">
              <span class="flex flex-center flex-start margin-bottom-half">Lvl: {{item.level}} <span class="margin-left-half margin-right-half right-arrow"></span> {{level}}</span>
            </div>
            <div class="relative">
              <progress-bar
                v-model="futureExp"
                height="2rem"
                width="70%"
                barType="green"
                :maxValue="nextExp"
                :hideValues="item.level == level"
              ></progress-bar>

              <progress-bar
                v-model="item.exp"
                v-show="item.level == level"
                height="2rem"
                width="70%"
                barType="yellow"
                :maxValue="nextExp"
                :hideBackground="true"
                class="absolute-stretch"
              ></progress-bar>
            </div>
          </div>
        </template>

        <!-- replace stats -->
        <template v-slot:stats>
          <div class="item-info-stats margin-bottom-2 margin-top-1 flex flex-center font-size-20 flex-space-evenly">
            <div class="flex width-40 flex-column flex-item-end text-align-right">
              <div
                v-for="(statValue, statId) in stats"
                :key="statId"
                class="margin-bottom-half width-100"
              >{{$t(statId)}}</div>
            </div>
            <div class="flex width-40 flex-column text-align-left">
              <div
                v-for="(statValue, statId) in stats"
                :key="statId"
                class="margin-bottom-half flex flex-center flex-start width-100"
              >{{statValue}}<span class="margin-left-half margin-right-half right-arrow"></span>{{futureStats[statId]}}</div>
            </div>
          </div>
        </template>
      </ItemInfo>

      <!-- Upgrade Materials -->
      <span class="margin-top-1 title font-size-20">{{$t("upgrade-materials")}}</span>
      <div class="flex full-flex width-100 dummy-height">
        <div v-bar class="width-100 height-100 dummy-height">
          <LootContainer :items="upgradeMaterials" @hint="selectMaterial" :selectSlots="true"></LootContainer>
        </div>
      </div>

      <div class="flex margin-top-1 flex-space-evenly width-100">
        <div class="flex flex-center flex-no-wrap font-size-20 font-weight-700">
          <CustomButton type="grey" :mini="true" :lockPressed="selectedOption == 0" @click="selectedOption=0">x1</CustomButton>
          <CustomButton type="grey" :mini="true" :lockPressed="selectedOption == 1" @click="selectedOption=1">x5</CustomButton>
          <CustomButton type="grey" :mini="true" :lockPressed="selectedOption == 2" @click="selectedOption=2">x25</CustomButton>
        </div>

        <CustomButton type="green" :disabled="!canUpgrade" @click="confirmUpgrade">{{$t("confirm")}}</CustomButton>
      </div>
      
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import ItemInfo from "@/components/ItemInfo.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import LootContainer from "@/components/LootContainer.vue"
import CustomButton from "@/components/Button.vue"
import PromptMixin from "@/components/PromptMixin.vue"

const Rarity = require("@/../knightlands-shared/rarity");
const ItemType = require("@/../knightlands-shared/item_type");

export default {
  mixins: [AppSection, PromptMixin],
  props: ["itemId"],
  components: { ItemInfo, ProgressBar, LootContainer, CustomButton },
  created() {
    this.title = "window-upgrade-item";
    this.$options.useRouterBack = true;
  },
  activated() {
    this.prepareItemForUpgrading();
    this.updateMaterialList();
  },
  mounted() {
    // this.prepareItemForUpgrading();
  },
  deactivated() {
    this.cancelUpgrading();
  },
  data: ()=>({
    selectedOption: 0,
    item: null,
    futureExp: 0,
    currentExp: 0,
    selectedMaterial: null,
    upgradeMaterials: []
  }),
  watch: {
    itemId(_, oldItemId) {
      this.cancelUpgrading();
      this.prepareItemForUpgrading();
      this.updateMaterialList();
    }
  },
  methods: {
    cancelUpgrading() {
      if (this.item && !this.item.unique) {
        this.$game.inventory.increaseStack(this.item);
      }

      this.item = null;
    },
    prepareItemForUpgrading() {
      let item = this.$game.inventory.getItem(this.itemId);
      if (item) {
        if (!item.unique) {
          item = this.$game.inventory.decreaseStackAndReturn(this.itemId);
        }
        
        this.currentExp = item.exp;
        this.futureExp = item.exp;

        this.item = item;
      }
    },
    selectMaterial(material) {
      this.selectedMaterial = material;
    },
    async confirmUpgrade() {
      let confirmation = "ok";

      let materialTemplate = this.$game.itemsDB.getTemplate(this.selectedMaterial);
      if (materialTemplate.type == ItemType.Equipment && materialTemplate.rarity ) {
        let materialName = this.$t(this.$game.itemsDB.getName(this.selectedMaterial));
        confirmation = await this.showPrompt(this.$t("upgrade-confirm-title"), this.$t("upgrade-confirm-text", {item: materialName, rarity:materialTemplate.rarity, count:this.optionFactor}), 
        [
          {
            type: "red",
            title: this.$t("btn-cancel"),
            response: false
          },
          {
            type: "green",
            title: this.$t("btn-ok"),
            response: "ok"
          }
        ]);
      }

      if (confirmation == "ok") {
        await this.upgradeItem();
      }
    },
    async upgradeItem() {
      let newItemId = await this.$game.upgradeItem(this.itemId, this.selectedMaterial.id, this.optionFactor);
      if (newItemId != this.itemId) {
        this.$router.replace({ name: "upgrade-item", params: { itemId: newItemId } });
      } else {
        let newItem = this.$game.inventory.getItem(newItemId);
        this.item = newItem;
      }

      // if material was removed - remove it from material list too
      if (!this.$game.inventory.hasItem(this.selectedMaterial.id, 1)) {
        this.upgradeMaterials = this.upgradeMaterials.filter(x=>x != this.selectedMaterial);
        this.selectedMaterial = null;
      }
    },
    updateMaterialList() {
      this.upgradeMaterials = [];

      if (!this.item) {
        return;
      }

      let upgradeMeta = this.$game.itemsDB.getUpgradeMeta(this.item);
      if (!upgradeMeta) {
        return;
      }

      let materials = [];
      if (upgradeMeta.experienceMaterials) {
        upgradeMeta.experienceMaterials.forEach(m=>{
          let materialItem = this.$game.inventory.getItemByTemplate(m.itemId);
          if (materialItem) {
            materials.push(materialItem);
          }
        });
      }

      if (upgradeMeta.slotsMaterials) {
        let hash = {};
        upgradeMeta.slotsMaterials.forEach(slot=>hash[slot] = true);
        materials = materials.concat(this.$game.inventory.filterItems(x=>{
          if (x.unique && x.id == this.item.id) {
            return false;
          }

          return hash[this.$game.itemsDB.getSlot(x.template)];
        }));
      }

      this.upgradeMaterials = materials;
    }
  },
  computed: {
    canUpgrade() {
      return this.selectedMaterial && this.item.level < this.$game.itemsDB.getMaxLevel(this.item);
    },
    stats() {
      return this.$game.itemsDB.getStats(this.item);
    },
    futureStats() {
      return this.$game.itemsDB.getStats(this.item, this.level);
    },
    optionFactor() {
      let optionFactor = 1;
      if (this.selectedOption == 1) {
        optionFactor = 5;
      } else if (this.selectedOption == 2) {
        optionFactor = 25;
      }

      if (this.selectedMaterial) {
        if (optionFactor > this.selectedMaterial.count) {
          optionFactor = this.selectedMaterial.count;
        }
      }

      return optionFactor;
    },
    level() {
      let materialExp = 0;

      if (this.selectedMaterial) {
        materialExp = this.$game.itemsDB.getMaterialExp(this.item, this.selectedMaterial);
      }

      let level = this.item.level;
      let exp = this.item.exp + materialExp * this.optionFactor;
      let maxLevel = this.$game.itemsDB.getMaxLevel(this.item);

      if (maxLevel <= level) {
        exp = this.item.exp;
      }

      while (maxLevel > level && exp >= this.$game.itemsDB.getNextExp(level)) {
        exp -= this.$game.itemsDB.getNextExp(level);
        level++;
      }

      this.futureExp = exp;

      return level;
    },
    nextExp() {
      return this.$game.itemsDB.getNextExp(this.level);
    }
  }
};
</script>

<style lang="less" scoped>
.progress-bar-margin {
  margin-top: 1rem;
  margin-left: 10rem;
}

.futureExp {
  position: absolute;
  left: 0;
  top: 0;
  right:0;
  bottom: 0;
}

</style>