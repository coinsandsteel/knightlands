<script>
import Marker from "./../Marker.vue";
import CheckinMarkerMixin from "./CheckinMarkerMixin.vue";

export default {
  extends: Marker,
  mixins: [CheckinMarkerMixin],
  computed: {
    active() {
      return this.canCollectDailyRewards;
    }
  }
};
</script>
