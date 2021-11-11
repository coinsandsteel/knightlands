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
    goldBonus() {
      return (
        this.softBonus / 100 +
        this.$game.character.getMaxStat(CharacterStats.ExtraGold) / 1000
      );
    },
    goldMin() {
      return Math.floor(this.quest.goldMin * (1 + this.goldBonus));
    },
    goldMax() {
      let str = Math.floor(this.quest.goldMax * (1 + this.goldBonus));

      if (this.goldBonus > 0) {
        str += ` (+${Math.floor(this.goldBonus * 10000) / 100}%)`;
      }

      return str;
    },
    exp() {
      const bonus =
        this.expBonus / 100 +
        this.$game.character.getMaxStat(CharacterStats.ExtraExp) / 1000;

      let str = Math.floor(this.quest.exp * (1 + bonus));
      if (bonus > 0) {
        str += ` (+${Math.floor(bonus * 10000) / 100}%)`;
      }
      return str;
    }
  }
};
</script>
