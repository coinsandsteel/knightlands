<template>
  <UserDialog @close="$close">
    <template v-slot:content>
      <img src="/images/halloween_assets/tip.png" />
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";

export default {
  props: ["data"],
  components: { UserDialog },
  computed: {}
};
</script>
