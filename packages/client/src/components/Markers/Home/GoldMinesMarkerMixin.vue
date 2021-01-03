<script>
import GoldMineGoldGetterMixin from "@/views/GoldMine/GoldMineGoldGetterMixin.vue";

export default {
  mixins: [GoldMineGoldGetterMixin],
  computed: {
    canCollectGold() {
      return this.getGold() >= this.maxStorage;
    }
  }
};
</script>
