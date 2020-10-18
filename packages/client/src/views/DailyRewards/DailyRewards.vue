<template>
  <div class="flex flex-column">
    <div class="screen-background"></div>
    <DailyLogin></DailyLogin>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import DailyLogin from "./DailyLogin.vue";

const DailyLoginTab = "daily_login";

export default {
  mixins: [AppSection],
  components: { DailyLogin },
  data: () => ({
      DailyLoginTab
  })
};
</script>
