<script>
import Marker from "./../Marker.vue";
import TrainingMarkerMixin from "./TrainingMarkerMixin.vue";

export default {
  extends: Marker,
  mixins: [TrainingMarkerMixin],
  computed: {
    active() {
      return this.anyStatCanBeTrained;
    }
  }
};
</script>
