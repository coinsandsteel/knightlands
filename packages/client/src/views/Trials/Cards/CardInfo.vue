<script>
import TrialsMeta from "@/trials_meta";

export default {
  props: ["effect", "fightMeta"],
  data: () => ({
    overriddenEffect: null
  }),
  computed: {
    name() {
      return this.cardEffect;
    },
    value() {
      return this.$game.trialCardsResolver.getCurrentValue(
        this.fightMeta,
        this.cardEffect
      );
    },
    cardEffect() {
      return this.overriddenEffect != null
        ? this.overriddenEffect
        : this.effect;
    }
  },
  methods: {
    modifierValue() {
      return this.$game.trialCardsResolver.getModifierValue(this.cardEffect);
    },
    nextModiferValue() {
      return this.$game.trialCardsResolver.getNextModifierValue(
        this.cardEffect
      );
    }
  }
};
</script>
