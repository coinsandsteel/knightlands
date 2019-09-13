<template>
  <div class="flex flex-column flex-end flex-items-center relative">
    <div class="home-art"></div>

    <div class="flex width-100 flex-center margin-bottom-5">
      <div class="flex flex-center width-100">
        <router-link tag="div" class="flex-basis-40 margin-bottom-1" to="craft" :append="true">
          <SkewedButton :props='{type:"grey", icon:"icon-craft"}'>{{$t("btn-crafting")}}</SkewedButton>
        </router-link>

        <router-link tag="div" class="flex-basis-40 margin-bottom-1" to="level" :append="true">
          <SkewedButton
            :props='{type:"green", icon:"icon-craft-level"}'
          >{{$t("btn-crafting-level")}}</SkewedButton>
        </router-link>
      </div>

      <div class="flex flex-center width-100">
        <router-link tag="div" class="flex-basis-40 margin-bottom-1" to="upgrade" :append="true">
          <SkewedButton
            class="flex-basis-50"
            :props="{type:'purple', icon:'icon-craft-upgrade'}"
          >{{$t("btn-crafting-upgrade")}}</SkewedButton>
        </router-link>

        <router-link tag="div" class="flex-basis-40 margin-bottom-1" to="enchant" :append="true">
          <SkewedButton :props='{type:"red", icon:"icon-enchant"}'>{{$t("btn-enchant")}}</SkewedButton>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import SkewedButton from "@/components/SkewedButton.vue";

export default {
  mixins: [AppSection],
  components: { SkewedButton },
  created() {
    this.title = this.$t("window-title-crafting");
  },
  methods: {
    goTo(route) {
      this.$router.push({ name: route });
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
  background-image: url("../../assets/ui/background_craft.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  width: 100%;
  height: 50vh;
  z-index: 0;
}
</style>
