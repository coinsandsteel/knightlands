<script>
import UpgradableCharacterStats from "@/../../knightlands-shared/upgradable_character_stats";
import TrainingCamp from "@/../../knightlands-shared/training_camp";
import TrainingCampMeta from "@/training_camp";

export default {
  data: () => ({
    item: null,
    resourceItems: {}
  }),
  mounted() {
    this.item = this.$game.inventory.getItemByTemplate(Beasts.ticketItem);

    for (let statKey in UpgradableCharacterStats) {
      const stat = UpgradableCharacterStats[statKey];

      this.$set(this.upgradePrice, stat, 0);
      this.$set(this.purchasedAttributes, stat, 0);
      this.$set(this.upgradeResources, stat, 0);
      this.resourceItems[stat] = this.$game.inventory.getItemByTemplate(
        TrainingCampMeta.find(x => x.stat == stat).resource
      );
    }
  },
  methods: {
    hasEnoughResource(stat) {
      const res = this.getResource(stat);
      return (
        this.resourceItems[stat] &&
        this.resourceItems[stat].count >= res.quantity
      );
    }
  },
  computed: {
    beastCanBeBoosted() {
      if (!this.item) {
        return false;
      }
      return this.$game.inventory.getItemByTemplate(1).count > 0;
    }
  }
};
</script>
