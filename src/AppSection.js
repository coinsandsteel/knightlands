export default {
    props: ["parent"],
    data() {
        return {
            title: "default-title",
            footers: []
        }
    },
    mounted() {
        this._notifyApp();
    },
    activated() {
        this._notifyApp();

        // if (this.handleBackButton) {
        //     this.$app.$on("back", this.handleBackButton.bind(this));
        // }

        // this.$app.$emit("footer", this.footers);
    },
    deactivated() {
        this.removeFooter();
    },
    beforeDestroy() {
        this.removeFooter();
    },
    methods: {
        _notifyApp() {
            this.$app.$emit("section", this);
        },
        addFooter(component, props) {
            this.$app.$emit("footer", component, props);
        },
        removeFooter() {
            this.$app.$emit("footer");
        },
        handleBackButton() {
            return false;
        }
    }
}