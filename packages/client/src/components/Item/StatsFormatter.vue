<script>
import CharacterStat from "@/../../knightlands-shared/character_stat";

export default {
  methods: {
    format(stat, value, stack, count) {
      let result = value;
      switch (stat) {
        case CharacterStat.ExtraGold:
        case CharacterStat.ExtraExp:
          result = `${value / 10}%`;
          break;

        case CharacterStat.ExtraDkt:
        case CharacterStat.DamageReduction:
        case CharacterStat.CriticalDamage:
          result = `${value}%`;
          break;

        case CharacterStat.CriticalChance:
          result = `${value / 100}%`;
          break;
      }

      if (stack) {
        const max = Math.min(stack, count);
        result += ` ( x${max} = ${this.format(stat, value * max)} )`;
      }

      return result;
    }
  }
};
</script>
