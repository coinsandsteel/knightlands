<script>
import Marker from "./Marker.vue";
import ChestsMarkerMixin from "./ChestsMarkerMixin.vue";
import ChestsMeta from "@/chests_meta";

const ChestNames = ["wooden_chest", "silver_chest", "velvet_chest"];

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
