<script>
import Marker from "./../Marker.vue";
import DailyTasksMarkerMixin from "./DailyTasksMarkerMixin.vue";

export default {
  extends: Marker,
  mixins: [DailyTasksMarkerMixin],
  computed: {
    active() {
      return this.canClaimDailyTask;
    }
  }
};
</script>
