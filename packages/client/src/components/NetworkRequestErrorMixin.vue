<script>
import PromptMixin from "@/components/PromptMixin.vue";

const DEFAULT_TIMEOUT = 1000;

export default {
  mixins: [PromptMixin],
  created() {
    this._modalUp = false;
  },
  methods: {
    async performRequest(request) {
      let timeout;
      try {
        timeout = this._showLoading();
        return await request;
      } catch (exc) {
        console.error(exc);
        if (!this._modalUp) {
          let cb = async () => {
            this._modalUp = true;
            await this.showPrompt(
              this.$t("prompt-snap-title"),
              this.$t("prompt-snap-msg"),
              [
                {
                  type: "green",
                  title: this.$t("btn-ok"),
                  response: true
                }
              ]
            );
            this._modalUp = false;
          };
          cb();
        }

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
      }, this.$options.loadingTimeout || DEFAULT_TIMEOUT);
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
