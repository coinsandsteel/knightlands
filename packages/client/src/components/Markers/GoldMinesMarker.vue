<script>
import Marker from "./Marker.vue";
import GoldMineGoldGetterMixin from "@/views/GoldMine/GoldMineGoldGetterMixin.vue";

export default {
  extends: Marker,
  mixins: [GoldMineGoldGetterMixin],
  activated() {
    this.fetchStatus();
  },
  methods: {
    async fetchStatus() {
      this.active = this.getGold() >= this.maxStorage;
    }
  }
};
</script>
