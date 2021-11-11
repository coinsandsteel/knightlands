<script>
import Marker from "./../Marker.vue";
import GoldMinesMarkerMixin from "./GoldMinesMarkerMixin.vue";

export default {
  extends: Marker,
  mixins: [GoldMinesMarkerMixin],
  computed: {
    active() {
      return this.canCollectGold;
    }
  }
};
</script>
