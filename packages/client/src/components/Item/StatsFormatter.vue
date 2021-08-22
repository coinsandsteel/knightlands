<script>
import CharacterStat from "@/../../knightlands-shared/character_stat";

export default {
  methods: {
    format(stat, value) {
      switch (stat) {
        case CharacterStat.ExtraGold:
        case CharacterStat.ExtraExp:
          return `${value / 10}%`;

        case CharacterStat.ExtraDkt:
        case CharacterStat.DamageReduction:
        case CharacterStat.CriticalDamage:
          return `${value}%`;

        case CharacterStat.CriticalChance:
          return `${value / 100}%`;
      }

      return value;
    }
  }
};
</script>
