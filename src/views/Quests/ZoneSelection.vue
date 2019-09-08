<template>
  <div class>
    <div class="zone-scene">
      <span class="zone-nav flex flex-center" @click="goToPrev" :class="{hidden: currentZone == 1}">
        <div class="nav-arrow left"></div>
      </span>
      
      <agile
        ref="zonesList"
        :dots="false"
        :navButtons="false"
        :speed="300"
        :infinite="false"
        @afterChange="handleZoneChanged($event)"
      >
        <div v-for="zone in zones" :key="zone._id" class="zone-picture">
          <div class="height-100 pixelated" :style="getZoneImage(zone._id)" />
          <div class="font-size-30 overlay-title font-outline">{{$t(getZoneName(zone._id))}}</div>
        </div>
      </agile>

      <span
        class="zone-nav flex flex-center"
        @click="goToNext"
        :class="{hidden: currentZone == zones.length}"
      >
        <div class="nav-arrow"></div>
      </span>
    </div>

    <div class="zone-breacrumbs digit-font font-size-20 flex flex-center flex-nowrap">
      <div :class="{hidden: currentZone == 1}" class="zone-id-dots left" @click="goToPrev"></div>
      <div
        :class="{hidden: currentZone == 1}"
        class="zone-id small"
        @click="goToPrev"
      >{{currentZone-1}}</div>
      <div class="zone-id flex flex-center">
        <span>{{currentZone}}</span>
      </div>
      <div
        :class="{hidden: currentZone == zones.length}"
        class="zone-id small"
        @click="goToNext"
      >{{currentZone+1}}</div>
      <div :class="{hidden: currentZone == zones.length}" class="zone-id-dots" @click="goToNext"></div>
    </div>
  </div>
</template>

<script>
import Zones from "@/campaign_database";

export default {
  props: ["zones", "value"],
  data() {
    return {
      currentZone: 1
    };
  },
  mounted() {
    this.goTo(this.value);
  },
  watch: {
    value(newZone) {
      this.goTo(newZone);
    }
  },
  methods: {
    goTo(zoneId) {
      let index = this.zones.findIndex(zone => {
        return zone._id == zoneId;
      });
      if (index >= 0) {
        this.$refs.zonesList.goTo(index);
      }
    },
    getZoneImage(zoneId) {
      return `background-image:url(${Zones.getBackground(zoneId)})`;
    },
    getZoneName(zoneId) {
      return Zones.getZoneName(zoneId);
    },
    goToNext() {
      this.$refs.zonesList.goToNext();
    },
    goToPrev() {
      this.$refs.zonesList.goToPrev();
    },
    handleZoneChanged(event) {
      // v-model loopback
      this.$emit("input", this.zones[event.currentSlide]._id);
      this.$emit("zoneChanged", this.zones[event.currentSlide]._id);

      if (this.$refs.zonesList) {
        this.currentZone = this.$refs.zonesList.getCurrentSlide() + 1;
      } else {
        this.currentZone = 0;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@zoneIdSize: 2.5rem;
.zone-id {
  background-image: url("../../assets/ui/level_number_border.png");
  background-size: cover;
  background-position: center;
  width: @zoneIdSize;
  height: @zoneIdSize;
  line-height: @zoneIdSize;

  &.small {
    width: @zoneIdSize * 0.8;
    height: @zoneIdSize * 0.8;
    opacity: 0.4;
    line-height: @zoneIdSize * 0.8;
  }
}

@dotsWidth: 3rem;
.zone-id-dots {
  background-image: url("../../assets/ui/level_number_crumbs.png");
  background-size: cover;
  background-position: center;
  width: @dotsWidth;
  height: @dotsWidth * 0.1891;
}

.zone-breacrumbs {
  margin: 0.2rem 0 0.4rem 0;
  padding: 0 0.2rem 0 0.2rem;

  * > {
    margin: 0 0.2rem 0 0.2rem;
  }
}

.zone-scene {
  height: 16vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.agile {
  width: 80%;
  height: 100%;
}

.zone-list {
  display: flex;
  flex-direction: column;

  .element {
    margin-bottom: 5px;
    height: 100px;

    &:hover {
      cursor: pointer;
    }
  }
}

.zone-nav {
  cursor: pointer;
  height: 14rem;
}

.hidden {
  opacity: 0 !important;
}
</style>


