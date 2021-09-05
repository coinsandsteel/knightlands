<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <SoundEffect ref="fx" :files="['item_lvl_up']" channel="fx" />
    <div
      class="padding-top-1 dummy-height full-flex flex flex-column flex-no-wrap"
      v-if="item"
    >
      <ItemInfo
        :item="item"
        :onlyStats="true"
        :lootProps="{ onlyIcon: true }"
        class="width-100"
      >
        <!-- Add leveling bar -->
        <template v-slot:level-bar>
          <div class="width-100 flex flex-center flex-no-wrap">
            <div
              class="text-align-left font-size-20 flex flex-no-wrap flex-center margin-right-2"
            >
              <span>
                {{ $t("level", { lvl: item.level }) }}
              </span>
              <span
                class="margin-left-half margin-right-half right-arrow"
              ></span>
              <span>
                {{ level }}
              </span>
            </div>
            <progress-bar
              v-model="item.exp"
              class="full-flex"
              height="2rem"
              barType="green"
              barType2="yellow"
              :value2="futureExp"
              :maxValue="nextExp"
              :hideMainBar="item.level != level"
            ></progress-bar>
          </div>
        </template>

        <!-- replace stats -->
        <template v-slot:stats>
          <ItemStatsUpgraded :item="item" :nextLevel="level" />
        </template>
      </ItemInfo>
      <!-- Upgrade Materials -->
      <template v-if="notAtMaxLevel">
        <Title class="margin-top-1 margin-bottom-1">{{
          $t("upgrade-materials")
        }}</Title>
        <div class="flex full-flex dummy-height">
          <div
            class="flex flex-full flex-column flex-center"
            v-if="Object.keys(upgradeMaterials).length == 0"
          >
            <span
              class="font-size-20 font-weight-900 font-outline margin-bottom-2"
              >{{ $t("no-lvl-mat") }}</span
            >
            <CustomButton type="grey" @click="goToChests">{{
              $t("goto-ch")
            }}</CustomButton>
          </div>
          <div v-else v-bar class="width-100 height-100 dummy-height">
            <div>
              <div class="material-container dummy-height">
                <loot
                  v-for="(mat, index) in upgradeMaterials"
                  :key="mat.id"
                  :item="mat"
                  @hint="selectMaterial(index)"
                  :selected="index == selectedMaterial"
                  :locked="lockRest"
                >
                  <div
                    class="absolute-stretch select-overlay flex flex-center"
                    v-if="materialsCount[index]"
                  >
                    <span class="font-size-22 font-outline font-weight-900"
                      >x{{ materialsCount[index] }}</span
                    >
                  </div>
                </loot>
              </div>
            </div>
          </div>
        </div>

        <div class="flex margin-top-1 flex-space-evenly width-100">
          <NumericValue
            class="margin-bottom-2"
            :value="currentMaterialCount"
            :decreaseCondition="currentMaterialCount >= 1"
            :increaseCondition="canIncreaseMaterial"
            @inc="incMaterialCount"
            @dec="decMaterialCount"
          ></NumericValue>

          <CustomButton
            type="green"
            :disabled="!canUpgrade"
            @click="confirmUpgrade"
            >{{ $t("btn-confirm") }}</CustomButton
          >

          <CustomButton
            type="grey"
            :disabled="!canUpgrade"
            @click="resetSelection"
            >{{ $t("btn-reset") }}</CustomButton
          >
        </div>
      </template>

      <div v-show="!notAtMaxLevel" class="flex flex-column flex-center">
        <span class="color-panel-2 font-size-20 yellow-title">{{
          $t("lvl-max-level")
        }}</span>

        <CustomButton
          v-if="returnTo"
          class="margin-top-2"
          type="grey"
          @click="returnBack"
          >{{ $t("btn-return") }}</CustomButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import SoundEffect from "@/components/SoundEffect.vue";
