<template>
  <div ref="port" class="map-port relative width-100 height-100">
    <div
      id="map"
      ref="scene"
      @mousedown="startMovement"
      @touchstart="startMovement"
    >
      <div class="building building-tower font-size-25" :style="towerStyle">
        <progress-bar
          class="farm-progress-bar"
          ref="progress"
          barClasses="no-animation"
          :maxValue="100"
          :percentMode="false"
          :hideMaxValue="false"
          v-model="tower.currentLevelPercentage"
          barType="green"
        ></progress-bar>

        TOWER<br />
        Exp: {{ expirienceValueFormatted }}<br />
        Level: {{ tower.level }}
      </div>

      <XmasFarm
        :key="'tier-' + tier"
        v-for="(slot, tier) in slots"
        :style="slot.style"
        :tier="tier"
      />
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";

import Erorrs from "@/../../knightlands-shared/errors";
import PromptMixin from "@/components/PromptMixin.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import { create } from "vue-modal-dialogs";

import XmasFarm from "./XmasFarm.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import { abbreviateNumber } from "../../../../knightlands-shared/xmas";

export default {
  mixins: [PromptMixin, NetworkRequestErrorMixin],
  components: {
    XmasFarm,
    ProgressBar
  },
  watch: {},
  mounted() {
    this.$nextTick(() => {
      this.calcPositionLimits();
    });
    this.$store.dispatch("xmas/setTowerLevelBoundaries");
  },
  data: () => {
    return {
      slots: {
        1: { style: { left: "13rem", top: "59rem" } },
        2: { style: { left: "42rem", top: "25rem" } },
        3: { style: { left: "57rem", top: "56rem" } },
        4: { style: { left: "85rem", top: "18rem" } },
        5: { style: { left: "100rem", top: "46rem" } },
        6: { style: { left: "35rem", top: "81rem" } },
        7: { style: { left: "22rem", top: "105rem" } },
        8: { style: { left: "79rem", top: "90rem" } },
        9: { style: { left: "122rem", top: "75rem" } }
      },
      size: {
        port: {
          width: 0,
          height: 0
        },
        scene: {
          width: 0,
          height: 0
        }
      },
      positionLimits: {
        top: {
          min: 0,
          max: 0
        },
        left: {
          min: 0,
          max: 0
        }
      },
      positions: {
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0
      }
    };
  },
  methods: {
    calcPositionLimits() {
      this.size.port.width = this.$refs.port.offsetWidth;
      this.size.port.height = this.$refs.port.offsetHeight;
      this.size.scene.width = this.$refs.scene.offsetWidth;
      this.size.scene.height = this.$refs.scene.offsetHeight;

      this.positionLimits.top.min =
        this.size.port.height - this.size.scene.height;
      this.positionLimits.left.min =
        this.size.port.width - this.size.scene.width;

      console.log("Sizes", _.cloneDeep(this.size));
    },
    startMovement: function(event) {
      // get the mouse cursor position at startup:
      this.positions.clientX = event.clientX;
      this.positions.clientY = event.clientY;

      document.onmousemove = this.elementDrag;
      document.ontouchmove = this.elementDrag;

      document.onmouseup = this.closeDragElement;
      document.ontouchend = this.closeDragElement;
    },
    elementDrag: function(event) {
      let eventX, eventY;
      if (event instanceof TouchEvent) {
        eventX = event.touches[0].clientX;
        eventY = event.touches[0].clientY;
      } else {
        eventX = event.clientX;
        eventY = event.clientY;
      }

      this.positions.movementX = this.positions.clientX - eventX;
      this.positions.movementY = this.positions.clientY - eventY;
      this.positions.clientX = eventX;
      this.positions.clientY = eventY;

      let nextTop = Math.max(
        this.positionLimits.top.min,
        Math.min(
          this.positionLimits.top.max,
          this.$refs.scene.offsetTop - this.positions.movementY
        )
      );
      let nextLeft = Math.max(
        this.positionLimits.left.min,
        Math.min(
          this.positionLimits.left.max,
          this.$refs.scene.offsetLeft - this.positions.movementX
        )
      );

      this.$refs.scene.style.top = nextTop + "px";
      this.$refs.scene.style.left = nextLeft + "px";
    },
    closeDragElement() {
      document.onmousemove = null;
      document.ontouchmove = null;

      document.onmouseup = null;
      document.ontouchend = null;
    }
  },
  computed: {
    expirienceValueFormatted() {
      return abbreviateNumber(this.tower.expirience);
    },
    towerStyle() {
      return {};
    },
    ...mapState({
      tower: state => state.xmas.tower
    })
  }
};
</script>

<style lang="less" scoped>
.map-port {
  overflow: hidden;
}
#map {
  position: absolute;
  width: 250%;
  height: 150%;
  background: url("/images/xmas_assets/farm.jpg") no-repeat center center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
.building {
  position: absolute;
  text-align: center;
  color: black;
}
.building-tower {
  background: coral;
  height: 35rem;
  width: 20rem;
  left: 10rem;
  top: 12rem;
  padding: 15rem 0;
}
.progress-bar {
  position: absolute;
  top: -3rem;
}
</style>
