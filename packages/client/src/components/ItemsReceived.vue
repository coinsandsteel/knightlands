<template>
  <UserDialog :title="$t('box-opened-title')" @close="$close">
    <template v-slot:content>
      <div class="flex flex-column flex-items-center width-100">

        <IconWithValue
          class="margin-bottom-1"
          valueClass="font-size-20 digit-font"
          iconClass="icon-dkt"
          v-if="dkt"
        >{{dkt}}</IconWithValue>

        <IconWithValue
          class="margin-bottom-1"
          valueClass="font-size-20 digit-font"
          iconClass="icon-premium"
          v-if="hard"
        >{{hard}}</IconWithValue>

        <IconWithValue
          class="margin-bottom-1"
          valueClass="font-size-20 digit-font"
          iconClass="icon-gold"
          v-if="soft"
        >{{soft}}</IconWithValue>

        <IconWithValue
          class="margin-bottom-1"
          valueClass="font-size-20 digit-font"
          iconClass="icon-exp"
          v-if="exp"
        >{{exp}}</IconWithValue>

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
import IconWithValue from "@/components/IconWithValue.vue";
import RaidsMeta from "@/raids_meta";
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
  props: ["items", "soft", "hard", "exp", "dkt"]
};
</script>

<style lang="less" scoped>
</style>