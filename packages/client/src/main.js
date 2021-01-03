import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import Router from "vue-router";
import LoadScript from "vue-plugin-load-script";
import Vuebar from "./vuebar";
import VueAgile from "vue-agile";
import * as ModalDialogs from "vue-modal-dialogs";
import VueCollapse from "vue2-collapse";
import PrettyCheckbox from "pretty-checkbox-vue";
import { VueSpinners } from "@saeris/vue-spinners";
import Notifications from "vue-notification";
import VueResource from "vue-resource";
import vuexI18n from "vuex-i18n";
import PortalVue from "portal-vue";
import VueVirtualScroller from "vue-virtual-scroller";
import Vue2TouchEvents from "vue2-touch-events";
import EasySlider from "vue-easy-slider";
import AsyncComputed from "vue-async-computed";

import RecipeScheme from "@/views/Crafting/RecipeBook/RecipeScheme.vue";
Vue.component("recipe-scheme", RecipeScheme);

Vue.use(AsyncComputed);
Vue.use(EasySlider);
Vue.use(Vue2TouchEvents);
Vue.use(VueVirtualScroller);
Vue.use(PortalVue);
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
Vue.use(LoadScript);

Vue.config.debug = true;
Vue.config.productionTip = false;

// Vue.config.optionMergeStrategies.myOption = function(toVal, fromVal) {
//   console.log(toVal, fromVal);
// };

import router from "./router";

import localisationSetup from "./strings/setup";
localisationSetup.setup(Vue.i18n);

import Game from "./game";

Vue.prototype.$game = new Game(store);

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!Vue.prototype.$game.authenticated) {
      next({
        name: "login",
        query: { url: to.fullPath }
      });
      return;
    }
  }
  next();
});

window.onload = async () => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
};
