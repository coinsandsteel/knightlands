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

const Disenchant = () => import("./views/Crafting/Disenchant/Disenchant.vue");
const DisenchantConvert = () => import("./views/Crafting/Disenchant/DisenchantConvert.vue");
const CraftingDisenchant = () => import("./views/Crafting/Disenchant/CraftingDisenchant.vue");

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

const Dividends = () => import("./views/Dividends/Dividends.vue");
const Settings = () => import("./views/Settings/Settings.vue");

const router = new Router({
  routes: [{
      path: "/castle/crafting",
      name: "",
      component: CraftingRoot,
      meta: {
        requiresAuth: true
      },
      children: [{
          path: "",
          name: "blacksmith",
          component: CraftingHome
        },
        {
          path: "craft",
          component: Create,
          children: [{
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
          children: [{
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
          children: [{
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
          children: [{
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
          path: "disenchant",
          component: Disenchant,
          children: [{
              path: "",
              name: "crafting-disenchant",
              component: CraftingDisenchant
            },
            {
              path: "convert",
              name: "disenchant-convert",
              component: DisenchantConvert
            }
          ]
        },
        {
          path: "recipes",
          component: RecipeBookRoot,
          children: [{
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
      children: [{
          path: "",
          name: "summon",
          component: SummonHome
        },
        {
          path: "chests",
          component: ChestsRoot,
          children: [{
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
          children: [{
            path: "",
            name: "shop",
            component: ShopHome
          }]
        },
        {
          path: "army",
          component: () => import("./views/Summon/Army/ArmySummonRoot.vue"),
          children: [{
              path: "",
              name: "army-summon-menu",
              component: () => import("./views/Summon/Army/ArmySummonMenu.vue")
            },
            {
              path: "gate",
              name: "army-summon",
              component: () => import("./views/Summon/Army/ArmySummonGate.vue"),
              props: true
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
      children: [{
        path: "",
        name: "adventures",
        component: Adventures
      }],
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/home/onyx-tower",
      component: ForsakenTowerRoot,
      children: [{
        path: "",
        name: "onyx-tower",
        component: ForsakenTower
      }],
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/home/trials",
      component: () => import("./views/Trials/TrialsRoot.vue"),
      children: [{
          path: "",
          component: () => import("./views/Trials/Trials.vue")
        },
        {
          path: "honor",
          name: "trial-honor",
          component: () => import("./views/Trials/Honor/TrialsOfHonor.vue"),
          children: [{
            path: "",
            name: "trials-of-honor",
            component: () => import("./views/Trials/Honor/TrialsList.vue")
          }]
        },
        {
          path: "conjured",
          name: "trial-conjured",
          component: () => import("./views/Trials/Conjured/ConjuredTrials.vue"),
          children: [{
            path: "",
            name: "conjured-trials",
            component: () => import("./views/Trials/Conjured/TrialsList.vue")
          }]
        },
        {
          path: "decay",
          name: "trial-decay",
          component: () => import("./views/Trials/Decay/TrialsOfDecay.vue"),
          children: [{
            path: "",
            name: "trials-of-decay",
            component: () => import("./views/Trials/Decay/TrialsList.vue")
          }]
        }
      ],
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/home/rankings",
      component: () => import("./views/Rankings/Rankings.vue"),
      meta: {
        requiresAuth: true
      },
      children: [{
          name: "rankings",
          path: "",
          component: () => import("./views/Rankings/RankingsMenu.vue")
        },
        {
          path: "leaderboards",
          component: () => import("./views/Rankings/Leaderboards/Leaderboards.vue"),
          children: [{
              name: "leaderboards",
              path: "",
              component: () => import("./views/Rankings/Leaderboards/LeaderboardsList.vue")
            },
            {
              name: "leaderboard-view",
              path: "view/:id",
              component: () => import("./views/Rankings/Leaderboards/LeaderboardView.vue"),
              props: true
            }
          ]
        },
        {
          path: "tournaments",
          component: () => import("./views/Rankings/Tournaments/Tournaments.vue"),
          children: [{
              name: "tournaments",
              path: "",
              component: () => import("./views/Rankings/Tournaments/TournamentList.vue")
            },
            {
              name: "tournament-claim-rewards",
              path: "rewards",
              props: true,
              component: () => import("./views/Rankings/Tournaments/TournamentsClaimRewards.vue")
            },
            {
              path: ":id",
              name: "tournament",
              props: true,
              component: () => import("./views/Rankings/Tournaments/TournamentView.vue"),
              children: [{
                  path: "ranks",
                  name: "tournament-ranks",
                  component: () => import("./views/Rankings/Tournaments/TournamentRanks.vue"),
                  props: true
                },
                {
                  path: "rewards",
                  name: "tournament-rewards",
                  component: () => import("./views/Rankings/Tournaments/TournamentRewards.vue"),
                  props: true
                }
              ]
            }
          ]
        },
        {
          path: "races",
          component: () => import("./views/Rankings/Races/Races.vue"),
          children: [{
              name: "races",
              path: "",
              component: () => import("./views/Rankings/Races/RacesList.vue")
            },
            {
              name: "race-claim-rewards",
              path: "rewards",
              props: true,
              component: () => import("./views/Rankings/Races/RacesClaimRewards.vue")
            },
            {
              path: "r/:id",
              name: "race",
              props: true,
              component: () => import("./views/Rankings/Races/RaceView.vue"),
              children: [{
                  path: "ranks",
                  name: "race-ranks",
                  component: () => import("./views/Rankings/Races/RaceRanks.vue"),
                  props: true
                },
                {
                  path: "rewards",
                  name: "race-rewards",
                  component: () => import("./views/Rankings/Races/RaceRewards.vue"),
                  props: true
                }
              ]
            },
            {
              name: "race-shop",
              path: "shop",
              component: () => import("./views/Rankings/Races/RaceShop.vue")
            }
          ]
        }
      ]
    },
    {
      path: "/social",
      name: "social",
      component: () => import("./views/Social/Social.vue"),
      meta: {
        requiresAuth: true
      },
      children: [{
        path: "chat",
        component: () => import("./views/Social/Chat/Chat.vue"),
        children: [{
          path: "",
          name: "world-chat",
          component: () => import("./views/Social/Chat/WorldChat.vue")
        }]
      }]
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
      path: "/castle",
      name: "castle",
      component: () => import("./views/Castle/Castle.vue"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/castle/army",
      name: "",
      component: () => import("./views/Army/ArmyRoot.vue"),
      meta: {
        requiresAuth: true
      },
      children: [{
          path: "composition",
          name: "army-composition",
          component: () => import("./views/Army/ArmyComposition.vue")
        },
        {
          path: "legion/:type",
          name: "legion",
          component: () => import("./views/Army/EditLegion.vue"),
          props: true
        },
        {
          path: "edit-legion/:legion/:type/:slotId",
          name: "edit-legion",
          component: () => import("./views/Army/EditLegionSlot.vue"),
          props: true
        },
        {
          path: "edit-unit",
          component: () => import("./views/Army/Unit/ArmyUnitRoot.vue"),
          meta: {
            noTopBar: false
          },
          children: [{
              path: "",
              name: "edit-unit",
              component: () => import("./views/Army/Unit/ArmyUnitSelect.vue"),
            },
            {
              path: "unit/:unitId",
              props: true,
              component: () => import("./views/Army/Unit/ArmyUnit.vue"),
              children: [{
                  path: "",
                  name: "unit-level",
                  component: () => import("./views/Army/Unit/UnitLevelUp.vue")
                },
                {
                  path: "equip",
                  name: "unit-equip",
                  component: () => import("./views/Army/Unit/UnitEquipment.vue")
                },
                {
                  path: "promo",
                  name: "unit-promo",
                  component: () => import("./views/Army/Unit/UnitPromotion.vue")
                }
              ]
            }
          ]
        },
        {
          meta: {
            noTopBar: true
          },
          path: "banishment",
          component: () => import("./views/Army/Banishment/BanishmentRoot.vue"),
          children: [{
            path: "",
            name: "banishment",
            component: () => import("./views/Army/Banishment/Banishment.vue")
          }]
        },
        {
          meta: {
            noTopBar: true
          },
          path: "ability-transfer",
          component: () => import("./views/Army/AbilityTransfer/AbilityTransferRoot.vue"),
          children: [{
              path: "",
              name: "ability-transfer",
              component: () => import("./views/Army/AbilityTransfer/AbilityTransfer.vue"),
              props: true
            },
            {
              path: "select/:from",
              name: "ability-transfer-select",
              component: () => import("./views/Army/AbilityTransfer/AbilityTransferSelectUnit.vue"),
              props: true
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
      children: [{
          path: "",
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
      children: [{
          path: "view/:raid",
          props: true,
          name: "view-raid",
          component: RaidView
        },
        {
          path: "summon",
          component: RaidSummoning,
          children: [{
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
