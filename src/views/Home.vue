<template>
  <div class="flex flex-column flex-end flex-items-center relative">
    <div class="home-art"></div>

    <div class="flex width-100 flex-items-end flex-space-evenly margin-bottom-5 flex-no-wrap">
      <div class="flex flex-column flex-basis-40">
        <router-link tag="div" class="margin-bottom-1" to="daily-rewards" :append="true">
          <SkewedButton :props="{type:'green', icon:'icon-settings'}">
            <span>{{$t("btn-check-in")}}</span>
            <CheckinMarker></CheckinMarker>
          </SkewedButton>
        </router-link>

        <router-link tag="div" class="margin-bottom-1" to="quest" :append="true">
          <SkewedButton :props="{type:'green', icon:'icon-divs'}">{{$t("btn-divs")}}</SkewedButton>
        </router-link>

        <router-link tag="div" class="margin-bottom-1" to="quest" :append="true">
          <SkewedButton :props="{type:'purple', icon:'icon-settings'}">{{$t("btn-settings")}}</SkewedButton>
        </router-link>
      </div>

      <div class="flex flex-column flex-basis-40">
        <router-link tag="div" class="margin-bottom-1" to="trials" :append="true">
          <SkewedButton :props="{type:'grey', icon:'icon-trials'}">
            <span>{{$t("btn-trials")}}</span>
          </SkewedButton>
        </router-link>

        <router-link tag="div" class="margin-bottom-1" to="onyx-tower" :append="true">
          <SkewedButton :props="{type:'grey', icon:'icon-tower'}">
            <span>{{$t("btn-tower")}}</span>
          </SkewedButton>
        </router-link>

        <router-link tag="div" class="margin-bottom-1" to="adventures" :append="true">
          <SkewedButton :props="{type:'grey', icon:'icon-adventures'}">
            <span>{{$t("btn-adventures")}}</span>
            <AdventuresMarker></AdventuresMarker>
          </SkewedButton>
        </router-link>

        <router-link tag="div" class="margin-bottom-1" to="quest" :append="true">
          <SkewedButton :props="{type:'grey', icon:'icon-quests'}">{{$t("btn-quests")}}</SkewedButton>
        </router-link>

        <router-link tag="div" class="margin-bottom-1" to="raids" :append="true">
          <SkewedButton
            class="flex-basis-50"
            :props="{type:'red', icon:'icon-raids'}"
          >{{$t("btn-raids")}}</SkewedButton>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import SkewedButton from "@/components/SkewedButton.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import AdventuresMarker from "@/components/Markers/AdventuresMarker.vue";
import PromisedButton from "@/components/PromisedButton.vue";
import CheckinMarker from "@/components/Markers/CheckinMarker.vue";

export default {
  name: "home",
  mixins: [AppSection],
  components: {
    SkewedButton,
    IconWithValue,
    AdventuresMarker,
    PromisedButton,
    CheckinMarker
  },
  created() {
    this.title = this.$t("window-title-home");
  },
  methods: {
    logout() {
      this.$game.logout();
    }
  }
};
</script>

<style lang="less" scoped>
.home-art {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-image: url("../assets/ui/background_home.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  width: 100%;
  height: 50vh;
  z-index: 0;
}
</style>

