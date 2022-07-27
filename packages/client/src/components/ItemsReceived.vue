<template>
  <UserDialog
    :title="$t('box-opened-title')"
    @close="$close"
    :class="{ 'over-top': !drown }"
  >
    <template v-slot:content>
      <div class="flex flex-column flex-items-center width-100">
        <IconWithValue
          class="margin-bottom-1"
          valueClass="font-size-20 digit-font"
          iconClass="icon-dkt"
          v-if="dkt"
          >{{ dkt }}</IconWithValue
        >

        <IconWithValue
          class="margin-bottom-1"
          valueClass="font-size-20 digit-font"
          iconClass="icon-premium"
          v-if="hard"
          >{{ hard }}</IconWithValue
        >

        <IconWithValue
          class="margin-bottom-1"
          valueClass="font-size-20 digit-font"
          iconClass="icon-gold"
          v-if="soft"
          >{{ soft }}</IconWithValue
        >

        <IconWithValue
          class="margin-bottom-1"
          valueClass="font-size-20 digit-font"
          iconClass="icon-exp"
          v-if="exp"
          >{{ exp }}</IconWithValue
        >

        <MarchGold v-if="marchGold" :value="marchGold" />
        <AprilGold v-if="aprilGold" :value="aprilGold" />
        <AprilTickets v-if="aprilTicket" :value="aprilTicket" />
        <BattleUnitList v-if="battleUnits" :units="battleUnits" />

        <div
          class="flex flex-center flex-column margin-top-3"
          v-if="items.length > 0"
        >
          <div class="flex flex-center reward-loot">
            <loot
              v-for="item in items"
              :item="item.item"
              :quantity="item.quantity"
              :key="item.item"
              @hint="handleHint"
            ></loot>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CustomButton type="grey" @click="$close">{{
        $t("continue")
      }}</CustomButton>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import CustomButton from "@/components/Button.vue";
import Loot from "@/components/Loot.vue";
import HintHandler from "@/components/HintHandler.vue";
import MarchGold from "@/views/March/MarchGold.vue";
import AprilGold from "@/views/April/AprilGold.vue";
import AprilTickets from "@/views/April/AprilTickets.vue";
import BattleUnitList from "@/views/Battle/BattleUnitList.vue";

export default {
  mixins: [HintHandler],
  components: {
    UserDialog,
    IconWithValue,
    CustomButton,
    Loot,
    MarchGold,
    AprilGold,
    AprilTickets,
    BattleUnitList
  },
  props: [
    "items",
    "soft",
    "hard",
    "exp",
    "dkt",
    "drown",
    "marchGold",
    "aprilGold",
    "aprilTicket",
    "battleUnits"
  ]
};
</script>

<style lang="less" scoped>
.over-top {
  z-index: 200;
}
</style>
