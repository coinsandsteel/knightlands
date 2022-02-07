<template>
  <div
    class="flex width-100 flex-row flex-no-wrap flex-justify-center padding-top-2 padding-bottom-2"
  >
    <MarchTickets class="padding-left-2" />
    <MarchGold class="padding-left-2" />
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
