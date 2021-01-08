<script>
import Marker from "./../Marker.vue";
import OnyxTowerMarkerMixin from "./OnyxTowerMarkerMixin.vue";

export default {
  extends: Marker,
  mixins: [OnyxTowerMarkerMixin],
  computed: {
    active() {
      return this.canEngageTower;
    }
  }
};
</script>
