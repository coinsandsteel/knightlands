<template>
  <div class="screen-content">
    <div class="screen-background"></div>
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
          <div v-bar class="width-100 height-100 dummy-height">
            <div>
              <div class="flex flex-center dummy-height">
                <loot
                  v-for="(mat, index) in upgradeMaterials"
                  :key="mat.id"
                  :item="mat"
                  @hint="toggleMaterial(index)"
                  :locked="!selectedMaterials[index] && lockRest"
                  :selected="selectedMaterials[index]"
                ></loot>
              </div>
            </div>
          </div>
        </div>

        <div class="flex margin-top-1 flex-space-evenly width-100">
          <div
            class="flex flex-center flex-no-wrap font-size-20 font-weight-700"
            v-show="totalMaterials < 2"
          >
            <CustomButton
              type="grey"
              :mini="true"
              :lockPressed="selectedOption == 0"
              @click="selectedOption = 0"
              >x1</CustomButton
            >
            <CustomButton
              type="grey"
              :mini="true"
              :lockPressed="selectedOption == 1"
              @click="selectedOption = 1"
              >x5</CustomButton
            >
            <CustomButton
              type="grey"
              :mini="true"
              :lockPressed="selectedOption == 2"
              @click="selectedOption = 2"
              >x25</CustomButton
            >
          </div>

          <CustomButton
            type="green"
            :disabled="!canUpgrade"
            @click="confirmUpgrade"
            >{{ $t("confirm") }}</CustomButton
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
          type="yellow"
          @click="returnBack"
          >{{ $t("btn-return") }}</CustomButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import ItemInfo from "@/components/ItemInfo.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import Loot from "@/components/Loot.vue";
import CustomButton from "@/components/Button.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import ItemStatsUpgraded from "@/components/Item/ItemStatsUpgraded.vue";
import Title from "@/components/Title.vue";

export default {
  mixins: [AppSection, PromptMixin],
  props: ["itemId"],
  components: {
    ItemInfo,
    ProgressBar,
    Loot,
    CustomButton,
    Title,
    ItemStatsUpgraded
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
    selectedOption: 0,
    item: null,
    futureExp: 0,
    currentExp: 0,
    selectedMaterials: {},
    upgradeMaterials: []
  }),
  watch: {
    itemId() {
      this.init();
    }
  },
  methods: {
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
      if (this.item && !this.item.unique) {
        this.$game.inventory.increaseStack(this.item);
      }

      this.item = null;
    },
    prepareItemForUpgrading() {
      let item = this.$game.inventory.getItem(this.itemId);
      if (item && !item.equipped) {
        if (!item.unique) {
          item = this.$game.inventory.decreaseStackAndReturn(this.itemId);
        }
      }

      if (item) {
        this.currentExp = item.exp;
        this.futureExp = item.exp;

        this.item = item;
      }
    },
    toggleMaterial(index) {
      let state = this.selectedMaterials[index];

      if (this.lockRest && !state) {
        return;
      }

      if (state !== undefined) {
        this.selectedMaterials[index] = !state;
      } else {
        this.$set(this.selectedMaterials, index, true);
      }

      if (!this.selectedMaterials[index]) {
        this.$delete(this.selectedMaterials, index);
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
      let newItemId = await this.$game.upgradeItem(
        this.itemId,
        this.selectedMaterialsAsArray.map(x => x.id),
        this.optionFactor
      );

      if (newItemId != this.itemId) {
        this.item = null;
        this.$router.replace({
          name: "upgrade-item",
          params: { itemId: newItemId }
        });
      } else {
        this.prepareItemForUpgrading();
        this.updateMaterialList();
      }
    },
    updateMaterialList() {
      this.$set(this, "selectedMaterials", {});
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
    }
  },
  computed: {
    returnTo() {
      return !!this.$route.query.returnTo;
    },
    notAtMaxLevel() {
      return this.item.level < this.$game.itemsDB.getMaxLevel(this.item);
    },
    totalMaterials() {
      return this.selectedMaterialsAsArray.length;
    },
    selectedMaterialsAsArray() {
      const materials = [];
      for (let i in this.selectedMaterials) {
        materials.push(this.upgradeMaterials[i]);
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
      return this.level == this.$game.itemsDB.getMaxLevel(this.item);
    },
    level() {
      let materialExp = 0;

      if (this.totalMaterials > 0) {
        for (let i = 0; i < this.selectedMaterialsAsArray.length; i++) {
          const material = this.selectedMaterialsAsArray[i];
          materialExp += this.$game.itemsDB.getMaterialExp(this.item, material);
        }
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
</style>
