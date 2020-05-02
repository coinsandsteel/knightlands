<script>
import UiConstants from "@/ui_constants";

export default {
  computed: {
    stars() {
      if (this.unit) {
        return this.$game.armyDB.getStars(this.unit);
      }

      return 0;
    },
    element() {
      if (this.unit) {
        return this.$game.armyDB.getElement(this.unit);
      }
      return "";
    },
    level() {
      if (this.unit) {
        return this.unit.level;
      }
      return 0;
    },
    unitImage() {
      if (this.unit) {
        return UiConstants.backgroundImage(
          this.$game.armyDB.getIcon(this.unit)
        );
      }

      return "";
    },
    unitType() {
      if (this.unit) {
        return this.$game.armyDB.getUnitType(this.unit);
      }
      return "";
    }
  }
};
</script>
