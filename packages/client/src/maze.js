'use strict';

class MazeImage {
  constructor(data, x, y, c, maze, clear) {
    this.image = new Image();
    this.data = data;
    this.x = x;
    this.y = y;
    this.c = c;
    this.maze = maze;
    this.clear = clear;

    this.backgroundType = null;
    this.backgroundDirection = null;
    this.rotateDegrees = 0;
  }

  render() {
    console.log("MazeImage.render()", this);
    this.setUrl();

    this.image.onload = () => {
      if (this.clear) {
        this.maze.ctx.clearRect(
          this.x * this.maze.TILE_SIZE,
          this.y * this.maze.TILE_SIZE,
          this.maze.TILE_SIZE,
          this.maze.TILE_SIZE
        );
      }

      var x = this.x * this.maze.TILE_SIZE + this.maze.TILE_SIZE / 2;
      var y = this.y * this.maze.TILE_SIZE + this.maze.TILE_SIZE / 2;

      if (this.rotateDegrees) {
        this.maze.ctx.save();
        this.maze.ctx.translate(x, y);
        this.maze.ctx.rotate((this.rotateDegrees * Math.PI) / 180);
        this.maze.ctx.translate(-x, -y);
        this.maze.ctx.drawImage(
          this.image,
          this.x * this.maze.TILE_SIZE,
          this.y * this.maze.TILE_SIZE,
          this.maze.TILE_SIZE,
          this.maze.TILE_SIZE
        );
        this.maze.ctx.restore();

      } else {
        this.maze.ctx.drawImage(
          this.image,
          this.x * this.maze.TILE_SIZE,
          this.y * this.maze.TILE_SIZE,
          this.maze.TILE_SIZE,
          this.maze.TILE_SIZE
        );
      }

      this.rotateDegrees = 0;
      this.backgroundType = null;
      this.backgroundDirection = null;
    }
  }

  setUrl() {
    let prefix = "/images/halloween_assets";
    switch (this.data.type) {
      case "enemy": {
        this.image.src = `${prefix}/${this.data.difficulty}${this.data.name}.png`;
        break;
      }
      case "closed": {
        this.image.src = `${prefix}/${this.maze.meta.backgrounds.closed}.jpg`;
        break;
      }
      case "way": {
        this.setBackgroundUrl();
        this.image.src = `${prefix}/${this.maze.meta.backgrounds[this.backgroundType]}.jpg`;
        break;
      }
      case "loot": {
        this.image.src = `/images/banners/shinies6.png`;
        break;
      }
    }
  }

  setBackgroundUrl() {
    let type = "item_background";
    let direction = null;

    if (this.c.length === 1) {
      direction = this.singleWayCase(this.c[0]);
      type = "way_single";

    } else if (this.c.length === 2) {
      direction = this.doubleWayCase(this.c[0], this.c[1]);
      let map = {
        horizontal: "way_straight",
        vertical: "way_straight",
        rigth_up: "way_turn",
        right_down: "way_turn",
        left_up: "way_turn",
        left_down: "way_turn"
      }
      type = map[direction];

    } else if (this.c.length === 3) {
      direction = this.tripleWayCase(this.c[0], this.c[1], this.c[2]);
      type = "way_triple";

    } else {
      type = "way_all";
    }

    this.backgroundType = type;
    this.backgroundDirection = direction;
    console.log('Way', { type, direction });
  }

  singleWayCase(c1) {
    console.log('singleWayCase', {c1, index: this.data.index });
    if (c1 === this.data.index + 1) {
      this.rotateDegrees = 90;
      return "right";
    } else if (c1 === this.data.index - 1) {
      this.rotateDegrees = -90;
      return "left";
    } else if (c1 === this.data.index - this.maze.DUNGEON_WIDTH_COUNT) {
      this.rotateDegrees = 0;
      return "top";
    } else {
      this.rotateDegrees = 180;
      return "bottom";
    }
  }

  doubleWayCase(c1, c2) {
    if (Math.abs(c1 - c2) === 2) {
      this.rotateDegrees = 0;
      return "horizontal";
    } else if (Math.abs(c1 - c2) === this.maze.DUNGEON_WIDTH_COUNT * 2) {
      this.rotateDegrees = 90;
      return "vertical";
    } else {
      if (Math.min(c1, c2, this.data.index) === this.data.index) {
        this.rotateDegrees = -90;
        return "right_down";
      } else if (Math.max(c1, c2, this.data.index) === this.data.index) {
        this.rotateDegrees = 90;
        return "left_up";
      } else if (c1+1 === this.data.index || c2+1 === this.data.index) {
        this.rotateDegrees = 0;
        return "left_down";
      } else {
        this.rotateDegrees = 180;
        return "rigth_up";
      }
    }
  }

