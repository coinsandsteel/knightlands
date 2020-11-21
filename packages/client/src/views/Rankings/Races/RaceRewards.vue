<script>
import RankedRewards from "../Components/RankedRewards.vue";
import { create } from "vue-modal-dialogs";
import RaceInfo from "./RaceInfo.vue";

const infoWindow = create(RaceInfo);

export default {
  extends: RankedRewards,
  created() {
    this.showInfoButton = true;
  },
  async mounted() {
    this.currentRank = await this.$game.getRaceInfo(this.id);
    this.rewards = await this.$game.getRaceRewards(this.id);
  },
  async openInfo() {
    await infoWindow({
      race: this.currentRank
    });
  }
};
</script>
