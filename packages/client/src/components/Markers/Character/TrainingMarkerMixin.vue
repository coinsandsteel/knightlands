<script>
import UpgradableCharacterStats from "@/../../knightlands-shared/upgradable_character_stats";
import TrainingCamp from "@/../../knightlands-shared/training_camp";
import TrainingCampMeta from "@/training_camp";

export default {
  data: () => ({
    resourceItems: {}
  }),
  mounted() {
    for (let statKey in UpgradableCharacterStats) {
      const stat = UpgradableCharacterStats[statKey];

      this.$set(
        this.resourceItems,
        stat,
        this.$game.inventory.getItemByTemplate(
          TrainingCampMeta.find(x => x.stat == stat).resource
        )
      );
    }
  },
  methods: {
    getResource(stat) {
      return {
        itemId: TrainingCampMeta.find(x => x.stat == stat).resource,
        quantity: TrainingCamp.getStatResourceCost(
          stat,
          this.getAttributeValue(stat)
        )
      };
    },
    getAttributeValue(stat) {
      return this.$character.getAttribute(stat);
    },
    hasEnoughGold(stat) {
      return this.getUpgradePrice(stat) <= this.$game.softCurrency;
    },
    getUpgradePrice(stat) {
      return TrainingCamp.getStatCost(stat, this.getAttributeValue(stat));
    },
    hasEnoughResource(stat) {
      const res = this.getResource(stat);
      return (
        this.resourceItems[stat] &&
        this.resourceItems[stat].count >= res.quantity
      );
    }
  },
  computed: {
    anyStatCanBeTrained() {
      for (let statKey in UpgradableCharacterStats) {
        const stat = UpgradableCharacterStats[statKey];
        if (this.hasEnoughResource(stat) && this.hasEnoughGold(stat)) {
          return true;
        }
      }

      return false;
    }
  }
};
</script>
