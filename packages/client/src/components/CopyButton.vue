<template>
  <CustomButton
    ref="btn"
    type="grey"
    :caption="btnCaption"
    :data-clipboard-text="data"
    >{{ $t(btnCaption) }}</CustomButton
  >
</template>

<script>
import CustomButton from "@/components/Button.vue";
import ClipboardJS from "clipboard";

export default {
  components: { CustomButton },
  props: ["data", "caption"],
  data: () => ({
    btnCaption: ""
  }),
  mounted() {
    this.btnCaption = this.$t(this.caption);

    this.$nextTick(() => {
      this.cp = new ClipboardJS(this.$refs.btn.$el);
      this.cp.on("success", e => {
        this.btnCaption = this.$t("copied");
        setTimeout(() => {
          this.btnCaption = this.$t(this.caption);
        }, 4000);
      });
    });
  },
  destroyed() {
    this.cp.destroy();
  }
};
</script>
