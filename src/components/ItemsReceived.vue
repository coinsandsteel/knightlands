<template>
  <UserDialog :title="$t('box-opened-title')" @close="$close">
    <template v-slot:content>
      <div class="flex flex-column flex-items-center width-100">
        <div class="flex flex-center flex-column margin-top-3">
          <div class="flex flex-center reward-loot">
            <loot
              v-for="item in items"
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
import Loot from "@/components/Loot.vue";
import HintHandler from "@/components/HintHandler.vue";

export default {
  mixins: [HintHandler],
  components: {
    UserDialog,
    StripedPanel,
    StripedContent,
    IconWithValue,
    CustomButton,
    Loot
  },
  props: ["items"]
};
</script>

<style lang="less" scoped>
</style>