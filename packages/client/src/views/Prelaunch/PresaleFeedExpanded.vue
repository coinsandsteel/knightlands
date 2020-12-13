<template>
  <UserDialog
    contentClass="min-height-60"
    :title="$t('presale-feed-title')"
    @close="$close"
  >
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
import UserDialog from "@/components/UserDialog.vue";
import HintHandler from "@/components/HintHandler.vue";
import PresaleFeedLine from "./PresaleFeedLine.vue";

export default {
  mixins: [HintHandler],
  props: ["feed"],
  components: { UserDialog, PresaleFeedLine }
};
</script>

<style lang="less" scoped></style>
