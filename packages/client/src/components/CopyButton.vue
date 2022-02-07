<template>
  <CustomButton ref="btn" type="grey" :data-clipboard-text="data">{{
    btnCaption
  }}</CustomButton>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import ClipboardJS from "clipboard";

export default {
  components: { CustomButton },
  props: ["data", "caption"],
  data: () => ({
    isCopied: false,
    timeout: null
  }),
  computed: {
    btnCaption() {
      if (this.isCopied) {
        return this.$t("copied");
      }
      return this.$t(this.caption);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.cp = new ClipboardJS(this.$refs.btn.$el);
      this.cp.on("success", () => {
        this.isCopied = true;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.isCopied = false;
        }, 4000);
      });
    });
  },
  destroyed() {
    this.cp.destroy();
  }
};
</script>
