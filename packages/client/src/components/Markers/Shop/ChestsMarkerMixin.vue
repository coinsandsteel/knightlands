<script>
import ChestsMeta from "@/metadata/chests_meta";

const ChestNames = [
  "wooden_chest",
  "silver_chest",
  "velvet_chest",
  "halloween_chest"
];

export default {
  computed: {
    chestsCanBeOpened() {
      let chests = [];
      const chestStatus = this.$game.chests;

      ChestNames.forEach(name => {
        chests.push({
          name: name,
          meta: ChestsMeta[name],
          lastFreeOpening: chestStatus[name] || 0
        });
      });

      let canOpen = false;

      for (const chest of chests) {
        let resetCycle = 86400000 / chest.meta.freeOpens;
        let timeUntilNextFreeOpening = this.$game.now - chest.lastFreeOpening;

        if (
          chest.meta.freeOpens > 0 &&
          resetCycle - timeUntilNextFreeOpening <= 0
        ) {
          canOpen = true;
        } else {
          canOpen =
            this.$game.inventory.getItemsCountByTemplate(chest.meta.keyItem) >
            0;
        }

        if (canOpen) {
          break;
        }
      }

      return canOpen;
    }
  }
};
</script>
