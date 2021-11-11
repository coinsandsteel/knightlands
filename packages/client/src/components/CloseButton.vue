<template>
  <div class="close-btn" @click="handleClose">
    <SoundEffect ref="fx" :files="['btn_click1']" channel="ui" />
  </div>
</template>

<script>
import SoundEffect from "./SoundEffect.vue";

export default {
  components: { SoundEffect },
  methods: {
    handleClose() {
      this.$refs.fx.play();
      this.$emit("click");
    }
  }
};
</script>
