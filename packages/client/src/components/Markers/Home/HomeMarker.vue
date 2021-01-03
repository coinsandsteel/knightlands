<script>
import Marker from "./../Marker.vue";
import GoldMinesMarkerMixin from "./GoldMinesMarkerMixin.vue";
import CheckinMarkerMixin from "./CheckinMarkerMixin.vue";
import AdventuresMarkerMixin from "./AdventuresMarkerMixin.vue";
import DailyTasksMarkerMixin from "./DailyTasksMarkerMixin.vue";

export default {
  extends: Marker,
  mixins: [
    GoldMinesMarkerMixin,
    CheckinMarkerMixin,
    AdventuresMarkerMixin,
    DailyTasksMarkerMixin
  ],
  computed: {
    active() {
      return (
        this.canCollectGold ||
        this.canCollectDailyRewards ||
        this.canCollectAdventures ||
        this.canClaimDailyTask
      );
    }
  }
};
</script>
