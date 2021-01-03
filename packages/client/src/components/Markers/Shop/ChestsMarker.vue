<script>
import Marker from "./../Marker.vue";
import ChestsMarkerMixin from "./ChestsMarkerMixin.vue";

export default {
  extends: Marker,
  mixins: [ChestsMarkerMixin],
  computed: {
    active() {
      return this.chestsCanBeOpened;
    }
  }
};
</script>
