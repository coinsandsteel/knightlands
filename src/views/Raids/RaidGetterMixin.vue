<script>
import RaidsMeta from "@/raids_meta";
import UiConstants from "@/ui_constants";
import Campaign from "@/campaign_database";

export default {
  computed: {
    raidAttack() {
      return this.raidData.attack;
    },
    level() {
      return this.raidMeta.level;
    },
    raidMeta() {
      return RaidsMeta[this.raid];
    },
    raidData() {
      return this.isFreeRaid ? this.raidMeta.soloData : this.raidMeta.data;
    },
    requiredEssences() {
      if (!this.raidData) {
        return [];
      }

      return this.$game.crafting.getRecipeIngridients(
        this.raidData.summonRecipe
      );
    },
    levelRequirementMet() {
      return this.$game.character.level >= this.level;
    },
    canSummon() {
      if (!this.raidData) {
        return false;
      }

      const hasIngridients = this.$game.crafting.hasEnoughResourcesForRecipe(
        this.raidData.summonRecipe
      );

      return hasIngridients && this.levelRequirementMet;
    },
    raidMaxHealth() {
      return this.raidData.health;
    },
    raidName() {
      return (this.raidMeta || {}).name;
    },
    raidImage() {
      return UiConstants.backgroundImage(
        Campaign.getRaidImage(this.raid)
      );
    }
  }
};
</script>
