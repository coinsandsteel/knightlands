<template>
  <UserDialog
    :title="$t('rewards')"
    :compact="true"
    @close="$close"
    class="over-top"
  >
    <template v-slot:content>
      <div class="flex flex-column flex-items-center width-100">
        <IconWithValue
          class="margin-bottom-1"
          valueClass="font-size-20 digit-font"
          iconClass="icon-exp"
          >{{ rewards.exp }}</IconWithValue
        >

        <IconWithValue
          class="margin-bottom-1"
          valueClass="font-size-20 digit-font"
          iconClass="icon-gold"
          >{{ rewards.soft }}</IconWithValue
        >

        <div class="flex flex-center flex-column margin-top-3">
          <div class="flex flex-center">
            <loot
              v-for="item in rewards.items"
              :item="item.item"
              :quantity="item.quantity"
              :key="item.item"
              :gacha="true"
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

export default {
  mixins: [HintHandler],
  components: {
    UserDialog,
    IconWithValue,
    CustomButton,
    Loot
  },
  props: ["rewards"]
};
</script>

<style lang="less" scoped>
.over-top {
  z-index: 200;
}
</style>