import AppSection from "@/AppSection.vue";
import ItemInfo from "@/components/ItemInfo.vue";
import NumericValue from "@/components/NumericValue.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import Loot from "@/components/Loot.vue";
import CustomButton from "@/components/Button.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import ItemStatsUpgraded from "@/components/Item/ItemStatsUpgraded.vue";
import Title from "@/components/Title.vue";
import InventoryListenerMixin from "@/components/InventoryListenerMixin.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

export default {
  mixins: [
    AppSection,
    PromptMixin,
    InventoryListenerMixin,
    NetworkRequestErrorMixin
  ],
  props: ["itemId"],
  components: {
    SoundEffect,
    ItemInfo,
    ProgressBar,
    Loot,
    CustomButton,
    Title,
    ItemStatsUpgraded,
    NumericValue
  },
  created() {
    this.title = "window-upgrade-item";
    this.$options.useRouterBack = true;
  },
  activated() {
    this.init();
  },
  deactivated() {
    this.cancelUpgrading();
  },
  data: () => ({
    newItemId: 0,
    selectedOption: 0,
    item: null,
    futureExp: 0,
    currentExp: 0,
    selectedMaterials: {},
    selectedMaterial: 0,
    materialsCount: {},
    upgradeMaterials: []
  }),
  watch: {
    itemId() {
      this.init();
    }
  },
  methods: {
    goToChests() {
      this.$router.push({ name: "chests" });
    },
    resetSelection() {
      this.materialsCount = {};
    },
    decMaterialCount() {
      this.materialsCount[this.selectedMaterial]--;
    },
    incMaterialCount() {
      if (!this.materialsCount[this.selectedMaterial]) {
        this.$set(this.materialsCount, this.selectedMaterial, 1);
      } else {
        this.materialsCount[this.selectedMaterial]++;
      }
    },
    returnBack() {
      this.$router.replace({
        path: this.$route.query.returnTo,
        query: this.$route.query
      });
    },
    init() {
      this.cancelUpgrading();
      this.prepareItemForUpgrading();
      this.updateMaterialList();
    },
    cancelUpgrading() {
      if (this.item && !this.item.equipped && !this.item.unique) {
        this.$game.inventory.increaseStack(this.item);
      }

      this.item = null;
    },
    prepareItemForUpgrading() {
      let item = this.$game.inventory.getItem(this.itemId);
      if (item && !item.equipped && !item.unique) {
        item = this.$game.inventory.decreaseStackAndReturn(this.itemId);
      }

      if (item) {
        this.currentExp = item.exp;
        this.futureExp = item.exp;

        this.item = item;
      }
    },
    selectMaterial(index) {
      this.selectedMaterial = index;
      if (!this.materialsCount[index]) {
        this.incMaterialCount();
      } else {
        this.materialsCount[index] = 0;
        this.selectedMaterial = 0;
      }
    },
    async confirmUpgrade() {
      const confirmation = await this.showPrompt(
        this.$t("upgrade-confirm-title"),
        this.$t("upgrade-confirm-text"),
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
        ]
      );

      if (confirmation == "ok") {
        await this.upgradeItem();
      }
    },
    async upgradeItem() {
      let materials = {};
      for (const i in this.materialsCount) {
        materials[this.upgradeMaterials[i].id] = this.materialsCount[i];
      }

      let newItemId = await this.performRequest(
        this.$game.upgradeItem(this.itemId, materials)
      );

      if (newItemId != this.itemId) {
        this.newItemId = newItemId;
      } else {
        this.prepareItemForUpgrading();
        this.updateMaterialList();
      }

      this.$refs.fx.play();
    },
    updateMaterialList() {
      this.$set(this, "selectedMaterials", {});
      this.upgradeMaterials = [];
      this.materialsCount = {};
      this.selectedMaterial = 0;

      if (!this.item) {
        return;
      }

      let upgradeMeta = this.$game.itemsDB.getUpgradeMeta(this.item);
      if (!upgradeMeta) {
        return;
      }

      let materials = [];
      if (upgradeMeta.experienceMaterials) {
        upgradeMeta.experienceMaterials.forEach(m => {
          let materialItem = this.$game.inventory.getItemByTemplate(m.itemId);
          if (materialItem.id != -1) {
            materials.push(materialItem);
          }
        });
      }

      if (upgradeMeta.slotsMaterials) {
        let hash = {};
        upgradeMeta.slotsMaterials.forEach(slot => (hash[slot] = true));
        materials = materials.concat(
          this.$game.inventory.filterItems(x => {
            if ((x.unique && x.id == this.item.id) || x.equipped) {
              return false;
            }
            return hash[this.$game.itemsDB.getSlot(x.template)];
          })
        );
      }

      this.upgradeMaterials = materials;
    },
    handleInventoryChanged() {
      if (this.newItemId != 0) {
        this.item = null;
        this.$router.replace({
          name: "upgrade-item",
          params: { itemId: this.newItemId }
        });
        this.newItemId = 0;
      }
    }
  },
  computed: {
    canIncreaseMaterial() {
      if (!this.upgradeMaterials[this.selectedMaterial]) {
        return false;
      }
      return (
        this.currentMaterialCount <
          this.upgradeMaterials[this.selectedMaterial].count && !this.lockRest
      );
    },
    currentMaterialCount() {
      return this.materialsCount[this.selectedMaterial] || 0;
    },
    returnTo() {
      return !!this.$route.query.returnTo;
    },
    maxLevel() {
      let holderLevel = this.$game.character.level;
      if (this.item.holder != -1) {
        const unit = this.$game.army.getUnit(this.item.holder);
        if (unit) {
          holderLevel = unit.level;
        }
      }

      return Math.min(
        this.$game.itemsDB.getMaxLevel(this.item),
        Math.floor(holderLevel / 2)
      );
    },
    notAtMaxLevel() {
      return this.item.level < this.maxLevel;
    },
    totalMaterials() {
      return this.selectedMaterialsAsArray.length;
    },
    selectedMaterialsAsArray() {
      const materials = [];
      for (let i in this.materialsCount) {
        materials.push(i);
      }
      return materials;
    },
    canUpgrade() {
      return this.totalMaterials > 0 && this.notAtMaxLevel;
    },
    optionFactor() {
      let optionFactor = 1;
      if (this.selectedOption == 1) {
        optionFactor = 5;
      } else if (this.selectedOption == 2) {
        optionFactor = 25;
      }

      if (this.totalMaterials == 1) {
        if (optionFactor > this.selectedMaterialsAsArray[0].count) {
          optionFactor = this.selectedMaterialsAsArray[0].count;
        }
      } else if (this.totalMaterials > 1) {
        // multiselect always 1 item selected
        optionFactor = 1;
      }

      return optionFactor;
    },
    lockRest() {
      return this.level == this.maxLevel;
    },
    level() {
      let materialExp = 0;

      if (this.totalMaterials > 0) {
        for (let i = 0; i < this.selectedMaterialsAsArray.length; i++) {
          const index = this.selectedMaterialsAsArray[i];
          const material = this.upgradeMaterials[index];
          materialExp +=
            this.$game.itemsDB.getMaterialExp(this.item, material) *
            this.materialsCount[index];
        }
      }

      let level = this.item.level;
      let exp = this.item.exp + materialExp * this.optionFactor;
      let maxLevel = this.maxLevel;

      if (maxLevel <= level) {
        exp = this.item.exp;
      }

      while (maxLevel > level && exp >= this.$game.itemsDB.getNextExp(level)) {
        exp -= this.$game.itemsDB.getNextExp(level);
        level++;
      }

      this.futureExp = Math.round(exp);

      return level;
    },
    nextExp() {
      return this.$game.itemsDB.getNextExp(this.level);
    }
  }
};
</script>

<style lang="less" scoped>
.material-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  justify-items: center;
  row-gap: 0.5rem;
  column-gap: 0.5rem;
}

.progress-bar-margin {
  margin-top: 1rem;
  margin-left: 10rem;
}

.futureExp {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.select-overlay {
  background-color: #102a2491;
  border-radius: 2px;
}
</style>
