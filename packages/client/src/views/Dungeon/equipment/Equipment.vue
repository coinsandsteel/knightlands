<template>
  <div class="flex flex-center flex-column">
    <div class="flex flex-center" v-if="!showSwap">
      <EquipmentSlot class="margin-right-2" :id="user.mHand" />
      <EquipmentSlot :id="user.oHand" />
    </div>

    <div class="flex flex-center flex-column width-100" v-else>
      <div class="line width-100">
        <EquipmentSlot
          v-for="item in mainHands"
          :key="item"
          :id="item"
          @click="selectMain"
          :selected="mainSelected == item"
        />
      </div>

      <div class="line width-100 margin-top-3">
        <EquipmentSlot
          v-for="item in offHands"
          :key="item"
          :id="item"
          @click="selectOff"
          :selected="offSelected == item"
        />
      </div>
    </div>

    <div class="flex flex-center margin-top-3">
      <CustomButton
        type="yellow"
        class=" uppercase"
        @click="swap"
        minWidth="20rem"
        >{{ $t("swap") }}</CustomButton
      >

      <CustomButton type="red" v-if="showSwap" @click="cancel" minWidth="20rem">
        {{ $t("btn-cancel") }}
      </CustomButton>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import DungeonItems from "@/metadata/halloween/dungeon_items.json";
import EquipmentSlot from "./EquipmentSlot.vue";
import { mapState } from "vuex";
import Rarity from "@/../../knightlands-shared/rarity";

export default {
  components: { EquipmentSlot, CustomButton },
  data: () => ({
    showSwap: false,
    mainSelected: 0,
    offSelected: -1
  }),
  computed: {
    ...mapState({
      user: state => state.dungeon.user
    }),
    mainHands() {
      return this.getItems(false);
    },
    offHands() {
      return this.getItems(true);
    }
  },
  methods: {
    cancel() {
      this.showSwap = false;
    },
    async swap() {
      if (this.showSwap) {
        // swap
        await this.$store.dispatch("dungeon/equip", {
          mHand: this.mainSelected,
          oHand: this.offSelected
        });
      } else {
        this.mainSelected = this.user.mHand;
        this.offSelected = this.user.oHand;
      }

      this.showSwap = !this.showSwap;
    },
    selectMain(id) {
      if (!id) {
        return;
      }
      this.mainSelected = id;
    },
    selectOff(id) {
      if (!id) {
        return;
      }
      this.offSelected = id;
    },
    getItems(defensive) {
      const items = this.user.equip.filter(
        x => DungeonItems[x].defensive == defensive
      );
      // select best rarity
      const result = new Array(3);

      for (const id of items) {
        const currentItemData = DungeonItems[id];
        const prevItem = result[currentItemData.move];

        let replace = true;

        if (prevItem) {
          const prevRarity = DungeonItems[prevItem].rarity;
          const currentRarity = currentItemData.rarity;

          if (prevRarity == Rarity.Rare && currentRarity != Rarity.Epic) {
            replace = false;
          }
        }

        if (replace) {
          result[currentItemData.move] = id;
        }
      }
      return result;
    }
  }
};
</script>

<style lang="less" scoped>
.line {
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 1fr;
  column-gap: 2rem;
}
</style>
