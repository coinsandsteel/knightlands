<template>
  <UserDialog>
    <template v-slot:content>
      <div class="flex flex-center width-100">
        <span class="font-size-20">Use </span>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";

export default {
  components: { UserDialog },
  props: ["iap"]
};
</script>
