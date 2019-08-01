import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import LoadScript from "vue-plugin-load-script";
import DrawerLayout from "vue-drawer-layout";
import Vuebar from "vuebar";
import VueAgile from "vue-agile";
import * as ModalDialogs from "vue-modal-dialogs";
import VueCollapse from "vue2-collapse";
import PrettyCheckbox from "pretty-checkbox-vue";
import Game from "./game";

Vue.use(PrettyCheckbox);
Vue.use(VueCollapse);
Vue.use(ModalDialogs);
Vue.use(VueAgile);
Vue.use(Vuebar);
Vue.use(DrawerLayout);
Vue.use(LoadScript);
Vue.config.productionTip = false;

window.onload = async () => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
};