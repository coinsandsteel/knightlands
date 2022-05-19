/* eslint-disable no-unused-vars */
/*jshint esversion: 9 */

import Router from "vue-router";

const Character = () =>
  import(/* webpackChunkName: "Character" */ "./views/Character/Character.vue");
const CharacterTraining = () =>
  import(
    /* webpackChunkName: "Stats" */ "./views/Character/Training/Stats.vue"
  );
const CharacterEquipment = () =>
  import(
    /* webpackChunkName: "Equipment" */ "./views/Character/Equipment/Equipment.vue"
  );
const CharacterBuffs = () =>
  import(/* webpackChunkName: "Buffs" */ "./views/Character/Buffs/Buffs.vue");
const CharacterMisc = () =>
  import(/* webpackChunkName: "MiscTab" */ "./views/Character/MiscTab.vue");

const Quest = () =>
  import(/* webpackChunkName: "Quest" */ "./views/Quests/Quest.vue");
const Login = () => import(/* webpackChunkName: "Login" */ "./views/Login.vue");
const Admin = () => import(/* webpackChunkName: "Admin" */ "./views/Admin.vue");
const Home = () => import(/* webpackChunkName: "Home" */ "./views/Home.vue");
const Raids = () => import("./views/Raids/Raids.vue");
const RaidView = () => import("./views/Raids/RaidView.vue");
const RaidSummon = () => import("./views/Raids/RaidSummon.vue");
const RaidsSummonList = () => import("./views/Raids/RaidsSummonList.vue");
const CurrentRaids = () => import("./views/Raids/CurrentRaids.vue");
const RaidSummoning = () => import("./views/Raids/RaidSummoning.vue");
const PrelaunchInventory = () =>
  import("./views/Prelaunch/PrelaunchInventory.vue");
const LinkTelegram = () => import("./views/Prelaunch/LinkTelegram.vue");
const LinkEmail = () => import("./views/Prelaunch/LinkEmail.vue");

const CraftingRoot = () => import("./views/Crafting/CraftingRoot.vue");
const Crafting = () => import("./views/Crafting/Create/Crafting.vue");
const CraftingHome = () => import("./views/Crafting/CraftingHome.vue");

const CraftingUpgrade = () =>
  import("./views/Crafting/LevelUp/CraftingUpgrade.vue");
const UpgradeItem = () => import("./views/Crafting/LevelUp/UpgradeItem.vue");
const Upgrade = () => import("./views/Crafting/LevelUp/Upgrade.vue");

const CraftingUnbind = () =>
  import("./views/Crafting/Unbind/CraftingUnbind.vue");
const UnbindItem = () => import("./views/Crafting/Unbind/UnbindItem.vue");
const Unbind = () => import("./views/Crafting/Unbind/Unbind.vue");

const Craft = () => import("./views/Crafting/Create/Craft.vue");
const Create = () => import("./views/Crafting/Create/Create.vue");

const RecipeBookRoot = () =>
  import("./views/Crafting/RecipeBook/RecipeBookRoot.vue");
const RecipeBook = () => import("./views/Crafting/RecipeBook/RecipeBook.vue");
const RecipeBookPage = () =>
  import("./views/Crafting/RecipeBook/RecipeBookPage.vue");

const CraftingEnchant = () =>
  import("./views/Crafting/Enchant/CraftingEnchant.vue");
const Enchant = () => import("./views/Crafting/Enchant/Enchant.vue");
const EnchantItem = () => import("./views/Crafting/Enchant/EnchantItem.vue");

const Convert = () => import("./views/Crafting/Convert/Convert.vue");
const Disenchant = () => import("./views/Crafting/Disenchant/Disenchant.vue");
const CraftingDisenchant = () =>
  import("./views/Crafting/Disenchant/CraftingDisenchant.vue");

const SummonRoot = () => import("./views/Summon/SummonRoot.vue");
const SummonHome = () => import("./views/Summon/SummonHome.vue");

const XmasRoot = () => import("./views/Xmas/XmasRoot.vue");

const LunarRoot = () => import("./views/Lunar/LunarRoot.vue");
const MarchRoot = () => import("./views/March/MarchRoot.vue");
const AprilRoot = () => import("./views/April/AprilRoot.vue");
const BattleRoot = () => import("./views/Battle/BattleRoot.vue");

