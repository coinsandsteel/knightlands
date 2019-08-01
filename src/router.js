import Vue from "vue";
import Router from "vue-router";
import Character from "./views/Character/Character.vue";
import Quest from "./views/Quests/Quest.vue";
import Dividends from "./views/Dividends.vue";
import Login from "./views/Login.vue";
import Admin from "./views/Admin.vue";
import Home from "./views/Home.vue";
import Raids from "./views/Raids/Raids.vue";
import RaidView from "./views/Raids/RaidView.vue";
import RaidSummon from "./views/Raids/RaidSummon.vue";
import RaidsSummonList from "./views/Raids/RaidsSummonList.vue";

Vue.use(Router);

const router = new Router({
  routes: [{
      path: "/home",
      name: "home",
      component: Home,
      meta: {
        requiresAuth: true
      }
    }, {
      path: "/character",
      name: "character",
      component: Character,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/quest/:zone?/:quest?",
      alias: "/home/quest/:zone?/:quest?",
      props: true,
      name: "quests",
      component: Quest,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/raids",
      alias: "/home/raids",
      name: "raids",
      component: Raids,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/raids/summon",
      alias: "/home/raids/summon",
      name: "raids-for-summon",
      component: RaidsSummonList,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/raids/summon/raid/:raid?",
      alias: "/home/raids/summon/:raid?",
      props: true,
      name: "summon-raid",
      component: RaidSummon,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/raids/view/:raid?",
      alias: "/home/raids/view/:raid?",
      props: true,
      name: "view-raid",
      component: RaidView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/dividends",
      props: true,
      name: "dividends",
      component: Dividends,
      meta: {
        requiresAuth: true
      }
    },
    {
      alias: "/login",
      path: "/",
      name: "login",
      component: Login
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin
    }
  ]

});

export default router;