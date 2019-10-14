export default {
    props: ["parent"],
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
        this._notifyApp();
    },
    deactivated() {
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
            return false;
        }
    }
}