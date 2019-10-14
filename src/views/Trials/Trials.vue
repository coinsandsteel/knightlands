<template>
  <div class="flex flex-items-center flex-start">
    <div class="trials-bg width-100 flex flex-column flex-end flex-items-end flex-space-between">
      <span class="trial-title font-outline padding-1">{{$t("window-trials-armour")}}</span>
      <div class="flex margin-1">
        <CustomButton type="red" @click="goTo('trials-of-honor')">{{$t("btn-enter")}}</CustomButton>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import CustomButton from "@/components/Button.vue";

export default {
  mixins: [AppSection],
  components: { CustomButton },
  created() {
    this.title = "window-trials";
  },
  methods: {
    goTo(name) {
      this.$router.push({ name });
    }
  }
};
</script>

<style lang="less">
@import "./style.less";
</style>

<style lang="less" scoped>
.trials-bg {
  background: no-repeat url("../../assets/backgrounds/trials.jpg");
  height: 20vh;
  background-size: cover;
  background-position: bottom;
}
</style>