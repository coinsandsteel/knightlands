<script>
import PromptMixin from "@/components/PromptMixin.vue";

export default {
  mixins: [PromptMixin],
  methods: {
    async performRequest(request) {
      let timeout;
      try {
        timeout = this._showLoading();
        return await request;
      } catch (exc) {
        console.error(exc);
        this.showPrompt(
          this.$t("request-error-title"),
          this.$t("request-desc"),
          [
            {
              type: "green",
              title: this.$t("btn-ok"),
              response: true
            }
          ]
        );

        throw exc;
      } finally {
        this._hideLoading(timeout);
      }
    },
    async performRequestNoCatch(request) {
      let timeout;

      try {
        timeout = this._showLoading();

        return await request;
      } finally {
        this._hideLoading(timeout);
      }
    },
    _showLoading() {
      return setTimeout(() => {
        this.$notify({
          group: "loading",
          duration: -1,
          closeOnClick: false
        });
      }, 200);
    },
    _hideLoading(timeout) {
      clearTimeout(timeout);
      this.$notify({
        group: "loading",
        clean: true
      });
    }
  }
};
</script>
