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
        case CharacterStat.CriticalChance:
          return `${value}%`;
      }

      return value;
    }
  }
};
</script>
