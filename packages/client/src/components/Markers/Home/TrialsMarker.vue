<script>
import Marker from "./../Marker.vue";
import TrialsMarkerMixin from "./TrialsMarkerMixin.vue";
import TrialType from "@/../../knightlands-shared/trial_type";

export default {
  extends: Marker,
  props: ["trialType"],
  mixins: [TrialsMarkerMixin],
  mounted() {
    if (this.trialType) {
      this.trialTypes.push(this.trialType);
    } else {
      this.trialTypes = [
        TrialType.Armour,
        TrialType.Weapon,
        TrialType.Accessory
      ];
    }
  },
  computed: {
    active() {
      return this.canEngageTrial;
    }
  }
};
</script>
