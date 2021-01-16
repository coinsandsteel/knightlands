<template>
  <div
    class="flex flex-items-start padding-left-2 padding-right-2"
    :class="panelClass"
  >
    <div class="flex flex-column flex-center">
      <div class="flex full-flex">
        <span class="font-size-20 font-outline font-weight-900">{{
          $t("mine-rate", { rate: rate, lvl: rateLvl })
        }}</span>
        <template v-if="notAtMaxLvl">
          <span class="nav-arrow margin-left-1 margin-right-1"></span>
          <span class="font-size-20 font-outline font-weight-900">{{
            $t("mine-rate-n", { rate: nextRate, lvl: rateLvl + 1 })
          }}</span>
        </template>
      </div>
      <PurchaseButton
        v-if="notAtMaxLvl"
        type="grey"
        :soft="true"
        class="margin-top-1 flex-self-start"
        @click="$emit('upgrade-rate', idx)"
        :price="ratePrice"
      >
        {{ $t("btn-upgrade") }}
      </PurchaseButton>
      <CustomButton v-else type="grey" :disabled="true">{{
        $t("mine-max")
      }}</CustomButton>
    </div>
  </div>
</template>

<script>
import PurchaseButton from "@/components/PurchaseButton.vue";
import CustomButton from "@/components/Button.vue";
import MinesMeta from "@/mines_meta";
import ItemProperties from "@/../../knightlands-shared/item_properties";

export default {
  props: ["mine", "idx"],
  components: { PurchaseButton, CustomButton },
  computed: {
    notAtMaxLvl() {
      return this.rateLvl < MinesMeta.mines.length;
    },
    cantUpgradeRate() {
      return this.ratePrice > this.$game.softCurrency || !this.notAtMaxLvl;
    },
    panelClass() {
      return this.idx % 2 ? "color-panel-1" : "color-panel-5";
    },
    rateLvl() {
      return this.mine.level + 1;
    },
    ratePrice() {
      const item = this.$game.inventory.getItemByTemplate(MinesMeta.priceCharm);
      const template = this.$game.itemsDB.getTemplate(item);
      let discount = 100;
      if (template) {
        const prop = template.properties.find(
          x =>
            this.$game.itemsDB.getProperty(x).type ==
            ItemProperties.GoldMineUpgradeDiscount
        );

        discount -= item.count * this.$game.itemsDB.getProperty(prop).value;
      }
      return Math.floor(
        (MinesMeta.mines[this.mine.level].price * discount) / 100
      );
    },
    rate() {
      // per second
      return Math.floor(MinesMeta.mines[this.mine.level].rate * 3600);
    },
    nextRate() {
      // per second
      return Math.floor(MinesMeta.mines[this.rateLvl].rate * 3600);
    }
  }
};
</script>