const DungeonRoot = () => import("./views/Dungeon/DungeonRoot.vue");
const DungeonSections = () => import("./views/Dungeon/DungeonSections.vue");
const Dungeon = () => import("./views/Dungeon/Dungeon.vue");
const DungeonFight = () => import("./views/Dungeon/DungeonFight.vue");
const DungeonRankings = () =>
  import("./views/Dungeon/Rankings/DungeonRankings.vue");
const DungeonUser = () => import("./views/Dungeon/DungeonUser.vue");

const ChestsRoot = () => import("./views/Summon/Chests/ChestsRoot.vue");
const ChooseChest = () => import("./views/Summon/Chests/ChooseChest.vue");
const OpenChest = () => import("./views/Summon/Chests/OpenChest.vue");

const AdventuresRoot = () => import("./views/Adventures/AdventuresRoot.vue");
const Adventures = () => import("./views/Adventures/Adventures.vue");

const ForsakenTowerRoot = () =>
  import("./views/ForsakenTower/ForsakenTowerRoot.vue");
const ForsakenTower = () => import("./views/ForsakenTower/ForsakenTower.vue");

const DailyRewards = () => import("./views/DailyRewards/DailyRewards.vue");

const Settings = () => import("./views/Settings/Settings.vue");
const NewXmasForm = () => import("./views/Xmas/NewXmasHome.vue");

