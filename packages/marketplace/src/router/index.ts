import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Market from "../views/browse/Market.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/browse",
    name: "Browse",
    component: Market
  }
];

const router = new VueRouter({
  routes
});

export default router;
