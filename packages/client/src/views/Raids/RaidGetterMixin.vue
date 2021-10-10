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
    groupRaidSummonCooldown() {
      return RaidsMeta.meta.groupRaidSummonCooldown;
    },
    maxSoloAttempts() {
      return RaidsMeta.meta.dailySoloLimit;
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
    summonPrice() {
      return this.raidData.summonPrice;
    },
    soloAttempts() {
      return (
        this.maxSoloAttempts - (this.$game.soloRaidAttempts[this.raid] || 0)
      );
    },
    requiredEssences() {
      if (!this.raidData) {
        return [];
      }

      const data =
        this.isFreeRaid || this.$game.isFreeAccount
          ? this.raidMeta.soloData
          : this.raidMeta.data;

      if (this.$game.isFreeAccount) {
        return [];
      }

      return this.$game.crafting.getRecipeIngridients(data.summonRecipe);
    },
    requiredJoinEssences() {
      if (!this.raidData) {
        return [];
      }

      const data =
        this.isFreeRaid || this.$game.isFreeAccount
          ? this.raidMeta.soloData
          : this.raidMeta.data;

      if (this.$game.isFreeAccount) {
        return [];
      }

      return this.$game.crafting.getRecipeIngridients(data.joinRecipe);
    },
    levelRequirementMet() {
      return this.$game.character.level >= this.raidLevel;
    },
    raidLoot() {
      return this.isFreeRaid ? this.raidData.freeLoot : this.raidData.paidLoot;
    },
    canJoin() {
      const hasIngridients = this.$game.crafting.hasEnoughIngridients(
        this.requiredJoinEssences
      );

      return hasIngridients && this.levelRequirementMet;
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
      let extra = true;
      if (this.isFreeRaid) {
        extra = this.soloAttempts > 0;
      }

      return hasIngridients && this.levelRequirementMet && extra;
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
