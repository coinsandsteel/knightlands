<template>
  <div class="screen-content">
    <DiscordChat
      server="694928249167282176"
      channel="699540977773183066"
    ></DiscordChat>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import DiscordChat from "./DiscordChat.vue";

export default {
  mixins: [AppSection],
  components: { DiscordChat },
  created() {
    this.title = "w-world-chat";
    this.$options.useRouterBack = true;
  }
};
</script>
