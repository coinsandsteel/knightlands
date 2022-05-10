<template>
  <div class="zone-grid">
    <span class="zone-nav flex flex-center" @click="goToPrev">
      <div class="nav-arrow left"></div>
    </span>

    <div class="zone-scene">
      <slider
        ref="slider"
        animation="fade"
        :touch="true"
        :control-btn="false"
        :indicators="false"
        :autoplay="false"
        height="100%"
        @change="handleZoneChanged"
        v-model="sliderIndex"
      >
        <slider-item v-for="zone in zones" :key="zone.id" class="zone-picture">
          <div class="zone-picture">
            <div
              class="height-100 battle-zone-selection-image"
              :style="getZoneImage(zone.id)"
            />
            <div
              class="font-size-30 uppercase overlay-title font-outline font-weight-900"
            >
              {{ $t(getZoneName(zone.id)) }}
            </div>
          </div>
        </slider-item>
      </slider>
    </div>

    <span class="zone-nav right flex flex-center" @click="goToNext">
      <div class="nav-arrow"></div>
    </span>

    <div class="zone-breacrumbs font-size-20 flex flex-center flex-nowrap">
      <div class="zone-id small">
        {{ prevZone }}
      </div>
      <div class="zone-id flex flex-center">
        <span>{{ currentZone + 1 }}</span>
      </div>
      <div class="zone-id small">
        {{ nextZone }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["value"],
  data() {
    return {
      sliderIndex: 0
    };
  },
  mounted() {
    this.goTo(this.value);
  },
  activated() {
    this.$refs.slider.af = null;
    this.$refs.slider.initTouchArea();
  },
  watch: {
    value(newZone) {
      this.goTo(newZone);
    }
  },
  computed: {
    zones() {
      return [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 }
      ];
    },
    currentZone() {
      return this.sliderIndex;
    },
    nextZone() {
      if (this.currentZone === this.zones.length - 1) {
        return 0;
      }

      return this.currentZone + 1;
    },
    prevZone() {
      if (this.currentZone === 0) {
        return this.zones.length - 1;
      }

      return this.currentZone - 1;
    }
  },
  methods: {
    goTo(zoneId) {
      let index = this.zones.findIndex(zone => {
        return zone.id == zoneId;
      });
      if (index >= 0) {
        this.sliderIndex = index;
      }
    },
    getZoneImage(zoneId) {
      // return `background-image:url(${Zones.getBackground(zoneId)})`;
      return "Image " + zoneId;
    },
    getZoneName(zoneId) {
      // return Zones.getZoneName(zoneId);
      return "Name " + zoneId;
    },
    goToNext() {
      console.log("goToNext");
      this.sliderIndex = this.nextZone;
      console.log("goToNext 2", this.sliderIndex, this.nextZone);
    },
    goToPrev() {
      console.log("goToPrev");
      this.sliderIndex = this.prevZone;
    },
    handleZoneChanged(event) {
      console.log("handleZoneChanged", event);
      // this.$emit("input", this.zones[event]._id);
      // this.$emit("zoneChanged", this.zones[event]._id);
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "../../style/common.less";

@zoneIdSize: 3rem;
@dotsWidth: 3rem;
@dotsHeight: @dotsWidth * 0.1891;
@breadcrumbsHeight: @zoneIdSize * 0.8;

.zone-grid {
  display: grid;
  grid-template-columns: 5rem 1fr 5rem;
  grid-template-rows: 1fr @breadcrumbsHeight;
  height: 25vh;
  justify-content: center;
}

.zone-id {
  .level_number_border;
  width: @zoneIdSize;
  height: @zoneIdSize;
  line-height: @zoneIdSize;

  &.small {
    width: @breadcrumbsHeight;
    height: @breadcrumbsHeight;
    opacity: 0.4;
    line-height: @breadcrumbsHeight;
  }
}

.zone-id-dots {
  .level_number_crumbs;
  background-size: cover;
  background-position: center;
  width: @dotsWidth;
  height: @dotsHeight;
}

.zone-breacrumbs {
  margin: 0.2rem 0 0.4rem 0;
  padding: 0 0.2rem 0 0.2rem;

  z-index: 40;

  grid-row: 2;
  grid-column: 2;

  * > {
    margin: 0 0.2rem 0 0.2rem;
  }
}

.zone-scene {
  grid-row: 1;
  grid-column: ~"1/4";
  overflow: hidden;
}

.agile {
  width: 100%;
  height: 100%;
}

.zone-list {
  display: flex;
  flex-direction: column;

  .element {
    margin-bottom: 5px;
    height: 100px;
    cursor: pointer;
  }
}

.zone-nav {
  cursor: pointer;
  height: 100%;
  grid-column: 1;
  grid-row: 1;
  z-index: 100;

  &.right {
    grid-column: 3;
  }
}

.hidden {
  display: none !important;
}

.battle-zone-selection-image {
  background: green;
}
</style>
