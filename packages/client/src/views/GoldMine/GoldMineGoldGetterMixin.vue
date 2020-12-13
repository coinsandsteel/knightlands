<script>
import MinesMeta from "@/mines_meta";

export default {
  computed: {
    storageLvl() {
      return this.$game.goldMines.storage.level;
    },
    maxStorage() {
      return MinesMeta.storage[this.storageLvl].size;
    },
    storagePrice() {
      return MinesMeta.storage[this.storageLvl].price;
    }
  },
  methods: {
    getGold() {
      let goldMinedTotal = 0;

      for (const mine of this.$game.goldMines.mines) {
        const timePassed = this.$game.nowSec - mine.lastUpdate;
        let goldMined = timePassed * MinesMeta.mines[mine.level].rate;
        goldMinedTotal += goldMined;
      }

      let gold = Math.floor(this.$game.goldMines.storage.gold + goldMinedTotal);

      if (gold > this.maxStorage) {
        gold = this.maxStorage;
      }

      return gold;
    }
  }
};
</script>
