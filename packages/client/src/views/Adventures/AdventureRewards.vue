<template>
  <UserDialog :title="$t('adventure-finished')" @close="$close">
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
      <CustomButton type="grey" @click="$close">{{
        $t("continue")
      }}</CustomButton>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import CustomButton from "@/components/Button.vue";
import Loot from "@/components/Loot.vue";
import HintHandler from "@/components/HintHandler.vue";

export default {
  mixins: [HintHandler],
  components: {
    UserDialog,
    CustomButton,
    Loot
  },
  props: ["items"]
};
</script>
