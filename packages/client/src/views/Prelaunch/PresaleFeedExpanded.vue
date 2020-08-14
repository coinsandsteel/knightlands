<template>
  <UserDialog type="panel" contentClass="min-height-60" :title="$t('presale-feed-title')" :compact="true" @close="$close">
    <template v-slot:content>
      <PresaleFeedLine
        v-for="(feedRecord, index) in feed"
        :key="index"
        :feedRecord="feedRecord"
        :expanded="true"
        @hint="showHint"
      ></PresaleFeedLine>
    </template>
  </UserDialog>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import Config from "@/config";
import UserDialog from "@/components/UserDialog.vue";
import HintHandler from "@/components/HintHandler.vue";
import PresaleFeedLine from "./PresaleFeedLine.vue";

export default {
  mixins: [HintHandler],
  props: ["feed"],
  components: { CustomButton, UserDialog, PresaleFeedLine }
};
</script>

<style lang="less" scoped>
</style>