<script>
import Marker from "./../Marker.vue";
import ChestsMarkerMixin from "./ChestsMarkerMixin.vue";
import SummonMarkerMixin from "./SummonMarkerMixin.vue";

export default {
  extends: Marker,
  mixins: [ChestsMarkerMixin, SummonMarkerMixin],
  asyncComputed: {
    async active() {
      return this.chestsCanBeOpened || this.canSummon;
    }
  }
};
</script>
