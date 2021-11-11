<template>
  <UserDialog title="un-wal-t" @close="handleClose(false)">
    <template v-slot:content>
      <span
        class="font-size-20 font-weight-900 rarity-legendary font-outline"
        >{{ $t("un-wal") }}</span
      >
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
export default {
  components: { UserDialog },
  props: ["chain"],
  data: () => ({
    cancellationToken: { cancelled: false }
  }),
  mounted() {
    this.waitForUnlock();
  },
  methods: {
    handleClose(result) {
      if (result === false) {
        this.cancellationToken.cancelled = true;
      }
      this.$close(result);
    },
    async waitForUnlock() {
      await this.$game.blockchain.unlocked(this.cancellationToken);
      this.$close(true);
    }
  }
};
</script>
