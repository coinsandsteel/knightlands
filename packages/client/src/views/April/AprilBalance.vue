<template>
  <div
    class="flex width-100 flex-row flex-no-wrap flex-justify-center padding-top-4 padding-bottom-4"
  >
    <AprilTickets
      class="april-tickets--with-background padding-left-2 margin-right-2"
    />
    <AprilGold class="april-gold--with-background padding-left-2" />
    <!-- <AprilPoints class="april-points--with-background padding-left-2" /> -->
  </div>
</template>
<script>
import AprilTickets from "@/views/April/AprilTickets.vue";
import AprilGold from "@/views/April/AprilGold.vue";
// import AprilPoints from "@/views/April/AprilPoints.vue";

export default {
  components: {
    AprilTickets,
    AprilGold
    // AprilPoints
  }
};
</script>
