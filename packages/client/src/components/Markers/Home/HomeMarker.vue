<script>
import Marker from "./../Marker.vue";
import GoldMinesMarkerMixin from "./GoldMinesMarkerMixin.vue";
import CheckinMarkerMixin from "./CheckinMarkerMixin.vue";
import AdventuresMarkerMixin from "./AdventuresMarkerMixin.vue";
import DailyTasksMarkerMixin from "./DailyTasksMarkerMixin.vue";
import OnyxTowerMarkerMixin from "./OnyxTowerMarkerMixin.vue";
import TrialsMarkerMixin from "./TrialsMarkerMixin.vue";
import TrialType from "@/../../knightlands-shared/trial_type";

export default {
  extends: Marker,
  mixins: [
    GoldMinesMarkerMixin,
    CheckinMarkerMixin,
    AdventuresMarkerMixin,
    DailyTasksMarkerMixin,
    OnyxTowerMarkerMixin,
    TrialsMarkerMixin
  ],
  mounted() {
    this.trialTypes = [TrialType.Armour, TrialType.Weapon, TrialType.Accessory];
  },
  computed: {
    active() {
      return (
        this.canCollectGold ||
        this.canCollectDailyRewards ||
        this.canCollectAdventures ||
        this.canClaimDailyTask ||
        this.canEngageTower ||
        this.canEngageTrial
      );
    }
  }
};
</script>
