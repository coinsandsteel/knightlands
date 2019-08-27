<template>
  <UserDialog :title="$t('raid-reward-title', {boss: $t(bossName)})" @close="$close">
    <template v-slot:content>
      <div class="flex flex-column flex-items-center width-100">
        <IconWithValue
          class="margin-bottom-1"
          valueClass="font-size-20 digit-font"
          iconClass="icon-dkt"
        >{{rewards.dkt}}</IconWithValue>
        <IconWithValue
          class="margin-bottom-1"
          valueClass="font-size-20 digit-font"
          iconClass="icon-gold"
        >{{rewards.gold}}</IconWithValue>
        <IconWithValue valueClass="font-size-20 digit-font" iconClass="icon-exp">{{rewards.exp}}</IconWithValue>

        <div class="flex flex-center flex-column margin-top-3">
          <div class="flex flex-center reward-loot">
            <loot
              v-for="item in rewards.items"
              :item="item.item"
              :quantity="item.quantity"
              :key="item.item"
              @hint="showHint"
            ></loot>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CustomButton type="grey" @click="$close">{{$t("continue")}}</CustomButton>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import StripedPanel from "@/components/StripedPanel.vue";
import StripedContent from "@/components/StripedContent.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import RaidsMeta from "@/raids_meta";
import CustomButton from "@/components/Button.vue";
import LootHint from "@/components/LootHint.vue";
import Loot from "@/components/Loot.vue";
import { create as CreateDialog } from "vue-modal-dialogs";

const Hint = CreateDialog(LootHint, "item", "equip", "unequip", "actions");

export default {
  components: {
    UserDialog,
    StripedPanel,
    StripedContent,
    IconWithValue,
    CustomButton,
    Loot
  },
  props: ["rewards", "raidTemplateId"],
  computed: {
    bossName() {
      return RaidsMeta[this.raidTemplateId].name;
    }
  },
  methods: {
    async showHint(item) {
      await Hint(item, false, false, { equip: false });
    }
  }
};
</script>

<style lang="less" scoped>
</style>