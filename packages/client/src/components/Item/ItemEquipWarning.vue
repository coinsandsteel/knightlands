<template>
  <UserDialog :title="$t('item-equip-warning')" @close="handleClose">
    <template v-slot:content>
      <div class="flex flex-column">
        <div class="flex flex-column flex-center width-100">
          <div
            class="flex flex-items-center flex-no-wrap padding-left-1 padding-right-1 margin-bottom-2"
          >
            <Loot
              :item="item"
              class="margin-right-2"
              :hideQuantity="true"
              :showLevel="true"
              :showEquipped="false"
            ></Loot>
            <span class="font-size-22" :class="rarityClass">{{
              $t(caption)
            }}</span>
          </div>

          <template v-if="equippedOnUnit">
            <span class="font-size-20 font-outline margin-bottom-1">{{
              $t("eq-on-unit")
            }}</span>
            <UnitItem class="unit" :unit="unit" />
          </template>
          <span v-else class="font-size-20 font-outline margin-bottom-1">{{
            $t("eq-on-ch")
          }}</span>
        </div>
      </div>
    </template>

    <template v-slot:footer>
      <div class="flex flex-center">
        <CustomButton type="yellow" @click="handleClose(true)">{{
          $t("btn-equip")
        }}</CustomButton>
        <CustomButton type="red" @click="handleClose(false)">{{
          $t("btn-cancel")
        }}</CustomButton>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import CustomButton from "@/components/Button.vue";
import Loot from "@/components/Loot.vue";
import UnitItem from "@/views/Army/UnitItem.vue";
import ItemGetterMixin from "./ItemGetterMixin.vue";

export default {
  mixins: [ItemGetterMixin],
  components: { UserDialog, CustomButton, UnitItem, Loot },
  computed: {
    unit() {
      return this.$game.army.getUnit(this.item.holder);
    },
    equippedOnUnit() {
      return this.item.holder > 0;
    }
  },
  methods: {
    handleClose(response, ...args) {
      if (this.$close) {
        this.$close(response, ...args);
      } else {
        this.$emit("close", this.item, response, ...args);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.unit {
  width: 10rem;
  height: 10rem;
}
</style>
