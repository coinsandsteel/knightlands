<script>
import Marker from "./Marker.vue";
import GoldMineGoldGetterMixin from "@/views/GoldMine/GoldMineGoldGetterMixin.vue";

export default {
  extends: Marker,
  mixins: [GoldMineGoldGetterMixin],
  asyncComputed: {
    async active() {
      return this.getGold() >= this.maxStorage;
    }
  }
};
</script>
