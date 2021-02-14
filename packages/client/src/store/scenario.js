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
        }
      },
      {
        lock: {
          name: "home"
        },
        pointer: {
          target: "#quests"
        }
      },
      {
        lock: {
          path: "/home/quest/1"
        },
        pointer: {
          target: "#quest-0"
        }
      },
      {
        lock: {
          path: "/home/quest/1/0"
        },
        pointer: {
          target: "#engage-q"
        }
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
          name: "home"
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
          delay: 1000,
          target: "#i-2045"
        },
        return: 0
      }
    ]
  },
  {
    cond: {
      level: 3
    },
    actions: [
      {
        lock: {
          name: "home",
          skip: true
        },
        pointer: {
          target: "#char-btn"
        }
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
        }
      },
      {
        lock: {
          name: "home"
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
          target: "#char-btn"
        }
      },
      {
        lock: {
          name: "home"
        },
        pointer: {
          target: "#onyx-tower"
        }
      },
      {
        lock: {
          path: "/home/onyx-tower"
        },
        pointer: {
          target: ".vue-recycle-scroller__item-view:last-child .btn"
        }
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
          target: "#summon"
        },
        return: 0
      }
    ]
  },
  {
    cond: {
      level: 10,
      name: "army-summon-menu"
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
      }
    ]
  },
  {
    cond: {
      level: 15
    },
    actions: [
      {
        dialog: [
          {
            text: ["t-d-15"]
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
        }
      },
      {
        lock: {
          name: "home"
        },
        pointer: {
          target: "#divs"
        }
      },
      {
        lock: {
          name: "dividends"
        },
        dialog: [
          {
            text: ["t-d-16", "t-d-17", "t-d-18"]
          }
        ]
      }
    ]
  },
  {
    cond: {
      level: 16,
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
