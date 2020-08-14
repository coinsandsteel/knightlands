<template>
  <user-dialog title="Welcome Gift!" :compact="true" @close="$close(true)">
    <template v-slot:content>
      <div class="flex flex-center margin-top-3">
        <icon-with-value class="font-size-20" iconClass="icon-gold">{{softCurrency}}</icon-with-value>
      </div>

      <div class="flex flex-center margin-top-3">
        <loot v-for="(record) in items" :key="record.item" :item="record.item*1" />
      </div>
    </template>
    <template v-slot:footer>
      <div class="flex flex-center button-container">
        <custom-button @click="$close(true)" type="green">Continue</custom-button>
      </div>
    </template>
  </user-dialog>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import UserDialog from "@/components/UserDialog.vue";
import Loot from "@/components/Loot.vue";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  components: { UserDialog, Loot, CustomButton, IconWithValue },
  props: ["softCurrency", "items"]
};
</script>

<style lang="less" scoped>
</style>


