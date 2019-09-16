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
import PrelaunchInventory from "./views/Prelaunch/PrelaunchInventory.vue";
import LinkTelegram from "./views/Prelaunch/LinkTelegram.vue";
import LinkEmail from "./views/Prelaunch/LinkEmail.vue";

import CraftingRoot from "./views/Crafting/CraftingRoot.vue";
import Crafting from "./views/Crafting/Create/Crafting.vue";
import CraftingHome from "./views/Crafting/CraftingHome.vue";

import CraftingUpgrade from "./views/Crafting/Upgrade/CraftingUpgrade.vue";
import UpgradeItem from "./views/Crafting/Upgrade/UpgradeItem.vue";
import Upgrade from "./views/Crafting/Upgrade/Upgrade.vue";

import CraftingUnbind from "./views/Crafting/Unbind/CraftingUnbind.vue";
import UnbindItem from "./views/Crafting/Unbind/UnbindItem.vue";
import Unbind from "./views/Crafting/Unbind/Unbind.vue";

import Craft from "./views/Crafting/Create/Craft.vue";
import Create from "./views/Crafting/Create/Create.vue";

import CraftingEnchant from "./views/Crafting/Enchant/CraftingEnchant.vue";
import Enchant from "./views/Crafting/Enchant/Enchant.vue";
import EnchantItem from "./views/Crafting/Enchant/EnchantItem.vue";

import SummonRoot from "./views/Summon/SummonRoot.vue";
import SummonHome from "./views/Summon/SummonHome.vue";

import ShopRoot from "./views/Summon/Shop/ShopRoot.vue";
import ShopHome from "./views/Summon/Shop/ShopHome.vue";

import ChestsRoot from "./views/Summon/Chests/ChestsRoot.vue";
import ChooseChest from "./views/Summon/Chests/ChooseChest.vue";
import OpenChest from "./views/Summon/Chests/OpenChest.vue";

const router = new Router({
  routes: [
    {
      path: "/crafting",
      name: "",
      component: CraftingRoot,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: "",
          component: CraftingHome
        },
        {
          path: "craft",
          component: Create,
          children: [
            {
              path: "",
              name: "crafting",
              component: Crafting
            },
            {
              name: "craft",
              path: "item/:recipeId",
              component: Craft,
              props: true
            }
          ]
        },
        {
          path: "level",
          component: Upgrade,
          children: [
            {
              path: "",
              name: "crafting-upgrade",
              component: CraftingUpgrade
            },
            {
              path: "item/:itemId",
              name: "upgrade-item",
              component: UpgradeItem,
              props: true
            }
          ]
        },
        {
          path: "upgrade",
          component: Unbind,
          children: [
            {
              path: "",
              name: "crafting-unbind",
              component: CraftingUnbind
            },
            {
              path: "item/:itemId",
              name: "unbind-item",
              component: UnbindItem,
              props: true
            }
          ]
        },
        {
          path: "enchant",
          component: Enchant,
          children: [
            {
              path: "",
              name: "crafting-enchant",
              component: CraftingEnchant
            },
            {
              path: "item/:itemId",
              name: "enchant-item",
              component: EnchantItem,
              props: true
            }
          ]
        }
      ]
    },
    {
      path: "/summon",
      component: SummonRoot,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: "",
          name: "summon",
          component: SummonHome
        },
        {
          path: "chests",
          component: ChestsRoot,
          children: [
            {
              path: "",
              name: "chests",
              component: ChooseChest
            },
            {
              path: "open/:chest",
              name: "open-chest",
              component: OpenChest,
              props: true
            }
          ]
        },
        {
          path: "shop",
          component: ShopRoot,
          children: [
            {
              path: "",
              name: "shop",
              component: ShopHome
            }
          ]
        }
      ]
    },
    {
      path: "/link/:token/:user",
      name: "link-tg",
      component: LinkTelegram,
      props: true,
      meta: {
        noBackButton: true,
        skipReady: true
      }
    },
    {
      path: "/linkmail/:token/:email",
      name: "link-mail",
      component: LinkEmail,
      props: true,
      meta: {
        noBackButton: true,
        skipReady: true
      }
    },
    {
      path: "/",
      alias: "/inventory",
      name: "inventory",
      component: PrelaunchInventory,
      meta: { 
        skipReady: true 
      }
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
      path: "/home/quest/:zone?/:quest?",
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
      children: [
        {
          path: "view/:raid",
          props: true,
          name: "view-raid",
          component: RaidView,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: "summon",
          component: RaidSummoning,
          meta: {
            requiresAuth: true
          },
          children: [
            {
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
        },
        {
          path: "",
          name: "raids",
          component: CurrentRaids,
          meta: {
            requiresAuth: true
          }
        }
      ]
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
      path: "/login",
      name: "login",
      component: Login,
      meta: { 
        skipReady: true 
      }
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin
    }
  ]

});

export default router;