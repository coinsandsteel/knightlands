<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <div
      class="flex flex-column width-100 flex-center flex-space-evenly margin-bottom-5"
    >
      <div
        class="army-summon flex flex-center pointer"
        @click="goTo('army-summon-menu')"
      >
        <img src="../../assets/ui/01_summon.png" />
        <span>{{ $t("shop-summon") }}</span>
        <SummonMarker class="marker-pos" />
      </div>

      <div class="shop flex flex-center pointer" @click="goTo('daily-shop')">
        <img src="../../assets/ui/02_MARKET.png" />
        <span>{{ $t("shop-shop") }}</span>
      </div>

      <div class="chests flex flex-center pointer" @click="goTo('chests')">
        <img src="../../assets/ui/03_chests.png" />
        <span>{{ $t("shop-chests") }}</span>
        <ChestsMarker class="marker-pos" />
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import ChestsMarker from "@/components/Markers/Shop/ChestsMarker.vue";
import SummonMarker from "@/components/Markers/Shop/SummonMarker.vue";

export default {
  mixins: [AppSection],
  components: { ChestsMarker, SummonMarker },
  created() {
    this.title = this.$t("window-title-summon");
  },
  methods: {
    goTo(route) {
      this.$router.push({ name: route });
    }
  }
};
</script>

<style lang="less" scoped>
.marker-pos {
  position: absolute;
  top: 3.5rem;
  right: 5rem;
}

.shop-btn() {
  position: relative;
  width: 100%;

  & img {
    max-width: 100%;
  }

  & span {
    position: absolute;
    font-size: 4rem;
    text-transform: uppercase;
    font-weight: 900;
    text-shadow: 1px 1px #210028, -1px 1px #210028, 1px -1px #210028,
      -1px -1px #210028;
  }
}

.army-summon {
  .shop-btn();

  & span {
    top: 55%;
  }
}

.shop {
  .shop-btn();

  & span {
    top: 60%;
    left: 52%;
  }
}

.chests {
  .shop-btn();

  & span {
    top: 60%;
    left: 30%;
  }
}
</style>
