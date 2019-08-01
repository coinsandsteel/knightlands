export default {
    props: ["parent"],
    data() {
        return {
            title: "default-title",
            footers: []
        }
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
    beforeDestrpy() {
        this.removeFooter();
    },
    methods: {
        _notifyApp() {
            this.$parent.$emit("section", this);
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