const router = new Router({
  routes: [
    {
      path: "/castle/crafting",
      name: "",
      component: CraftingRoot,
      meta: {
        requiresAuth: true,
        music: "lab"
      },
      children: [
        {
          path: "",
          name: "alchemy-lab",
          component: CraftingHome
        },
        {
          path: "convert",
          name: "convert",
          component: Convert,
          props: { entity: "shard" }
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
          path: "craft-acc",
          component: () =>
            import("./views/Crafting/Accessories/Craft/AccessoriesRoot.vue"),
          children: [
            {
              path: "",
              name: "create-acc-list",
              component: () =>
                import("./views/Crafting/Accessories/Craft/Accessories.vue")
            },
            {
              path: ":ring/:template",
              name: "create-acc",
              component: () =>
                import("./views/Crafting/Accessories/Craft/AccessoryCraft.vue"),
              props: true
            }
          ]
        },
        {
          path: "reroll-acc",
          component: () =>
            import("./views/Crafting/Accessories/Reroll/AccessoriesRoot.vue"),
          children: [
            {
              path: "",
              name: "reroll-acc-list",
              component: () =>
                import("./views/Crafting/Accessories/Reroll/Accessories.vue")
            },
            {
              path: ":itemId",
              name: "reroll-acc",
              component: () =>
                import(
                  "./views/Crafting/Accessories/Reroll/AccessoryReroll.vue"
                ),
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
          path: "disenchant",
          component: Disenchant,
          children: [
            {
              path: "",
              name: "crafting-disenchant",
              component: CraftingDisenchant
            },
            {
              path: "convert",
              name: "disenchant-convert",
              component: Convert,
              props: { entity: "dust" }
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
        },
        {
          path: "elemental",
          component: () =>
            import("./views/Crafting/CreateElementalWeapons/Root.vue"),
          children: [
            {
              path: "",
              name: "weapon-categories",
              component: () =>
                import(
                  "./views/Crafting/CreateElementalWeapons/SelectCategory.vue"
                )
            },
            {
              path: "create/:type",
              name: "new-elemental",
              component: () =>
                import(
                  "./views/Crafting/CreateElementalWeapons/New/Weapon.vue"
                ),
              props: true
            },
            {
              path: "select/:itemTemplate",
              name: "select-for-elem",
              component: () => import("./views/Crafting/SelectEquipment.vue"),
              props: true
            }
          ]
        },
        {
          path: "evolve",
          component: () => import("./views/Crafting/Evolve/Root.vue"),
          children: [
            {
              path: "",
              component: () => import("./views/Crafting/Evolve/ItemList.vue")
            },
            {
              path: "item/:baseItemId",
              props: true,
              name: "evolve-item",
              component: () => import("./views/Crafting/Evolve/Evolve.vue")
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
          name: "",
          component: () => import("./views/Summon/Shop/ShopHome.vue"),
          children: [
            {
              path: "",
              alias: "/",
              name: "daily-shop",
              component: () => import("./views/Summon/Shop/ShopDaily.vue")
            },
            {
              path: "packs",
              name: "packs",
              component: () => import("./views/Summon/Shop/ShopPacks.vue")
            },
            {
              path: "top-up",
              name: "top-up",
              component: () => import("./views/Summon/Shop/ShopTopUp.vue")
            },
            {
              path: "gold",
              name: "shop-gold",
              component: () => import("./views/Summon/Shop/ShopGold.vue")
            },
            {
              path: "cards",
              name: "sub-shop",
              component: () =>
                import("./views/Summon/Shop/ShopSubscription.vue")
            }
          ]
        },
        {
          path: "army",
          component: () => import("./views/Summon/Army/ArmySummonRoot.vue"),
          children: [
            {
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
      component: DailyRewards
    },
    {
      path: "/halloween",
      component: DungeonRoot,
      children: [
        {
          path: "",
          name: "dungeon-entrance",
          component: () => import("./views/Dungeon/Entrance.vue"),
          meta: { noTopBar: true }
        },
        {
          path: "fight",
          name: "dungeon-fight",
          component: DungeonFight,
          meta: { noTopBar: true, noBackButton: true }
        },
        {
          path: "dungeon",
          name: "dungeon-sections",
          component: DungeonSections,
          meta: { noTopBar: true },
          children: [
            {
              path: "",
              name: "dungeon",
              component: Dungeon
            },
            {
              path: "rankings",
              name: "dungeon-rankings",
              component: DungeonRankings
            },
            {
              path: "user",
              name: "dungeon-user",
              component: DungeonUser
            }
          ]
        }
      ],
      meta: {
        requiresAuth: true
      }
    },
    // {
    //   path: "/xmas",
    //   component: XmasRoot,
    //   children: [
    //     {
    //       path: "",
    //       name: "xmas-home",
    //       component: () => import("./views/Xmas/XmasHome.vue")
    //     },
    //     {
    //       path: "new",
    //       name: "xmas-new",
    //       component: NewXmasForm
    //     }
    //   ],
    //   meta: {
    //     requiresAuth: true
    //   }
    // },
    {
      path: "/lunar",
      component: LunarRoot,
      children: [
        {
          path: "",
          redirect: { name: "lunar-craft" }
        },
        {
          path: "craft",
          name: "lunar-craft",
          component: () => import("./views/Lunar/LunarCraft.vue")
        },
        {
          path: "recipes",
          name: "lunar-recipes",
          component: () => import("./views/Lunar/LunarRecipes.vue")
        },
        {
          path: "exchange",
          name: "lunar-exchange",
          component: () => import("./views/Lunar/LunarExchange.vue")
        },
        {
          path: "nft",
          name: "lunar-nft",
          component: () => import("./views/Lunar/LunarNft.vue")
        },
        {
          path: "shop",
          name: "lunar-shop",
          component: () => import("./views/Lunar/LunarShop.vue")
        }
      ],
      meta: {
        requiresAuth: true,
        noBackButton: true
      }
    },
    {
      path: "/march",
      component: MarchRoot,
      children: [
        {
          path: "",
          redirect: { name: "march-play" }
        },
        {
          path: "play",
          name: "march-play",
          component: () => import("./views/March/MarchPlay.vue")
        },
        {
          path: "pets",
          name: "march-pets",
          component: () => import("./views/March/MarchPets.vue")
        },
        {
          path: "rankings",
          name: "march-rankings",
          component: () => import("./views/March/Rankings/MarchRankings.vue")
        },
        {
          path: "shop",
          name: "march-shop",
          component: () => import("./views/March/MarchShop.vue")
        },
        {
          path: "rewards",
          name: "march-rewards",
          component: () => import("./views/March/MarchRewards.vue")
        }
      ],
      meta: {
        requiresAuth: true,
        noBackButton: true
      }
    },
    {
      path: "/april",
      component: AprilRoot,
      children: [
        {
          path: "",
          redirect: { name: "april-play" }
        },
        {
          path: "play",
          name: "april-play",
          component: () => import("./views/April/AprilPlay.vue")
        },
        {
          path: "rankings",
          name: "april-rankings",
          component: () => import("./views/April/AprilRankings.vue")
        },
        {
          path: "achievements",
          name: "april-achievements",
          component: () => import("./views/April/AprilAchievements.vue")
        },
        {
          path: "shop",
          name: "april-shop",
          component: () => import("./views/April/AprilShop.vue")
        }
      ],
      meta: {
        requiresAuth: true,
        noBackButton: false
      }
    },
    {
      path: "/battle-units/:slot?/:index?",
      name: "battle-units",
      component: () => import("./views/Battle/BattleUnits.vue"),
      meta: {
        requiresAuth: true,
        noBackButton: false
      }
    },
    {
      path: "/battle-unit/:id",
      name: "battle-unit-details",
      component: () => import("./views/Battle/BattleUnitDetails.vue"),
      meta: {
        requiresAuth: true,
        noBackButton: false
      }
    },
    {
      path: "/battle",
      component: BattleRoot,
      children: [
        {
          path: "",
          name: "battle-menu",
          component: () => import("./views/Battle/BattleMenu.vue")
        },
        {
          path: "adventure",
          component: () => import("./views/Battle/BattleAdventureRoot.vue"),
          children: [
            {
              path: "",
              name: "battle-adventure",
              component: () => import("./views/Battle/BattleAdventure.vue")
            },
            {
              path: ":id/squad",
              name: "battle-adventure-squad",
              component: () => import("./views/Battle/BattleAdventureSquad.vue")
            },
            {
              path: ":id/play",
              name: "battle-adventure-play",
              component: () => import("./views/Battle/BattleAdventurePlay.vue")
            }
          ]
        },
        {
          path: "duels",
          component: () => import("./views/Battle/BattleDuelsRoot.vue"),
          children: [
            {
              path: "",
              name: "battle-duels",
              component: () => import("./views/Battle/BattleDuels.vue")
            },
            {
              path: ":id/play",
              name: "battle-duels-play",
              component: () => import("./views/Battle/BattleDuelsPlay.vue")
            }
          ]
        },
        // {
        //   path: "duels",
        //   name: "battle-duels",
        //   component: () => import("./views/Battle/BattleDuels.vue")
        // },
        // {
        //   path: "squad",
        //   name: "battle-squad",
        //   component: () => import("./views/Battle/BattleSquad.vue")
        // },
        {
          path: "squad",
          component: () => import("./views/Battle/BattleSquadRoot.vue"),
          children: [
            {
              path: "",
              name: "battle-squad-home",
              component: () => import("./views/Battle/BattleSquad.vue")
            },
            {
              path: "warehouse",
              name: "battle-squad-warehouse",
              component: () => import("./views/Battle/BattleSquadWarehouse.vue")
            },
            {
              path: "bonus",
              name: "battle-squad-bonus",
              component: () => import("./views/Battle/BattleSquadBonus.vue")
            },
            {
              path: "unit/:id",
              name: "battle-squad-unit",
              component: () => import("./views/Battle/BattleSquadUnit.vue")
            }
          ],
          meta: {
            requiresAuth: true,
            noBackButton: false
          }
        },
        {
          path: "merger",
          name: "battle-merger",
          component: () => import("./views/Battle/BattleMerger.vue")
        },
        {
          path: "play",
          name: "battle-play",
          component: () => import("./views/Battle/BattlePlay.vue")
        },
        {
          path: "achievement",
          name: "battle-achievement",
          component: () => import("./views/Battle/BattleAchievement.vue")
        },
        {
          path: "rankings",
          name: "battle-rankings",
          component: () => import("./views/Battle/BattleRankings.vue")
        },
        {
          path: "shop",
          name: "battle-shop",
          component: () => import("./views/Battle/BattleShop.vue")
        }
      ],
      meta: {
        requiresAuth: true,
        noBackButton: false
      }
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
      component: () => import("./views/Trials/TrialsRoot.vue"),
      children: [
        {
          path: "",
          component: () => import("./views/Trials/Trials.vue")
        },
        {
          path: "honor",
          name: "trial-honor",
          component: () => import("./views/Trials/Honor/TrialsOfHonor.vue"),
          children: [
            {
              path: "",
              name: "trials-of-honor",
              component: () => import("./views/Trials/Honor/TrialsList.vue")
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
        },
        {
          path: "decay",
          name: "trial-decay",
          component: () => import("./views/Trials/Decay/TrialsOfDecay.vue"),
          children: [
            {
              path: "",
              name: "trials-of-decay",
              component: () => import("./views/Trials/Decay/TrialsList.vue")
            }
          ]
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
      children: [
        {
          name: "rankings",
          path: "",
          component: () => import("./views/Rankings/RankingsMenu.vue")
        },
        {
          path: "leaderboards",
          component: () =>
            import("./views/Rankings/Leaderboards/Leaderboards.vue"),
          children: [
            {
              name: "leaderboards",
              path: "",
              component: () =>
                import("./views/Rankings/Leaderboards/LeaderboardsList.vue"),
              children: [
                {
                  name: "leaderboard-view",
                  path: "view/:id",
                  component: () =>
                    import("./views/Rankings/Leaderboards/LeaderboardView.vue"),
                  props: true
                }
              ]
            }
          ]
        },
        {
          path: "tournaments",
          component: () =>
            import("./views/Rankings/Tournaments/Tournaments.vue"),
          children: [
            {
              name: "tournaments",
              path: "",
              component: () =>
                import("./views/Rankings/Tournaments/TournamentList.vue")
            },
            {
              name: "tournament-claim-rewards",
              path: "rewards",
              props: true,
              component: () =>
                import(
                  "./views/Rankings/Tournaments/TournamentsClaimRewards.vue"
                )
            },
            {
              path: ":id",
              name: "tournament",
              props: true,
              component: () =>
                import("./views/Rankings/Tournaments/TournamentView.vue"),
              children: [
                {
                  path: "ranks",
                  name: "tournament-ranks",
                  component: () =>
                    import("./views/Rankings/Tournaments/TournamentRanks.vue"),
                  props: true
                },
                {
                  path: "rewards",
                  name: "tournament-rewards",
                  component: () =>
                    import(
                      "./views/Rankings/Tournaments/TournamentRewards.vue"
                    ),
                  props: true
                }
              ]
            }
          ]
        },
        {
          path: "races",
          component: () => import("./views/Rankings/Races/Races.vue"),
          children: [
            {
              name: "races",
              path: "",
              component: () => import("./views/Rankings/Races/RacesList.vue")
            },
            {
              name: "race-claim-rewards",
              path: "rewards",
              props: true,
              component: () =>
                import("./views/Rankings/Races/RacesClaimRewards.vue")
            },
            {
              path: "r/:id",
              name: "race",
              props: true,
              component: () => import("./views/Rankings/Races/RaceView.vue"),
              children: [
                {
                  path: "ranks",
                  name: "race-ranks",
                  component: () =>
                    import("./views/Rankings/Races/RaceRanks.vue"),
                  props: true
                },
                {
                  path: "rewards",
                  name: "race-rewards",
                  component: () =>
                    import("./views/Rankings/Races/RaceRewards.vue"),
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
      children: [
        {
          path: "chat",
          component: () => import("./views/Social/Chat/Chat.vue"),
          children: [
            {
              path: "",
              name: "world-chat",
              component: () => import("./views/Social/Chat/WorldChat.vue")
            }
          ]
        }
      ]
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
      path: "/home/gold-mine",
      name: "gold-mine",
      component: () => import("./views/GoldMine/GoldMine.vue"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/home/daily-tasks",
      name: "daily-tasks",
      component: () => import("./views/DailyTasks/DailyTasks.vue"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/castle",
      name: "castle",
      component: () => import("./views/Castle/Castle.vue"),
      meta: {
        requiresAuth: true,
        music: "castle"
      }
    },
    // {
    //   path: "/account",
    //   name: "account",
    //   component: () => import("./views/Account/AccountRoot.vue"),
    //   meta: {
    //     requiresAuth: true
    //   },
    //   children: [
    //     {
    //       component: () => import("./views/Account/BlockchainWallet.vue"),
    //       path: ""
    //     }
    //   ]
    // },
    {
      path: "/castle/beast",
      name: "beast",
      component: () => import("./views/Castle/BeastTaming.vue"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/player/:id",
      name: "preview-char",
      component: () => import("./views/Character/PlayerPreview.vue"),
      props: true
    },
    {
      path: "/castle/army",
      name: "",
      component: () => import("./views/Army/ArmyRoot.vue"),
      meta: {
        requiresAuth: true,
        music: "castle"
      },
      children: [
        {
          path: "composition",
          name: "army-composition",
          component: () => import("./views/Army/ArmyComposition.vue"),
          meta: {
            noTopBar: true
          }
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
          props: true,
          meta: {
            noTopBar: true
          }
        },
        {
          path: "edit-unit",
          component: () => import("./views/Army/Unit/ArmyUnitRoot.vue"),
          children: [
            {
              path: "",
              name: "edit-unit",
              component: () => import("./views/Army/Unit/ArmyUnitSelect.vue"),
              meta: {
                noTopBar: true
              }
            },
            {
              path: "unit/:unitId",
              props: true,
              component: () => import("./views/Army/Unit/ArmyUnit.vue"),
              children: [
                {
                  path: "",
                  name: "unit-level",
                  props: true,
                  component: () => import("./views/Army/Unit/UnitLevelUp.vue")
                },
                {
                  path: "equip",
                  name: "unit-equip",
                  props: true,
                  component: () => import("./views/Army/Unit/UnitEquipment.vue")
                },
                {
                  path: "promo",
                  name: "unit-promo",
                  props: true,
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
          path: "garrison",
          name: "garrison",
          redirect: { name: "units-dismiss" },
          component: () => import("./views/Army/Garrison/Garrison.vue"),
          children: [
            {
              path: "reserve",
              component: () =>
                import("./views/Army/Garrison/Reserve/ReserveRoot.vue"),
              children: [
                {
                  path: "",
                  name: "units-reserve",
                  component: () =>
                    import("./views/Army/Garrison/Reserve/Reserve.vue")
                },
                {
                  path: "view",
                  name: "units-reserve-view",
                  component: () =>
                    import("./views/Army/Garrison/Reserve/ViewReserve.vue")
                }
              ]
            },
            {
              path: "",
              name: "units-dismiss",
              component: () =>
                import("./views/Army/Garrison/Banishment/Banishment.vue")
            }
          ]
        },
        {
          meta: {
            noTopBar: true
          },
          path: "ability-transfer",
          component: () =>
            import("./views/Army/AbilityTransfer/AbilityTransferRoot.vue"),
          children: [
            {
              path: "",
              name: "ability-transfer",
              component: () =>
                import("./views/Army/AbilityTransfer/AbilityTransfer.vue"),
              props: true
            },
            {
              path: "select/:from",
              name: "ability-transfer-select",
              component: () =>
                import(
                  "./views/Army/AbilityTransfer/AbilityTransferSelectUnit.vue"
                ),
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
    // {
    //   path: "/",
    //   alias: "/inventory",
    //   name: "inventory",
    //   component: PrelaunchInventory,
    //   meta: {
    //     skipReady: true
    //   }
    // },
    {
      path: "/home",
      name: "home",
      props: true,
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/character",
      component: Character,
      meta: {
        requiresAuth: true,
        noBackButton: true
      },
      children: [
        {
          path: "",
          name: "equipment",
          component: CharacterEquipment
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
          path: "misc",
          name: "character-misc",
          component: CharacterMisc
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
      path: "/home/quest-drops/:stage",
      props: true,
      name: "lucky-drops",
      component: () => import("./views/Quests/LuckyDrops.vue"),
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
          path: "view/:raidId",
          props: true,
          name: "view-raid",
          component: RaidView,
          meta: {
            music: "combat"
          }
        },
        {
          name: "select-legion",
          path: "legion",
          component: () => import("./views/Army/SelectLegion.vue")
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
          component: () => import("./views/Raids/RaidList.vue"),
          children: [
            {
              path: "",
              name: "raids",
              component: CurrentRaids
            },
            {
              path: "public",
              name: "pub-raids",
              component: () => import("./views/Raids/PublicRaids.vue")
            }
          ]
        }
      ]
    },
    {
      path: "/home/prize",
      component: () => import("./views/Rankings/PrizePool/PrizePoolRoot.vue"),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: "",
          name: "prize-pool",
          props: true,
          component: () =>
            import("./views/Rankings/PrizePool/PrizePoolLeaderboard.vue")
        },
        {
          path: "breakdown",
          name: "breakdown",
          props: true,
          component: () =>
            import("./views/Rankings/PrizePool/PrizePoolBreakdown.vue")
        },
        {
          path: "rewards",
          name: "pool-rewards",
          props: true,
          component: () =>
            import("./views/Rankings/PrizePool/PrizePoolRewards.vue")
        }
      ]
    },
    {
      path: "/home/account",
      component: () => import("./views/Dividends/DividendsRoot.vue"),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: "",
          name: "account",
          component: () => import("./views/Dividends/Dividends.vue")
        },
        {
          path: "claim",
          name: "divs-claim",
          component: () => import("./views/Dividends/ClaimDividends.vue")
        },
        {
          path: "stake",
          name: "stake",
          component: () => import("./views/Dividends/Stake.vue")
        },
        {
          path: "withdrawal",
          name: "withdrawal",
          component: () => import("./views/Dividends/Withdrawal.vue")
        },
        {
          path: "deposit",
          name: "deposit",
          component: () => import("./views/Dividends/Deposit.vue")
        },
        {
          path: "history",
          name: "history",
          component: () => import("./views/Dividends/ActivityHistory.vue")
        },
        {
          name: "divs-shop",
          path: "shop",
          component: () => import("./views/Dividends/DividendsShop.vue")
        },
        {
          name: "presale",
          path: "presale",
          component: () =>
            import("./views/Dividends/Presale/DepositPresalePacks.vue")
        }
      ]
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
