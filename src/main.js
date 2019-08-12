import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import Router from "vue-router";
import LoadScript from "vue-plugin-load-script";
import DrawerLayout from "vue-drawer-layout";
import Vuebar from "vuebar";
import VueAgile from "vue-agile";
import * as ModalDialogs from "vue-modal-dialogs";
import VueCollapse from "vue2-collapse";
import PrettyCheckbox from "pretty-checkbox-vue";
import {
  VueSpinners
} from "@saeris/vue-spinners";
import Notifications from "vue-notification";
import VueResource from "vue-resource";
import vuexI18n from "vuex-i18n";

Vue.use(vuexI18n.plugin, store);
Vue.use(VueResource);
Vue.use(Router);
Vue.use(Notifications);
Vue.use(VueSpinners);
Vue.use(PrettyCheckbox);
Vue.use(VueCollapse);
Vue.use(ModalDialogs);
Vue.use(VueAgile);
Vue.use(Vuebar);
Vue.use(DrawerLayout);
Vue.use(LoadScript);

Vue.config.productionTip = false;

import router from "./router";

import localisationSetup from "./strings/setup";
localisationSetup.setup(Vue.i18n);

window.onload = async () => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
};