<template>
  <div
    class="flex width-100 flex-row flex-no-wrap flex-justify-center padding-top-4 padding-bottom-4"
  >
    <MarchTickets
      class="march-tickets--with-background padding-left-2 margin-right-2"
    />
    <MarchGold
      class="march-gold--with-background padding-left-2 margin-left-2"
    />
  </div>
</template>
<script>
import MarchTickets from "@/views/March/MarchTickets.vue";
import MarchGold from "@/views/March/MarchGold.vue";

export default {
  components: {
    MarchTickets,
    MarchGold
  },
  data() {
    return {};
  }
};
</script>
<style scoped lang="less"></style>
