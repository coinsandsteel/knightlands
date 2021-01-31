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
      item: 2925
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
  }
];
