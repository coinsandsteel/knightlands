<script>
import CharacterStats from "@/../../knightlands-shared/character_stat.js";

export default {
  computed: {
    subBonuses() {
      return this.$game.subscription.cardBonuses;
    },
    expBonus() {
      return this.subBonuses.exp;
    },
    softBonus() {
      return this.subBonuses.soft;
    },
    hasFastQuests() {
      return this.subBonuses.fastQuests;
    },
    goldValue() {
      let value = `${this.goldMin}-${this.goldMax}`;
      //   if (this.softBonus) {
      //     value += ` (+${this.softBonus}%)`;
      //   }
      return value;
    },
    quest() {
      return this.zone.quests[this.questIndex].stages[this.stage];
    },
    goldMin() {
      return Math.floor(
        ((this.quest.goldMin +
          this.$game.character.getMaxStat(CharacterStats.ExtraGold)) *
          (100 + this.softBonus)) /
          100
      );
    },
    goldMax() {
      return Math.floor(
        this.quest.goldMax *
          (1 +
            this.softBonus / 100 +
            this.$game.character.getMaxStat(CharacterStats.ExtraGold) / 1000)
      );
    },
    exp() {
      return Math.floor(
        this.quest.exp *
          (1 +
            this.expBonus / 100 +
            this.$game.character.getMaxStat(CharacterStats.ExtraExp) / 1000)
      );
    }
  }
};
</script>
