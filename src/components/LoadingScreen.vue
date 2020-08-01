<template>
  <span></span>
</template>

<script>
export default {
  props: {
    loading: Boolean,
    opacity: {
      type: Number,
      default: 0.4
    }
  },
  watch: {
    loading: {
      immediate: true,
      handler() {
        if (this.loading) {
          this.$notify({
            group: "loading",
            duration: -1,
            closeOnClick: false
          });
        } else {
          this.$notify({
            group: "loading",
            clean: true
          });
        }
      }
    }
  }
};
</script>
