/*jshint esversion: 9 */

import Vue from "vue";
import throttle from "lodash.throttle";

const EXTRA_PASSAGE_CHANCE = 10;
const PASSAGE_CHANCE_INC = 0;

const rewardsConfig = [{
    loot: 1
  },
  {
    loot: 2
  },
  {
    loot: 3
  },
  {
    loot: 4
  }
];

const enemiesConfig = [{
    difficulty: 1,
    count: 3
  },
  {
    difficulty: 2,
    count: 4
  },
  {
    difficulty: 1,
    count: 2
  },
  {
    difficulty: 3,
    count: 1
  },
  {
    difficulty: 2,
    count: 2
  },
  {
    difficulty: 1,
    count: 3
  },
  {
    difficulty: 4,
    count: 1
  },
  {
    difficulty: 2,
    count: 4
  },
  {
    difficulty: 3,
    count: 2
  },
  {
    difficulty: 4,
    count: 2
  }
];

class Maze {
  constructor(ref, wrapper) {
    const width = wrapper.offsetWidth;

    this.TILE_SIZE = width / 9;
    this.DUNGEON_WIDTH = width;
    this.DUNGEON_HEIGHT = this.TILE_SIZE * 6;

    ref.width = width;
    ref.height = width;
    this.ctx = ref.getContext("2d");
  }

  render() {
    this.drawDungeon(this.generateDungeon());
  }

  drawTile(x, y, color = "#c7d0d8") {
    this.ctx.beginPath();
    this.ctx.rect(x * this.TILE_SIZE, y * this.TILE_SIZE, this.TILE_SIZE - 2, this.TILE_SIZE - 2);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  drawLine(from, to) {
    const offset = this.TILE_SIZE / 2;
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#194368";
    this.ctx.moveTo(from.x * this.TILE_SIZE + offset, from.y * this.TILE_SIZE + offset);
    this.ctx.lineTo(to.x * this.TILE_SIZE + offset, to.y * this.TILE_SIZE + offset);
    this.ctx.stroke();
  }

  range(min, max) {
    return min + Math.round(Math.random() * (max - min));
  }

  cellToIndex(cell) {
    return cell.y * this.DUNGEON_WIDTH + cell.x;
  }

  shuffle(cells) {
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }

    return cells;
  }

  randomNeighbours(cell, filter) {
    const cells = [];
    // left
    if (cell.x > 0) {
      const nc = {
        x: cell.x - 1,
        y: cell.y,
        c: []
      };
      if (filter(nc)) {
        cells.push(nc);
      }
    }

    // top
    if (cell.y > 0) {
      const nc = {
        x: cell.x,
        y: cell.y - 1,
        c: []
      };
      if (filter(nc)) {
        cells.push(nc);
      }
    }

    // right
    if (cell.x < this.DUNGEON_WIDTH - 1) {
      const nc = {
        x: cell.x + 1,
        y: cell.y,
        c: []
      };
      if (filter(nc)) {
        cells.push(nc);
      }
    }

    // bottom
    if (cell.y < this.DUNGEON_HEIGHT - 1) {
      const nc = {
        x: cell.x,
        y: cell.y + 1,
        c: []
      };
      if (filter(nc)) {
        cells.push(nc);
      }
    }

    return this.shuffle(cells);
  }

  randomNotConnected(cell) {
    const cells = {};
    for (const c of cell.c) {
      cells[this.cellToIndex(cell)] = c;
    }

    return this.randomNeighbours(cell, (c) => !cells[this.cellToIndex(c)]);
  }

  expandEnemyConfig(enemiesConfig) {
    const enemyList = [];
    for (let k = enemiesConfig.length - 1; k >= 0; --k) {
      const config = enemiesConfig[k];
      for (let i = 0; i < config.count; ++i) {
        enemyList.push({
          difficulty: config.difficulty
        });
      }
    }

    return enemyList;
  }