  tripleWayCase(c1, c2, c3) {
    if (![c1, c2, c3].some(i => i === this.data.index + 1)) {
      this.rotateDegrees = 90;
      return "left";
    } else if (![c1, c2, c3].some(i => i === this.data.index - 1)) {
      this.rotateDegrees = -90;
      return "right";
    } else if (![c1, c2, c3].some(i => i === this.data.index - this.maze.DUNGEON_WIDTH_COUNT)) {
      this.rotateDegrees = 0;
      return "bottom";
    } else {
      this.rotateDegrees = 180;
      return "up";
    }
  }
}

class Maze {
  constructor(data, meta, canvas, wrapper, game) {
    this.cells = [];
    this.data = data;
    this.meta = meta;
    this.canvas = canvas;
    this.wrapper = wrapper;
    this.game = game;
    this.cache = {};

    this.setConstants();
    this.setListeners();
  }

  setConstants() {
    this.DUNGEON_WIDTH_COUNT = this.data.width;
    this.DUNGEON_HEIGHT_COUNT = this.data.height;
    this.DUNGEON_CELLS_TOTAL = this.DUNGEON_WIDTH_COUNT * this.DUNGEON_HEIGHT_COUNT;
    this.TILE_SIZE = Math.round(this.wrapper.offsetWidth / this.DUNGEON_WIDTH_COUNT);

    this.canvas.width = this.wrapper.offsetWidth;
    this.canvas.height = this.TILE_SIZE * this.DUNGEON_HEIGHT_COUNT;
    this.ctx = this.canvas.getContext("2d");
  }

  setListeners() {
    this.canvas.addEventListener("click", event => {
      let localX = event.pageX;
      let localY = event.pageY - this.canvas.getBoundingClientRect().top;

      let cellIndex = this.cellToIndex({
        x: (localX - localX % this.TILE_SIZE) / this.TILE_SIZE,
        y: (localY - localY % this.TILE_SIZE) / this.TILE_SIZE
      });

      this.handleCellClick(cellIndex);
    }, false);
  }

  async handleCellClick(index) {
    let cell = this.cells[index];
    if (!cell.revealed) {
      try {
        const response = await this.game.revealDungeonCell(index);
        console.log({ response });
        this.drawCell(response, index, true);
      } catch (e){
        console.log('handleCellClick error', );
      }
    } else {
      const response = await this.game.useDungeonCell(index);
    }
  }

  render() {
    // Draw revealed
    for (const cell of this.data.revealed) {
      console.log("Draw revealed", {cell});
      this.drawCell(cell, null, true);
    }

    // Draw the rest
    for (let index = 0; index < this.DUNGEON_CELLS_TOTAL; index++) {
      if (!this.cells[index]) {
        console.log("Draw rest", {index});
        this.drawCell(null, index, false);
      }
    }
  }

  drawCell(cell, index, revealed) {
    // x: number;
    // y: number;
    // c?: number[];
    // enemy?: CellEnemy;
    // loot?: CellLoot;

    if (index === null) {
      index = this.cellToIndex(cell);
      console.log("Computed index", index);
    }
    if (cell === null) {
      cell = this.indexToCell(index);
      console.log("Computed cell", cell);
    }
    cell.revealed = revealed;
    this.cells[index] = cell;

    if (!cell.revealed) {
      // Draw closed
      this.drawClosedCell(cell.x, cell.y);
    } else if (cell.enemy) {
      // Draw enemy cell
      this.drawEnemyCell(cell.x, cell.y, cell.c, cell.enemy, index);
    } else if (cell.loot) {
      // Draw loot cell
      this.drawLootCell(cell.x, cell.y, cell.c, cell.loot, index);
    } else {
      // Draw empty cell
      this.drawEmptyCell(cell.x, cell.y, cell.c, index);
    }
  }

  cellToIndex(cell) {
    return cell.y * this.DUNGEON_WIDTH_COUNT + cell.x;
  }

  indexToCell(index) {
    let x = index % this.DUNGEON_WIDTH_COUNT;
    let y = (index - x) / this.DUNGEON_WIDTH_COUNT;
    return { x, y };
  }
  
  drawImage(data, x, y, c, clear) {
    const image = new MazeImage(data, x, y, c, this, clear);
    image.render();
  }

  drawClosedCell(x, y) {
    console.log("drawClosedCell", {x,y});
    this.drawImage({ type: "closed"}, x, y, [], false);
  }

  drawEnemyCell(x, y, c, data, index) {
    console.log("drawEnemyCell", { x, y, c, data, index });
    this.drawImage({ type: "way", index }, x, y, c, true);
    this.drawImage({ ...data, type: "enemy" }, x, y, [], false);
  }
  
  drawLootCell(x, y, c, data, index) {
    console.log("drawLootCell", {x, y, c, data, index});
    this.drawImage({ type: "way", index }, x, y, c, true);
    this.drawImage({ ...data, type: "loot" }, x, y, [], false);
  }
  
  drawEmptyCell(x, y, c, index) {
    console.log("drawEmptyCell", {x, y, c, index});
    this.drawImage({ type: "way", index }, x, y, c, false);
  }
}

export default Maze;
