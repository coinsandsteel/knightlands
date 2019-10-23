export default {
    props: ["parent"],
    useRouterBack: false,
    data: () => ({
        title: null,
        footers: [],
        isActive: false
    }),
    created() {
        this._title = this.title;
    },
    mounted() {
        this.isActive = true;
        this._notifyApp();
    },
    activated() {
        this.isActive = true;
        this._notifyApp();
    },
    deactivated() {
        this.isActive = false;
        this.removeFooter();    
    },
    destroyed() {
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
}