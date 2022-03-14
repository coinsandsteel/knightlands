<template>
  <div
    class="april-board-cell-container relative"
    :class="{ 'april-board-cell-container--black': index % 2 === 0 }"
  >
    <div class="april-board-cell absolute-stretch">
      <Transition name="fade" appear>
        <div
          v-if="isHitZone"
          class="april-board-cell-hit-zone absolute-stretch"
        />
      </Transition>
      <Transition name="fade" appear>
        <div
          v-if="isAvailableMove"
          class="april-board-cell-available-move absolute-stretch"
        />
      </Transition>
      <Transition name="fade" appear>
        <div
          v-if="isEnemy"
          class="april-board-cell-enemy april-board-cell-enemy--teeth absolute-stretch"
        />
      </Transition>
      <div
        v-if="isHero"
        class="april-board-cell-hero april-board-cell-hero--knight absolute-stretch"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import * as april from "@/../../knightlands-shared/april";

export default {
  props: {
    index: Number
    // card: Object
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("april", ["cells", "moveZones"]),
    cell() {
      if (!(this.cells && this.cells.length >= this.index)) {
        return null;
      }

      return this.cells[this.index];
    },
    isHero() {
      return this.cell && this.cell.unitClass === april.UNIT_CLASS_HERO;
    },
    isEnemy() {
      return (
        this.cell &&
        this.cell.unitClass &&
        this.cell.unitClass !== april.UNIT_CLASS_HERO
      );
    },
    isAvailableMove() {
      return this.moveZones && this.moveZones.includes(this.index);
    },
    isHitZone() {
      return this.cell && this.cell.damage;
    }
  }
};
</script>
<style scoped lang="less">
.april-board-cell-container {
  width: calc(var(--base-size) * 0.8);
  height: calc(var(--base-size) * 0.8);
  background: #fff;
}
.april-board-cell-container--black {
  background: #222;
}
.april-board-cell {
}
.april-board-cell-hit-zone {
  background: url("/images/april/hit_zone.svg") center/22% repeat;
}
.april-board-cell-available-move {
  // background-color: rgba(#ef4444, 0.5);
  background-color: rgba(#10b981, 0.3);
}
.april-board-cell-enemy {
  background-size: 80%;
  background-position: center;
  background-repeat: no-repeat;
}
.april-board-cell-hero {
  background-size: 70%;
  background-position: center;
  background-repeat: no-repeat;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>
