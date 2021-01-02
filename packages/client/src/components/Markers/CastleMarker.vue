<script>
import Marker from "./Marker.vue";
import BeastMarkerMixin from "./BeastMarkerMixin.vue";

export default {
  extends: Marker,
  mixins: [BeastMarkerMixin],
  asyncComputed: {
    async active() {
      return this.beastCanBeBoosted;
    }
  }
};
</script>
