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
        <slider-item
          v-for="(zone, zoneId) in zones"
          :key="'zone-' + zoneId"
          class="zone-picture"
        >
          <div class="zone-picture">
            <div
              class="height-100 battle-zone-selection-image"
              :class="'battle-location-image--' + zoneId"
              :style="getZoneImage(zoneId)"
            />
            <div
              class="
                font-size-30
                uppercase
                overlay-title
                font-outline font-weight-900
              "
            >
              {{ $t(getZoneName(zoneId)) }}
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
        {{ prevZone + 1 }}
      </div>
      <div class="zone-id flex flex-center">
        <span>{{ currentZone + 1 }}</span>
      </div>
      <div class="zone-id small">
        {{ nextZone + 1 }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
// import * as battle from "@/../../knightlands-shared/battle";

export default {
  props: ["value"],
  data() {
    return {
      sliderIndex: 0
    };
  },
  mounted() {
    this.sliderIndex = this.nextLocationIndex;
    this.$nextTick(this.handleZoneChanged);
  },
  activated() {
    this.$refs.slider.af = null;
    this.$refs.slider.initTouchArea();
  },
  watch: {
    value(newZone) {
      this.goTo(newZone);
    },
    nextLocationIndex(value) {
      this.sliderIndex = value;
      this.$nextTick(this.handleZoneChanged);
    }
  },
  computed: {
    ...mapState("battle", ["adventures"]),
    nextLocationIndex() {
      let locationIndex = this.adventures.locations.findLastIndex(
        location =>
          !!location.levels.find(level => level[this.adventures.difficulty])
      );

      return locationIndex;
    },
    zones() {
      return this.adventures.locations;
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
      this.sliderIndex = zoneId;
    },
    getZoneImage(zoneId) {
      return "Image " + zoneId;
    },
    getZoneName(zoneId) {
      return this.$t("battle-location-" + zoneId);
    },
    goToNext() {
      this.sliderIndex = this.nextZone;
    },
    goToPrev() {
      this.sliderIndex = this.prevZone;
    },
    handleZoneChanged(event) {
      this.$emit("change", { locationIndex: this.sliderIndex });
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
  margin: 1rem 0 0.4rem 0;
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

.battle-location-image--0 {
  background: url("/images/battle/locations/location-1.jpg") 100% 100% no-repeat;
}
.battle-location-image--1 {
  background: url("/images/battle/locations/location-2.jpg") 100% 100% no-repeat;
}
.battle-location-image--2 {
  background: url("/images/battle/locations/location-3.jpg") 100% 100% no-repeat;
}
.battle-location-image--3 {
  background: url("/images/battle/locations/location-4.jpg") 100% 100% no-repeat;
}
.battle-location-image--4 {
  background: url("/images/battle/locations/location-5.jpg") 100% 100% no-repeat;
}
.battle-location-image--5 {
  background: url("/images/battle/locations/location-6.jpg") 100% 100% no-repeat;
}
</style>
