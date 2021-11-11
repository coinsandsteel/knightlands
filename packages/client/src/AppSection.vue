<script>
import ActivityMixin from "@/components/ActivityMixin.vue";

export default {
  props: ["parent"],
  mixins: [ActivityMixin],
  useRouterBack: false,
  data: () => ({
    title: null,
    footers: []
  }),
  created() {
    this._title = this.title;
  },
  mounted() {
    this._notifyApp();
  },
  activated() {
    this._onActivated();
    this._notifyApp();
  },
  deactivated() {
    this._onDeactivated();
    this.removeFooter();
  },
  destroyed() {
    this.removeFooter();
  },
  methods: {
    _onActivated() {},
    _onDeactivated() {},
    _notifyApp() {
      this.$nextTick(() => {
        this.$app.$emit("section", {
          title: this.title,
          handleBackButton: this.handleBackButton.bind(this)
        });
      });
    },
    addFooter(component, props) {
      this.hasFooter = true;
      this.$app.$emit("footer", component, props);
    },
    removeFooter() {
      if (this.hasFooter) {
        this.$app.$emit("footer");
      }
    },
    handleBackButton() {
      if (this.$options.useRouterBack) {
        this.$router.back();
        return true;
      }
      return false;
    }
  }
};
</script>
