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
        await request;
      } catch (exc) {
        await this.showPrompt(
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
      }
    }
  }
};
</script>
