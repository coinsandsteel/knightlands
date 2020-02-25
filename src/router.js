import Router from "vue-router";

const Character = () => import("./views/Character/Character.vue");
const CharacterTraining = () => import("./views/Character/Training/Stats.vue");
const CharacterInventory = () => import("./views/Character/Inventory.vue");
const CharacterBuffs = () => import("./views/Character/Buffs/Buffs.vue");
const CharacterBeast = () => import("./views/Character/BeastTaming/BeastTaming.vue")

const Quest = () => import("./views/Quests/Quest.vue");
const Login = () => import("./views/Login.vue");
const Admin = () => import("./views/Admin.vue");
const Home = () => import("./views/Home.vue");
const Raids = () => import("./views/Raids/Raids.vue");
const RaidView = () => import("./views/Raids/RaidView.vue");
const RaidSummon = () => import("./views/Raids/RaidSummon.vue");
const RaidsSummonList = () => import("./views/Raids/RaidsSummonList.vue");
const CurrentRaids = () => import("./views/Raids/CurrentRaids.vue");
const RaidSummoning = () => import("./views/Raids/RaidSummoning.vue");
const PrelaunchInventory = () => import("./views/Prelaunch/PrelaunchInventory.vue");
const LinkTelegram = () => import("./views/Prelaunch/LinkTelegram.vue");
const LinkEmail = () => import("./views/Prelaunch/LinkEmail.vue");

const CraftingRoot = () => import("./views/Crafting/CraftingRoot.vue");
const Crafting = () => import("./views/Crafting/Create/Crafting.vue");
const CraftingHome = () => import("./views/Crafting/CraftingHome.vue");

const CraftingUpgrade = () => import("./views/Crafting/Upgrade/CraftingUpgrade.vue");
const UpgradeItem = () => import("./views/Crafting/Upgrade/UpgradeItem.vue");
const Upgrade = () => import("./views/Crafting/Upgrade/Upgrade.vue");

const CraftingUnbind = () => import("./views/Crafting/Unbind/CraftingUnbind.vue");
const UnbindItem = () => import("./views/Crafting/Unbind/UnbindItem.vue");
const Unbind = () => import("./views/Crafting/Unbind/Unbind.vue");

const Craft = () => import("./views/Crafting/Create/Craft.vue");
const Create = () => import("./views/Crafting/Create/Create.vue");

const RecipeBookRoot = () => import("./views/Crafting/RecipeBook/RecipeBookRoot.vue");
const RecipeBook = () => import("./views/Crafting/RecipeBook/RecipeBook.vue");
const RecipeBookPage = () => import("./views/Crafting/RecipeBook/RecipeBookPage.vue");

const CraftingEnchant = () => import("./views/Crafting/Enchant/CraftingEnchant.vue");
const Enchant = () => import("./views/Crafting/Enchant/Enchant.vue");
const EnchantItem = () => import("./views/Crafting/Enchant/EnchantItem.vue");

const SummonRoot = () => import("./views/Summon/SummonRoot.vue");
const SummonHome = () => import("./views/Summon/SummonHome.vue");

const ShopRoot = () => import("./views/Summon/Shop/ShopRoot.vue");
const ShopHome = () => import("./views/Summon/Shop/ShopHome.vue");

const ChestsRoot = () => import("./views/Summon/Chests/ChestsRoot.vue");
const ChooseChest = () => import("./views/Summon/Chests/ChooseChest.vue");
const OpenChest = () => import("./views/Summon/Chests/OpenChest.vue");

const AdventuresRoot = () => import("./views/Adventures/AdventuresRoot.vue");
const Adventures = () => import("./views/Adventures/Adventures.vue");

const ForsakenTowerRoot = () => import("./views/ForsakenTower/ForsakenTowerRoot.vue");
const ForsakenTower = () => import("./views/ForsakenTower/ForsakenTower.vue");

const DailyRewards = () => import("./views/DailyRewards/DailyRewards.vue");

const TrialsRoot = () => import("./views/Trials/TrialsRoot.vue");
const HonorTrials = () => import("./views/Trials/Trials.vue");
const TrialsOfHonor = () => import("./views/Trials/Honor/TrialsOfHonor.vue");
const HonorTrialsList = () => import("./views/Trials/Honor/TrialsList.vue");

const Dividends = () => import("./views/Dividends/Dividends.vue");
const Settings = () => import("./views/Settings/Settings.vue");

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
        },
        {
          path: "recipes",
          component: RecipeBookRoot,
          children: [
            {
              path: "",
              name: "recipe-book",
              component: RecipeBook
            },
            {
              path: "page/:recipeId",
              name: "recipe-book-page",
              component: RecipeBookPage,
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
      path: "/home/daily-rewards",
      component: DailyRewards,
    },
    {
      path: "/home/adventures",
      component: AdventuresRoot,
      children: [
        {
          path: "",
          name: "adventures",
          component: Adventures
        }
      ],
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/home/onyx-tower",
      component: ForsakenTowerRoot,
      children: [
        {
          path: "",
          name: "onyx-tower",
          component: ForsakenTower
        }
      ],
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/home/trials",
      component: TrialsRoot,
      children: [
        {
          path: "",
          component: HonorTrials
        },
        {
          path: "honor",
          name: "trial-honor",
          component: TrialsOfHonor,
          children: [
            {
              path: "",
              name: "trials-of-honor",
              component: HonorTrialsList
            }
          ]
        },
        {
          path: "conjured",
          name: "trial-conjured",
          component: () => import("./views/Trials/Conjured/ConjuredTrials.vue"),
          children: [
            {
              path: "",
              name: "conjured-trials",
              component: () => import("./views/Trials/Conjured/TrialsList.vue")
            }
          ]
        }
      ],
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/home/gold",
      name: "gold-exchange",
      component: () => import("./views/GoldExchange/GoldExchange.vue"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/home/daily-quests",
      name: "daily-quests",
      component: () => import("./views/DailyQuests/DailyQuests.vue"),
      meta: {
        requiresAuth: true
      }
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
    },
    {
      path: "/home",
      name: "home",
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/character",
      component: Character,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: "inventory",
          name: "character",
          component: CharacterInventory
        },
        {
          path: "training",
          name: "character-training",
          component: CharacterTraining
        },
        {
          path: "buffs",
          name: "character-buffs",
          component: CharacterBuffs
        },
        {
          path: "beast",
          name: "character-beast",
          component: CharacterBeast
        }
      ]
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
          component: RaidView
        },
        {
          path: "summon",
          component: RaidSummoning,
          children: [
            {
              path: ":raid",
              props: true,
              name: "summon-raid",
              component: RaidSummon
            },
            {
              path: "",
              name: "raids-for-summon",
              component: RaidsSummonList
            }
          ]
        },
        {
          path: "",
          name: "raids",
          component: CurrentRaids
        }
      ]
    },
    {
      path: "/home/dividends",
      props: true,
      name: "dividends",
      component: Dividends,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/home/settings",
      props: true,
      name: "settings",
      component: Settings,
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