  placeEnemies(start, tiles) {
    // first, place main enemies, in an order
    // we guarantee that player will able to reach out every enemy in the list
    // according to the list's order and quantity
    // this will let players compete in a random dungeon
    // with similar difficulty
    const enemyList = this.expandEnemyConfig(enemiesConfig);
    //console.log("enemies to place", enemyList.length);
    const maxDistanceBetweenEnemies = Math.round(
      (tiles.length - 1) / enemyList.length
    );
    //console.log("maxDistanceBetweenEnemies", maxDistanceBetweenEnemies);
    const cellsForLoot = [];

    const enemyStack = [];
    let cellStack = [start];
    const visited = {
      [this.cellToIndex(start)]: 0,
    };

    // move along the way, choosing random direction at the conjunction
    while (enemyList.length != 0 && cellStack.length != 0) {
      let currentCell = cellStack.pop();
      let accumulatedDistance = visited[this.cellToIndex(currentCell)];
      const lastEnemyDistance = accumulatedDistance;

      const neighbours = this.shuffle(currentCell.c);

      if (neighbours.length == 0) {
        continue;
      }

      for (const nb of neighbours) {
        const index = this.cellToIndex(nb);
        if (visited[index]) {
          continue;
        }

        currentCell = tiles[index];
        visited[index] = ++accumulatedDistance;
        cellStack.push(currentCell);

        const distance = accumulatedDistance - lastEnemyDistance;

        if (accumulatedDistance % maxDistanceBetweenEnemies == 0) {
          // place enemy
          const enemy = enemyList.pop();
          enemyStack.push({
            ...enemy,
            x: currentCell.x,
            y: currentCell.y,
          });
        } else if (enemyStack.length != 0) {
          cellsForLoot.push({
            x: currentCell.x,
            y: currentCell.y,
          });
        }
      }
    }

    //console.log("total enemies", enemyStack.length);

    return {
      enemies: enemyStack,
      cellsForLoot,
    };
  }

  placeRewards(cellsForLoot) {
    // uniformly distibute loot
    const rewards = [];
    const cellsBetweenLoot = Math.floor(
      (cellsForLoot.length - 1) / rewardsConfig.length
    );
    let rewardIndex = cellsBetweenLoot;
    for (const reward of rewardsConfig) {
      const cell = cellsForLoot[rewardIndex];
      rewardIndex += cellsBetweenLoot;
      rewards.push({
        ...reward,
        x: cell.x,
        y: cell.y,
      });
    }

    return rewards;
  }

  connect(cell1, cell2) {
    cell1.c.push({
      x: cell2.x,
      y: cell2.y,
    });

    cell2.c.push({
      x: cell1.x,
      y: cell1.y,
    });
  }

  generateDungeon() {
    let tiles = new Array(this.DUNGEON_WIDTH * this.DUNGEON_HEIGHT);
    // pick random point as a start
    const startCell = {
      x: this.range(0, this.DUNGEON_WIDTH - 1),
      y: this.range(0, this.DUNGEON_HEIGHT - 1),
      c: [],
    };
    let stack = [startCell];
    tiles[this.cellToIndex(startCell)] = startCell;

    while (stack.length != 0) {
      let currentCell = stack.pop();
      const neighbours = this.randomNeighbours(
        currentCell,
        (c) => !tiles[this.cellToIndex(c)]
      );
      if (neighbours.length != 0) {
        stack.push(currentCell);
      } else {
        continue;
      }

      const nbCell = neighbours[0];
      if (!tiles[this.cellToIndex(nbCell)]) {
        tiles[this.cellToIndex(nbCell)] = nbCell;

        stack.push(nbCell);

        this.connect(currentCell, nbCell);
      }
    }

    // randomly open extra passsages
    let openChance = EXTRA_PASSAGE_CHANCE;
    for (const cell of tiles) {
      if (cell.c.length < 4) {
        const neighbours = this.randomNotConnected(cell);
        for (const nbCell of neighbours) {
          if (this.range(1, 100) <= openChance) {
            this.connect(tiles[this.cellToIndex(nbCell)], cell);
            openChance = EXTRA_PASSAGE_CHANCE;
          } else {
            openChance += PASSAGE_CHANCE_INC;
          }
        }
      }
    }

    // place enemies
    const {
      enemies,
      cellsForLoot
    } = this.placeEnemies(startCell, tiles);
    const rewards = this.placeRewards(cellsForLoot);

    const dungeon = {
      tiles,
      start: startCell,
      enemies,
      rewards
    };

    return dungeon;
  }

  getEnemyColor(enemy) {
    switch (enemy.difficulty) {
      case 1:
        return "#fac6bc";

      case 2:
        return "#da978a";

      case 3:
        return "#c47364";

      case 4:
        return "#ae5746";

      case 5:
        return "#a4422f";

      case 6:
        return "#6e1504";
    }
  }

  drawDungeon(dungeon) {
    for (const cell of dungeon.tiles) {
      this.drawTile(cell.x, cell.y);
    }

    for (const enemy of dungeon.enemies) {
      this.drawTile(enemy.x, enemy.y, this.getEnemyColor(enemy));
    }

    for (const reward of dungeon.rewards) {
      this.drawTile(reward.x, reward.y, "#6dff12");
    }

    for (const cell of dungeon.tiles) {
      for (const nb of cell.c) {
        this.drawLine(cell, nb);
      }
    }

    this.drawTile(dungeon.start.x, dungeon.start.y, "#245178");
  }
}

export default Maze;
