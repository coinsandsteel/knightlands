export default [
  {
    cond: {
      level: 1
    },
    actions: [
      {
        dialog: [
          {
            text: ["t-d-1", "t-d-2"]
          }
        ]
      },
      {
        lock: {
          name: "home",
          skip: true
        },
        pointer: {
          target: "#home-btn"
        },
        return: 0
      },
      {
        lock: {
          name: "home"
        },
        pointer: {
          target: "#quests > .link"
        },
        return: 0
      },
      {
        lock: {
          path: "/home/quest/1",
          skip: true
        },
        pointer: {
          target: "#quest-0"
        },
        return: 0
      },
      {
        lock: {
          path: "/home/quest/1/0"
        },
        pointer: {
          target: "#engage-q"
        },
        return: 0
      }
    ]
  },
  {
    cond: {
      level: 2
    },
    actions: [
      {
        dialog: [
          {
            text: ["t-d-3", "t-d-4"]
          }
        ]
      },
      {
        lock: {
          path: "/character",
          skip: true
        },
        pointer: {
          target: "#char-btn"
        },
        return: 0
      },
      {
        lock: {
          path: "/character"
        },
        pointer: {
          target: "#mainHand"
        },
        return: 0
      },
      {
        lock: {
          path: "/character"
        },
        pointer: {
          target: "#i-2045"
        },
        return: 0
      },
      {
        lock: {
          path: "/character"
        },
        pointer: {
          target: "#btn-equip-2045",
          index: 1
        },
        return: 0
      },
      {
        dialog: [
          {
            text: ["t-d-23"]
          }
        ]
      },
      {
        teleport: {
          path: "/home/quest/1"
        }
      }
    ]
  },
  {
    cond: {
      level: 3,
      items: [2929]
    },
    actions: [
      {
        dialog: [
          {
            text: ["t-d-22"]
          }
        ]
      },
      {
        lock: {
          path: "/character",
          skip: true
        },
        pointer: {
          target: "#char-btn"
        },
        return: 0
      },
      {
        lock: {
          path: "/character"
        },
        pointer: {
          target: "#t-training"
        },
        return: 0
      },
      {
        lock: {
          path: "/character/training"
        },
        pointer: {
          target: "#num-energy .att-plus"
        },
        return: 0
      },
      {
        lock: {
          path: "/character/training"
        },
        pointer: {
          target: "#apply-btn"
        },
        return: 0
      },
      {
        dialog: [
          {
            text: ["t-d-24"]
          }
        ]
      },
      {
        lock: {
          name: "home",
          skip: true
        },
        pointer: {
          target: "#home-btn"
        },
        return: 5
      },
      {
        lock: {
          name: "home"
        },
        pointer: {
          target: "#quests > .link"
        },
        return: 5
      },
      {
        lock: {
          path: "/home/quest/1"
        },
        pointer: {
          target: ".zone-nav.right"
        },
        return: 5
      }
    ]
  },
  {
    cond: {
      level: 3,
      event: "no-energy"
    },
    actions: [
      {
        dialog: [
          {
            text: ["t-d-25"]
          }
        ]
      },
      {
        pointer: {
          target: "#refill"
        },
        return: 0
      },
      {
        pointer: {
          target: ".pointer.att-plus"
        },
        return: 0
      },
      {
        pointer: {
          target: "#confirm-refill"
        },
        return: 0
      },
      {
        dialog: [
          {
            text: ["t-d-26"]
          }
        ]
      }
    ]
  },
  {
    cond: {
      level: 4
    },
    actions: [
      {
        dialog: [
          {
            text: ["t-d-5"]
          }
        ]
      },
      {
        lock: {
          name: "home",
          skip: true
        },
        pointer: {
          target: "#char-btn"
        },
        return: 0
      },
      {
        lock: {
          name: "home",
          props: { scrollToBottom: true }
        },
        pointer: {
          target: "#daily-r"
        },
        return: 0
      },
      {
        lock: {
          path: "/home/daily-rewards"
        },
        pointer: {
          target: "#collect"
        },
        return: 0
      },
      {
        dialog: [
          {
            text: ["t-d-23"]
          }
        ]
      },
      {
        teleport: {
          path: "/home/quest/2"
        }
      }
    ]
  },
  {
    cond: {
      level: 5
    },
    actions: [
      {
        dialog: [
          {
            text: ["t-d-27"]
          },
          {
            text: ["t-d-28"]
          },
          {
            text: ["t-d-29"]
          },
          {
            text: ["t-d-30"]
          }
        ]
      }
    ]
  },
  {
    cond: {
      level: 5,
      fullClass: true
    },
    actions: [
      {
        dialog: [
          {
            text: ["t-d-6", "t-d-7", "t-d-8"]
          }
        ]
      },
      {
        lock: {
          name: "home",
          skip: true
        },
        pointer: {
          target: "#home-btn"
        },
        return: 0
      },
      {
        lock: {
          name: "home"
        },
        pointer: {
          target: "#onyx-tower"
        },
        return: 0
      },
      {
        lock: {
          path: "/home/onyx-tower"
        },
        pointer: {
          target: ".btn:not(.disabled)"
        },
        return: 0
      },
      {
        dialog: [
          {
            text: ["t-d-31"]
          }
        ]
      }
    ]
  },
  {
    cond: {
      items: [2925]
    },
    actions: [
      {
        dialog: [
          {
            text: ["t-d-9"]
          }
        ]
      },
      {
        lock: {
          name: "castle",
          skip: true
        },
        pointer: {
          target: "#b-castle"
        },
        return: 0
      },
      {
        lock: {
          name: "castle"
        },
        pointer: {
          target: "#beast"
        },
        return: 0
      },
      {
        lock: {
          name: "beast"
        },
        pointer: {
          target: "#boost-0"
        },
        return: 0
      },
      {
        dialog: [
          {
            text: ["t-d-32"]
          }
        ]
      }
    ]
  },
  {
    cond: {
      level: 5
    },
    actions: [
      {
        dialog: [{ text: ["t-d-33"] }]
      },
      {
        teleport: {
          path: "/home/onyx-tower"
        }
      }
    ]
  },
  {
    cond: {
      level: 6
    },
    actions: [
      {
        dialog: [
          {
            text: ["t-d-34"]
          }
        ]
      },
      {
        lock: {
          name: "home",
          skip: true
        },
        pointer: {
          target: "#home-btn"
        },
        return: 0
      },
      {
        lock: {
          name: "home"
        },
        pointer: {
          target: "#daily-tasks"
        },
        return: 0
      },
      {
        lock: {
          name: "daily-tasks"
        },
        pointer: {
          target: ".btn:not(.disabled)"
        },
        return: 0
      },
      {
        dialog: [
          {
            text: ["t-d-36"]
          }
        ]
      }
    ]
  },
  {
    cond: {
      level: 9
    },
    actions: [
      {
        dialog: [
          {
            text: ["t-d-37"]
          }
        ]
      },
      {
        lock: {
          name: "home",
          skip: true
        },
        pointer: {
          target: "#home-btn"
        },
        return: 0
      },
      {
        lock: {
          name: "home"
        },
        pointer: {
          target: "#trials"
        },
        return: 0
      },
      {
        lock: {
          path: "/home/trials"
        },
        pointer: {
          target: ".btn"
        },
        return: 0
      },
      {
        lock: {
          path: "/home/trials/honor"
        },
        pointer: {
          target: ".btn:not(.disabled)"
        },
        return: 0
      },
      {
        lock: {
          path: "/home/trials/honor"
        },
        pointer: {
          target: ".btn:not(.disabled)"
        },
        return: 0
      },
      {
        lock: {
          path: "/home/trials/honor"
        },
        pointer: {
          target: ".btn:not(.disabled)"
        },
        return: 0
      },
      {
        dialog: [
          {
            text: ["t-d-38"]
          }
        ]
      }
    ]
  },
  {
    cond: {
      level: 10
    },
    actions: [
      {
        dialog: [
          {
            text: ["t-d-10"]
          }
        ]
      },
      {
        lock: {
          name: "home",
          skip: true
        },
        pointer: {
          target: "#home-btn"
        },
        return: 0
      },
      {
        lock: {
          name: "home"
        },
        pointer: {
          target: "#raids"
        },
        return: 0
      },
      {
        lock: {
          path: "/home/raids"
        },
        pointer: {
          target: "#btn-summon"
        },
        return: 0
      },
      {
        lock: {
          path: "/home/raids/summon"
        },
        pointer: {
          target: "#s-1"
        },
        return: 0
      },
      {
        dialog: [
          {
            text: ["t-d-11"]
          }
        ]
      },
      {
        lock: {
          path: "/home/raids/summon/1"
        },
        pointer: {
          target: "#btn-summon"
        },
        return: 0
      },
      {
        dialog: [
          {
            text: ["t-d-39"]
          }
        ]
      }
    ]
  },
  {
    cond: {
      level: 10
    },
    actions: [
      {
        lock: {
          name: "home",
          skip: true
        },
        pointer: {
          target: "#home-btn"
        },
        return: 0
      },
      {
        lock: {
          name: "home"
        },
        pointer: {
          target: "#divs"
        },
        return: 0
      },
      {
        dialog: [
          {
            text: ["t-d-40"]
          },
          {
            text: ["t-d-41"]
          }
        ]
      }
    ]
  },
  {
    cond: {
      level: 10
    },
    actions: [
      {
        dialog: [
          {
            text: ["t-d-12"]
          },
          {
            text: ["t-d-13"]
          }
        ]
      },
      {
        lock: {
          name: "summon",
          skip: true
        },
        pointer: {
          target: "#b-shop"
        },
        return: 0
      },
      {
        lock: {
          name: "summon"
        },
        pointer: {
          target: "#summon"
        },
        return: 0
      },
      {
        lock: {
          path: "/summon/army"
        },
        pointer: {
          target: "#do-summon"
        },
        return: 0
      }
    ]
  },
  {
    cond: {
      level: 10
    },
    actions: [
      {
        dialog: [
          {
            text: ["t-d-14"]
          }
        ]
      },
      {
        lock: {
          name: "castle",
          skip: true
        },
        pointer: {
          target: "#b-castle"
        },
        return: 0
      },
      {
        lock: {
          name: "castle"
        },
        pointer: {
          target: "#legions"
        },
        return: 0
      },
      {
        lock: {
          name: "army-composition"
        },
        pointer: {
          target: "#s-0"
        },
        return: 0
      },
      {
        lock: {
          path: "/castle/army/edit-legion/0/troops/0"
        },
        pointer: {
          target: "#u-0"
        },
        return: 0
      },
      {
        lock: {
          path: "/castle/army/edit-legion/0/troops/0"
        },
        pointer: {
          target: "#confirm"
        },
        return: 0
      },
      {
        dialog: [
          {
            text: ["t-d-42"]
          }
        ]
      },
      {
        teleport: {
          path: "/summon/army"
        }
      }
    ]
  },
  {
    cond: {
      level: 10,
      item: [2978]
    },
    actions: [
      {
        dialog: [
          {
            text: ["t-d-44"]
          }
        ]
      },
      {
        lock: {
          name: "castle",
          skip: true
        },
        pointer: {
          target: "#b-castle"
        },
        return: 0
      },
      {
        lock: {
          name: "castle"
        },
        pointer: {
          target: "#legions"
        },
        return: 0
      },
      {
        lock: {
          name: "army-composition"
        },
        pointer: {
          target: "#s-0"
        },
        return: 0
      },
      {
        lock: {
          path: "/castle/army/edit-legion/0/troops/0"
        },
        pointer: {
          target: "#unit-equip"
        },
        return: 0
      },
      {
        pointer: {
          target: "#t-level-up"
        },
        return: 0
      },
      {
        pointer: {
          target: ".btn"
        },
        return: 0
      },
      {
        dialog: [
          {
            text: ["t-d-45"]
          }
        ]
      }
    ]
  },
  // {
  //   cond: {
  //     level: 11
  //   },
  //   actions: [
  //     {
  //       dialog: [
  //         {
  //           text: ["t-d-15"]
  //         }
  //       ]
  //     },
  //     {
  //       lock: {
  //         name: "home",
  //         skip: true
  //       },
  //       pointer: {
  //         target: "#home-btn"
  //       }
  //     },
  //     {
  //       lock: {
  //         name: "home"
  //       },
  //       pointer: {
  //         target: "#divs"
  //       }
  //     },
  //     {
  //       lock: {
  //         name: "dividends"
  //       },
  //       dialog: [
  //         {
  //           text: ["t-d-16", "t-d-16i"]
  //         },
  //         {
  //           text: ["t-d-17", "t-d-18"]
  //         }
  //       ]
  //     }
  //   ]
  // },
  {
    cond: {
      level: 11
    },
    actions: [
      {
        dialog: [
          {
            text: ["t-d-46"]
          }
        ]
      },
      {
        lock: {
          name: "castle",
          skip: true
        },
        pointer: {
          target: "#b-castle"
        },
        return: 0
      },
      {
        lock: {
          name: "castle"
        },
        pointer: {
          target: "#lab"
        }
      },
      {
        dialog: [
          {
            text: ["t-d-47"]
          },
          {
            text: ["t-d-48"]
          }
        ]
      }
    ]
  },
  {
    cond: {
      level: 15,
      items: [3119]
    },
    actions: [
      {
        dialog: [
          {
            text: ["t-d-19"]
          }
        ]
      },
      {
        lock: {
          name: "castle",
          skip: true
        },
        pointer: {
          target: "#b-castle"
        },
        return: 0
      },
      {
        lock: {
          name: "castle"
        },
        pointer: {
          target: "#lab"
        }
      },
      {
        lock: {
          name: "alchemy-lab"
        },
        pointer: {
          target: "#create-weapon"
        }
      },
      {
        dialog: [
          {
            text: ["t-d-20", "t-d-21"]
          }
        ]
      }
    ]
  }
];
