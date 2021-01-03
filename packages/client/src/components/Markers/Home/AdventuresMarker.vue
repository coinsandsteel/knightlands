<script>
import Marker from "./../Marker.vue";
import AdventuresMarkerMixin from "./AdventuresMarkerMixin.vue";

export default {
  extends: Marker,
  mixins: [AdventuresMarkerMixin],
  asyncComputed: {
    async active() {
      return await this.canCollectAdventures;
    }
  }
};
</script>
