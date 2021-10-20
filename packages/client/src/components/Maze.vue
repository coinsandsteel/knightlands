<template>
  <div class="width-100" ref="wrapper">
    <canvas ref="canvas" id="canvas"></canvas>
    <div v-show="false">
      <img
        v-for="(monster, id) in meta"
        :src="`/images/halloween_assets/${monster.level}${monster.name}.png`"
        :key="id"
      />
    </div>
  </div>
</template>

<script>
import Maze from "@/maze";

export default {
  mixins: [],
  components: {},
  data: () => ({
    interval: null,
    maze: null,
    meta: {
      backgrounds: {
        closed: "tile_empty1",
        loot: "tile_empty",
        item_background: "tile_back1",
        way_single: "way4",
        way_straight: "way1",
        way_turn: "way2",
        way_all: "way3",
        way_triple: "way5"
      },
      enemies: {
        1: { name: "Goblin-Archer", level: 1 },
        2: { name: "Halloween-Bat", level: 1 },
        3: { name: "Halloween-Lick-O-Wisp", level: 1 },
        4: { name: "Halloween-Pumpkin-Chariot-Minion-A", level: 1 },
        5: { name: "Halloween-Spirit-Mumpkin", level: 1 },
        6: { name: "Halloween-Stein-Monster", level: 1 },
        7: { name: "Zombie-Forest-Flower", level: 1 },

        8: { name: "Egypt-Mummy-A", level: 2 },
        9: { name: "Halloween-Black-Cat", level: 2 },
        10: { name: "Halloween-Pumpkin-Chariot-Minion-B", level: 2 },
        11: { name: "Hunter-Pet-Crow", level: 2 },
        12: { name: "Library-Book-Swarm", level: 2 },
        13: { name: "Mountain-Black-Wolf", level: 2 },
        14: { name: "Zombie-Goblin-Grunt", level: 2 },

        15: { name: "Colossal-Dark-Crow", level: 3 },
        16: { name: "Egypt-Mummy-B", level: 3 },
        17: { name: "Halloween-Dagger-skeleton", level: 3 },
        18: { name: "Halloween-Pumpkin-Gentleman", level: 3 },
        19: { name: "Halloween-Stein's-Monster-MK2", level: 3 },
        20: { name: "Mimic-Book", level: 3 },
        21: { name: "Plant-Warriors-Rose-Knight", level: 3 },

        22: { name: "Desert-Cactus-Triple", level: 4 },
        23: { name: "Halloween-Pumpkin-Chariot", level: 4 },
        24: { name: "Megapack-III-Undead-Warrior-Benkei", level: 4 },
        25: { name: "Mimic", level: 4 },
        26: { name: "Mountain-Bat", level: 4 },
        27: { name: "Seven-Sins-Envy", level: 4 },
        28: { name: "Skeleton-Warriors-Bandit", level: 4 },

        29: { name: "Colossal-Bat", level: 5 },
        30: { name: "Dryads-Warrior", level: 5 },
        31: { name: "Eldritch-Corrruption-Toucan", level: 5 },
        32: { name: "Halloween-Pumpkin", level: 5 },
        33: { name: "Halloween-Vampire", level: 5 },
        34: { name: "Halloween-Witch", level: 5 },
        35: { name: "Library-Book-Master", level: 5 },

        36: { name: "Aspiring-Knight-Palazo", level: 6 },
        37: { name: "Boss-Insect-Queen", level: 6 },
        38: { name: "Boss-Lich-King", level: 6 },
        39: { name: "DnD-Boar-Gorilla", level: 6 },
        40: { name: "Halloween-Witch-Baba", level: 6 },
        41: { name: "Insects-Swarm", level: 6 },
        42: { name: "Secondary-Elementals-Acid-Elemental", level: 6 },
      }
    },
    data: {
      revealed: [
        {
          x: 0,
          y: 0,
          c: [1],
          loot: { loot: 1 }
        },
        {
          x: 1,
          y: 0,
          c: [0, 2, 10],
          enemy: { id: 1, difficulty: 1 }
        },
        {
          x: 2,
          y: 0,
          c: [1, 3],
          loot: { loot: 1 }
        },
        {
          x: 3,
          y: 0,
          c: [2, 4],
          enemy: { id: 2, difficulty: 1 }
        },
        {
          x: 4,
          y: 0,
          c: [3, 13]
        },
        {
          x: 0,
          y: 1,
          c: [10, 18]
        },
        {
          x: 1,
          y: 1,
          c: [1, 9, 11]
        },
        {
          x: 2,
          y: 1,
          c: [10, 12, 20]
        },
        {
          x: 3,
          y: 1,
          c: [11],
          loot: { loot: 1 }
        },
        {
          x: 4,
          y: 1,
          c: [4, 22],
          enemy: { id: 3, difficulty: 1 }
        },
        {
          x: 0,
          y: 2,
          c: [9, 19],
          enemy: { id: 4, difficulty: 1 }
        },
        {
          x: 1,
          y: 2,
          c: [18, 20],
          enemy: { id: 5, difficulty: 1 }
        },
        {
          x: 2,
          y: 2,
          c: [11, 19, 21],
          loot: { loot: 1 }
        },
        {
          x: 3,
          y: 2,
          c: [20, 22]
        },
        {
          x: 4,
          y: 2,
          c: [13, 21],
          enemy: { id: 6, difficulty: 1 }
        }
      ],
      energy: 10,
      floor: 1,
      cycle: 1
    }
  }),
  computed: {},
  async mounted() {
    await this.getDungeon();
    //this.interval = setInterval(this.render.bind(this), 10000);
    this.render();
  },
  methods: {
    async getDungeon() {
      //this.data = await this.$game.getDungeon();
    },
    render() {
      console.log("Render started", new Date().toISOString());
      this.maze = new Maze(
        this.data,
        this.meta,
        this.$refs.canvas,
        this.$refs.wrapper
      );
      this.maze.render();
    },
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>
