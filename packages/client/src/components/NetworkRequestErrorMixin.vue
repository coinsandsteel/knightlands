<script>
import PromptMixin from "@/components/PromptMixin.vue";

export default {
  mixins: [PromptMixin],
  data: () => ({
    _request: null
  }),
  methods: {
    async performRequest(request) {
      try {
        this._showLoading();
        return await request;
      } catch (exc) {
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
        this._hideLoading();
      }
    },
    async performRequestNoCatch(request) {
      try {
        this._showLoading();

        return await request;
      } finally {
        this._hideLoading();
      }
    },
    _showLoading() {
      this._timeout = setTimeout(200, () => {
        this.$notify({
          group: "loading",
          duration: -1,
          closeOnClick: false
        });
      });
    },
    _hideLoading() {
      clearTimeout(this._timeout);
      this.$notify({
        group: "loading",
        clean: true
      });
    }
  }
};
</script>
