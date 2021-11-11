<template>
  <div
    class="raid-army-root full-flex flex flex-center color-panel-1 no-padding"
    v-resize="onResize"
  >
    <div class="unit-grid width-100 height-100" ref="grid">
      <RaidArmySlot
        :ref="slot.unit ? slot.unit.id : 0"
        v-for="slot in generals"
        :key="slot.id"
        :unit="slot.unit"
      />
      <RaidArmySlot
        :ref="slot.unit ? slot.unit.id : 0"
        v-for="slot in troops"
        :key="slot.id"
        :unit="slot.unit"
      />

      <div class="absolute-stretch pointer-events-none">
        <div
          v-for="(damage, unitId) in damages"
          :key="unitId"
          :ref="`damage${unitId}`"
          class="absolute font-outline font-weight-900 flex flex-column flex-center"
        >
          <span class="damage-text">{{ damage }}</span>
          <span class="damage-text proc" v-if="procs[unitId]"
            >+{{ procs[unitId] }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RaidArmySlot from "./RaidArmySlot.vue";
import resize from "vue-resize-directive";
import anime from "animejs/lib/anime.es.js";
import UI from "@/ui_constants";

export default {
  props: ["legionIndex", "attackPoint"],
  components: { RaidArmySlot },
  directives: {
    resize
  },
  data: () => ({
    damages: {},
    procs: {}
  }),
  computed: {
    generals() {
      return this.$game.army.getSlots(this.legionIndex, false);
    },
    troops() {
      return this.$game.army.getSlots(this.legionIndex, true);
    }
  },
  methods: {
    async play(unitDamages, procs, health, energy, stamina, container) {
      if (Object.keys(unitDamages).length == 0) {
        return;
      }

      const slotTargets = [];
      const byVerticalPosition = [];

      for (const unitId in unitDamages) {
        if (procs[unitId]) {
          unitDamages[unitId] += procs[unitId];
        }

        if (this.$refs[unitId]) {
          const slot = this.$refs[unitId][0];
          slotTargets.push(slot.$el);
          byVerticalPosition.push({
            unitId,
            el: slot.$el,
            top: slot.$el.offsetTop
          });
        }
      }

      byVerticalPosition.sort((a, b) => {
        return a.el.offsetTop - b.el.offsetTop;
      });

      let slotsTimeline = anime.timeline({
        targets: slotTargets
      });

      slotsTimeline.add({
        translateY: "-2rem",
        duration: 200,
        easing: "easeInOutBack"
      });

      await slotsTimeline.finished;

      this.procs = { ...procs };
      this.damages = { ...unitDamages };

      await new Promise(resolve => {
        this.$nextTick(resolve);
      });

      let delay = 0;
      let prevVerticalPos = 0;
      let animationToWait;

      for (let record of byVerticalPosition) {
        const { unitId, el: slotEl } = record;
        const el = this.$refs[`damage${unitId}`][0];

        let timeline = anime.timeline({
          targets: el
        });

        anime.set(el, {
          opacity: 0,
          translateY:
            slotEl.offsetTop + slotEl.offsetHeight / 2 - el.offsetHeight / 2,
          translateX:
            slotEl.offsetLeft + slotEl.offsetWidth / 2 - el.offsetWidth / 2
        });

        timeline.add({
          duration: 600,
          easing: "easeOutElastic",
          // color: "#ff3e3e",
          // "font-size": "3.5rem",
          opacity: 1,
          endDelay: 300
        });

        if (prevVerticalPos != slotEl.offsetTop) {
          prevVerticalPos = slotEl.offsetTop;

          if (prevVerticalPos != 0) {
            delay += 150;
          }
        }

        timeline.add({
          duration: 500,
          easing: "easeOutExpo",
          // "font-size": "3rem",
          translateY: el.offsetTop - this.attackPoint.y,
          delay: delay,
          opacity: {
            value: 0,
            easing: "easeInQuart",
            duration: 300
          },
          update: anim => {
            if (anim.progress > 45 && unitDamages[unitId]) {
              this.$emit("damage", unitDamages[unitId]);
              delete unitDamages[unitId];
            }
          }
        });

        animationToWait = timeline;
      }

      await animationToWait.finished;

      await this._playResources(
        "health",
        health,
        byVerticalPosition,
        container
      );
      await this._playResources(
        "energy",
        energy,
        byVerticalPosition,
        container
      );
      await this._playResources(
        "stamina",
        stamina,
        byVerticalPosition,
        container
      );

      slotsTimeline = anime.timeline({
        targets: slotTargets
      });

      slotsTimeline.add({
        translateY: 0,
        duration: 200,
        easing: "easeInOutBack"
      });
    },
    async _playResources(resourceName, values, byVerticalPosition, container) {
      let promises = [];

      for (let record of byVerticalPosition) {
        const { unitId, el: slotEl } = record;
        const el = this.$refs[`damage${unitId}`][0];
        if (!el || !values[unitId]) {
          continue;
        }
        const offset = UI.offsetTo(slotEl, document.getElementById("overlay"));
        promises.push(
          this.$app.getStatusBar().showResourceGained(
            resourceName,
            {
              x: offset.left + el.offsetWidth / 2,
              y: offset.top + offset.height / 2
            },
            values[unitId],
            container
          )
        );
      }

      await Promise.all(promises);
    },
    onResize() {
      // make it square
      let minDimension = Math.min(
        this.$refs.grid.offsetHeight,
        this.$refs.grid.offsetWidth
      );

      this.$refs.grid.style.width = minDimension + "px";
      this.$refs.grid.style.height = minDimension + "px";
    }
  }
};
</script>

<style lang="less" scoped>
.unit-grid {
  display: grid;
  grid-template-rows: 33% 33% 33%;
  // grid-template-columns: 1fr 1fr 1fr;
  grid-template-columns: 33% 33% 33%;
}

.damage-text {
  font-size: 3.5rem;

  &.proc {
    color: #e08c5c;
    font-size: 2.2rem;
  }
}

// .outer {
//   position: relative;

//   &:before {
//     display: block;
//     content: "";
//     width: 100%;
//     padding-top: 100%;
//   }

//   & > .inner {
//     position: absolute;
//     top: 0;
//     right: 0;
//     bottom: 0;
//     left: 0;
//   }
// }
</style>
