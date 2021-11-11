<script>
import GoldMineGoldGetterMixin from "@/views/GoldMine/GoldMineGoldGetterMixin.vue";

export default {
  mixins: [GoldMineGoldGetterMixin],
  data: () => ({
    minesGold: 0
  }),
  mounted() {
    this.interval = setInterval(this.updateGold.bind(this), 1000);
    this.updateGold();
  },
  destroyed() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  computed: {
    canCollectGold() {
      return this.minesGold >= this.maxStorage;
    }
  },
  methods: {
    updateGold() {
      this.minesGold = this.getGold();
    }
  }
};
</script>
