<script>
import Marker from "./../Marker.vue";
import SummonMarkerMixin from "./SummonMarkerMixin.vue";

export default {
  extends: Marker,
  mixins: [SummonMarkerMixin],
  props: ["summonType"],
  mounted() {
    if (this.summonType) {
      this.summonTypes = [this.summonType];
    }
  },
  computed: {
    active() {
      return this.canSummon;
    }
  }
};
</script>
