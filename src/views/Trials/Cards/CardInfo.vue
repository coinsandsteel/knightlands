<script>
import TrialsMeta from "@/trials_meta";

export default {
    props: ["effect", "fightMeta"],
  computed: {
    name() {
      return this.effect;
    },
    value() {
        return this.$game.trialCardsResolver.getCurrentValue(this.fightMeta, this.effect);
    }
  }
};
</script>