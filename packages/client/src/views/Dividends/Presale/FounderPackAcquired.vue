<template>
  <UserDialog :title="$t('box-opened-title')" @close="$close">
    <template v-slot:content>
      <div class="flex flex-column flex-items-center width-100">
        <!-- <IconWithValue
          class="margin-bottom-1"
          valueClass="font-size-20 digit-font"
          iconClass="icon-dkt"
          v-if="dkt"
          >{{ dkt }}</IconWithValue
        > -->

        <div v-if="tokenType == '3'" class="font-size-20">
          <div
            class="flex flex-center line"
            v-html="$t('sub-7', { c: 10 })"
          ></div>
          <div
            class="flex flex-center line"
            v-html="$t('sub-5', { c: 50 })"
          ></div>
          <div
            class="flex flex-center line"
            v-html="$t('sub-6', { c: 50 })"
          ></div>
        </div>

        <div
          class="flex flex-center flex-column margin-top-3"
          v-if="items.length > 0"
        >
          <div class="flex flex-center reward-loot">
            <loot
              v-for="item in items"
              :item="item.itemId"
              :quantity="item.maxCount"
              :key="item.itemId"
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
import PresaleCardsMeta from "@/metadata/presale_cards";

import UserDialog from "@/components/UserDialog.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import CustomButton from "@/components/Button.vue";
import Loot from "@/components/Loot.vue";
import HintHandler from "@/components/HintHandler.vue";

export default {
  mixins: [HintHandler],
  components: {
    UserDialog,
    IconWithValue,
    CustomButton,
    Loot
  },
  props: ["tokenId"],
  computed: {
    tokenType() {
      const tokenType = BigInt(this.tokenId) >> BigInt(128);
      return tokenType.toString();
    },
    items() {
      return PresaleCardsMeta[this.tokenType];
    }
  }
};
</script>

<style lang="less" scoped></style>
