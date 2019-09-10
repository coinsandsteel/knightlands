export default {
    props: ["parent"],
    useRouterBack: false,
    data: () => ({
        title: null,
        footers: []
    }),
    mounted() {
        this._notifyApp();
    },
    activated() {
        this._notifyApp();
    },
    deactivated() {
        this.removeFooter();
    },
    beforeDestroy() {
        this.removeFooter();
    },
    methods: {
        _notifyApp() {
            this.$nextTick(() => {
                this.$app.$emit("section", {
                    title: this.title,
                    handleBackButton: this.handleBackButton.bind(this)
                });
            });
        },
        addFooter(component, props) {
            this.$app.$emit("footer", component, props);
        },
        removeFooter() {
            this.$app.$emit("footer");
        },
        handleBackButton() {
            if (this.$options.useRouterBack) {
                this.$router.back();
                return true;
            }
            return false;
        }
    }
}