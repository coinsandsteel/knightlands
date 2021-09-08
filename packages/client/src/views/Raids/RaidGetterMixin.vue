<script>
import RaidsMeta from "@/raids_meta";
import UiConstants from "@/ui_constants";
import Campaign from "@/campaign_database";

export default {
  computed: {
    raidAttack() {
      return this.raidData.attack;
    },
    raidLevel() {
      return this.raidMeta.level;
    },
    raidMeta() {
      return RaidsMeta[this.raid];
    },
    raidData() {
      if (!this.raidMeta) {
        return {};
      }

      return this.isFreeRaid ? this.raidMeta.soloData : this.raidMeta.data;
    },
    requiredEssences() {
      if (!this.raidData) {
        return [];
      }

      const data =
        this.isFreeRaid || this.$game.isFreeAccount
          ? this.raidMeta.soloData
          : this.raidMeta.data;

      return this.$game.crafting.getRecipeIngridients(data.summonRecipe);
    },
    requiredJoinEssences() {
      if (!this.raidData) {
        return [];
      }

      return this.$game.crafting.getRecipeIngridients(this.raidData.joinRecipe);
    },
    levelRequirementMet() {
      return this.$game.character.level >= this.raidLevel;
    },
    raidLoot() {
      return this.isFreeRaid ? this.raidData.freeLoot : this.raidData.paidLoot;
    },
    canSummon() {
      if (!this.raidData) {
        return false;
      }

      const data =
        this.isFreeRaid || this.$game.isFreeAccount
          ? this.raidMeta.soloData
          : this.raidMeta.data;

      const hasIngridients = this.$game.crafting.hasEnoughResourcesForRecipe(
        data.summonRecipe
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
      return UiConstants.backgroundImage(Campaign.getRaidImage(this.raid));
    },
    maxSlots() {
      return this.raidData.maxSlots;
    },
    staminaCost() {
      return this.raidData.staminaCost || 1;
    },
    healthBars() {
      return this.raidData.healthBars || 1;
    }
  }
};
</script>
