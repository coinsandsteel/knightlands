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
import CurrentRaids from "./views/Raids/CurrentRaids.vue";
import RaidSummoning from "./views/Raids/RaidSummoning.vue";
import PrelaunchInventory from "./views/AccountLinking/PrelaunchInventory.vue";
import LinkTelegram from "./views/AccountLinking/LinkTelegram.vue";

const router = new Router({
  routes: [{
    path: "/link/:token/:user",
    name: "link-tg",
    component: LinkTelegram,
    props: true,
    meta: {
      noBackButton: true
    }
  },
  {
    path: "/",
    alias: "/inventory",
    name: "inventory",
    component: PrelaunchInventory
  }, {
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
    path: "/home/raids",
    component: Raids,
    meta: {
      requiresAuth: true
    },
    children: [{
      path: "view/:raid",
      props: true,
      name: "view-raid",
      component: RaidView,
      meta: {
        requiresAuth: true
      }
    }, {
      path: "summon",
      component: RaidSummoning,
      meta: {
        requiresAuth: true
      },
      children: [{
        path: ":raid",
        props: true,
        name: "summon-raid",
        component: RaidSummon,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "",
        name: "raids-for-summon",
        component: RaidsSummonList,
        meta: {
          requiresAuth: true
        }
      }
      ]
    }, {
      path: "",
      name: "raids",
      component: CurrentRaids,
      meta: {
        requiresAuth: true
      }
    }]
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
    path: "/login",
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