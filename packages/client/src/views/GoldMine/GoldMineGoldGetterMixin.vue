<script>
import MinesMeta from "@/mines_meta";

export default {
  computed: {
    storageAtMaxLvl() {
      return this.storageLvl + 1 >= MinesMeta.storage.length;
    },
    storageLvl() {
      return this.$game.goldMines.storage.level;
    },
    maxStorage() {
      if (this.storageAtMaxLvl) {
        return MinesMeta.storage[MinesMeta.storage.length - 1].size;
      }
      return MinesMeta.storage[this.storageLvl].size;
    },
    nextMaxStorage() {
      return MinesMeta.storage[this.storageLvl + 1].size;
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
