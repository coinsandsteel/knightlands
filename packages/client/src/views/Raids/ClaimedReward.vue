<template>
  <UserDialog
    :title="$t('raid-reward-title', { boss: $t(bossName) })"
    @close="$close"
  >
    <template v-slot:content>
      <RewardsPreview :rewards="rewards"></RewardsPreview>
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
import RewardsPreview from "./RewardsPreview.vue";
import RaidsMeta from "@/raids_meta";
import CustomButton from "@/components/Button.vue";

export default {
  components: {
    UserDialog,
    CustomButton,
    RewardsPreview
  },
  props: ["rewards", "raidTemplateId"],
  computed: {
    bossName() {
      return RaidsMeta[this.raidTemplateId].name;
    }
  }
};
</script>
