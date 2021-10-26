<template>
  <div class="dungeon-cell" @click="handleClick">
    <div
      class="absolute-stretch img"
      :style="image"
      :class="`r${rotation}`"
    ></div>

    <div class="absolute-stretch img" :style="objectImage"></div>
    <div
      v-if="highlight"
      class="highlight absolute-stretch"
      ref="highlight"
    ></div>
  </div>
</template>

<script>
import DungeonEnemies from "@/metadata/halloween/dungeon_enemies.json";
import DungeonAltars from "@/metadata/halloween/dungeon_altars.json";
import DungeonTraps from "@/metadata/halloween/dungeon_traps.json";

const IMAGE_BY_TYPE = {
  default: ["tile_back1", "tile_back2"],
  way_single: "way4",
  way_straight: "way1",
  way_turn: "way2",
  way_all: "way3",
  way_triple: "way5"
};

export default {
  props: ["cell", "index", "mazeWidth", "highlight"],
  data: () => ({
    image: "",
    rotation: "",
    objectImage: ""
  }),
  watch: {
    cell: {
      immediate: true,
      handler() {
        this.render();
      }
    }
  },
  methods: {
    handleClick() {
      this.$emit("click", { ...this.cell, index: this.index });
    },
    render() {
      let baseUrl = `/images/halloween_assets/`;

      let t = "default";
      let r = 0;

      if (this.cell) {
        const connections = this.cell.c;
        const totalConnections = this.cell.c.length;

        if (totalConnections === 1) {
          ({ t, r } = this.singleWayCase(connections[0]));
          t = "way_single";
        } else if (totalConnections === 2) {
          ({ t, r } = this.doubleWayCase(connections[0], connections[1]));
          let map = {
            horizontal: "way_straight",
            vertical: "way_straight",
            rigth_up: "way_turn",
            right_down: "way_turn",
            left_up: "way_turn",
            left_down: "way_turn"
          };
          t = map[t];
        } else if (totalConnections === 3) {
          ({ t, r } = this.tripleWayCase(
            connections[0],
            connections[1],
            connections[2]
          ));
          t = "way_triple";
        } else {
          t = "way_all";
        }

        let objectFile;

        if (this.cell.enemy) {
          objectFile = DungeonEnemies[this.cell.enemy.id].dungeonImage;
        }

        if (this.cell.altar) {
          objectFile = DungeonAltars[this.cell.altar.id].image;
        }

        if (this.cell.trap) {
          objectFile = DungeonTraps[this.cell.trap.id].image;
        }

        if (objectFile) {
          this.objectImage = {
            "background-image": `url("${baseUrl}/${objectFile}.png")`
          };
        }
      }

      let imageName = IMAGE_BY_TYPE[t];
      if (t == "default") {
        const offset = Math.floor(this.index / this.mazeWidth) % 2 ? 1 : 0;
        if (offset) {
          imageName =
            this.index % 2 ? IMAGE_BY_TYPE[t][0] : IMAGE_BY_TYPE[t][1];
        } else {
          imageName =
            this.index % 2 ? IMAGE_BY_TYPE[t][1] : IMAGE_BY_TYPE[t][0];
        }
      }

      this.image = {
        "background-image": `url("${baseUrl}/${imageName}.jpg")`
      };
      this.rotation = r;
    },
    singleWayCase(c1) {
      if (c1 === this.index + 1) {
        return { t: "right", r: 90 };
      } else if (c1 === this.index - 1) {
        return { t: "left", r: -90 };
      } else if (c1 === this.index - this.mazeWidth) {
        return { t: "top", r: 0 };
      } else {
        return { t: "bottom", r: 180 };
      }
    },
    doubleWayCase(c1, c2) {
      if (Math.abs(c1 - c2) === 2) {
        return { t: "horizontal", r: 0 };
      } else if (Math.abs(c1 - c2) === this.mazeWidth * 2) {
        return { t: "vertical", r: 90 };
      } else {
        if (Math.min(c1, c2, this.index) === this.index) {
          return { t: "right_down", r: -90 };
        } else if (Math.max(c1, c2, this.index) === this.index) {
          return { t: "left_up", r: 90 };
        } else if (c1 + 1 === this.index || c2 + 1 === this.index) {
          return { t: "left_down", r: 0 };
        } else {
          return { t: "rigth_up", r: 180 };
        }
      }
    },
    tripleWayCase(c1, c2, c3) {
      if (![c1, c2, c3].some(i => i === this.index + 1)) {
        return { t: "left", r: 90 };
      } else if (![c1, c2, c3].some(i => i === this.index - 1)) {
        return { t: "right", r: -90 };
      } else if (![c1, c2, c3].some(i => i === this.index - this.mazeWidth)) {
        return { t: "bottom", r: 0 };
      } else {
        return { t: "up", r: 180 };
      }
    }
  }
};
</script>

<style lang="less" scoped>
.dungeon-cell {
  position: relative;

  & .img {
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;

    &.r90 {
      transform: rotateZ(90deg);
    }

    &.r180 {
      transform: rotateZ(180deg);
    }

    &.r-90 {
      transform: rotateZ(270deg);
    }
  }

  & .highlight {
    z-index: 5;

    @keyframes scaleme {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      20% {
        transform: scale(1);
        opacity: 1;
      }
      80% {
        transform: scale(1.05);
        opacity: 0;
      }
      100% {
        transform: scale(1.05);
        opacity: 0;
      }
    }

    background-image: url("/images/halloween_assets/selection.png");
    background-size: contain;
    animation: scaleme 1.5s alternate ease-in-out infinite;
  }
}
</style>
