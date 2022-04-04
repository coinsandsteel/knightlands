import * as march from "@/../../knightlands-shared/march";

// export const UNIT_CLASS_BALL_LIGHTNING = 'ball_lightning';
// export const UNIT_CLASS_DRAGON_BREATH = 'dragon_breath';
// export const UNIT_CLASS_BOMB = 'bomb';
// export const UNIT_CLASS_BOW = 'bow';

// // Containers
// export const UNIT_CLASS_CHEST = 'chest';
// export const UNIT_CLASS_BARREL = 'barrel';

// // Enemies
// export const UNIT_CLASS_ENEMY = 'enemy';
// export const UNIT_CLASS_ENEMY_BOSS = 'enemy_boss';
// export const UNIT_CLASS_TRAP = 'trap';

// // Loot
// export const UNIT_CLASS_HP = 'hp';
// export const UNIT_CLASS_EXTRA_HP = 'extra_hp';
// export const UNIT_CLASS_ARMOR = 'armor';
// export const UNIT_CLASS_GOLD = 'gold';

// move up to enemy (4 -> 1)
export const c1 = {
  data: [
    { _id: "0", unitClass: march.UNIT_CLASS_ENEMY, hp: 4 },
    { _id: "1", unitClass: march.UNIT_CLASS_ENEMY, hp: 5 },
    { _id: "2", unitClass: march.UNIT_CLASS_CHEST, hp: 5 },

    { _id: "3", unitClass: march.UNIT_CLASS_BARREL, hp: 5 },
    { _id: "4", unitClass: march.UNIT_CLASS_PET, hp: 8, maxHp: 10 },
    { _id: "5", unitClass: march.UNIT_CLASS_ENEMY_BOSS, hp: 8 },

    { _id: "6", unitClass: march.UNIT_CLASS_TRAP, hp: 3, opened: true },
    { _id: "7", unitClass: march.UNIT_CLASS_HP, hp: 1 },
    { _id: "8", unitClass: march.UNIT_CLASS_GOLD, hp: 4 }
  ],
  response: [
    {
      cards: [
        { _id: "0", unitClass: march.UNIT_CLASS_ENEMY, hp: 4 },
        { _id: "4", unitClass: march.UNIT_CLASS_PET, hp: 8, maxHp: 10 },
        { _id: "2", unitClass: march.UNIT_CLASS_CHEST, hp: 5 },

        { _id: "3", unitClass: march.UNIT_CLASS_BARREL, hp: 5 },
        { _id: "7", unitClass: march.UNIT_CLASS_HP, hp: 1 },
        { _id: "5", unitClass: march.UNIT_CLASS_ENEMY_BOSS, hp: 8 },

        { _id: "6", unitClass: march.UNIT_CLASS_TRAP, hp: 3, opened: true },
        { _id: "8", unitClass: march.UNIT_CLASS_GOLD, hp: 4 },
        { _id: "9", unitClass: march.UNIT_CLASS_GOLD, hp: 1 }
      ]
    }
  ]
};
// move left to bow (4 -> 3)
export const c2 = {
  data: [
    { _id: "0", unitClass: march.UNIT_CLASS_ENEMY, hp: 4 },
    { _id: "1", unitClass: march.UNIT_CLASS_ENEMY, hp: 5 },
    { _id: "2", unitClass: march.UNIT_CLASS_CHEST, hp: 5 },
    { _id: "3", unitClass: march.UNIT_CLASS_BOW, hp: 5 },
    { _id: "4", unitClass: march.UNIT_CLASS_PET, hp: 8, maxHp: 10 },
    { _id: "5", unitClass: march.UNIT_CLASS_ENEMY_BOSS, hp: 8 },
    { _id: "6", unitClass: march.UNIT_CLASS_TRAP, hp: 3, opened: true },
    { _id: "7", unitClass: march.UNIT_CLASS_HP, hp: 1 },
    { _id: "8", unitClass: march.UNIT_CLASS_GOLD, hp: 4 }
  ],
  response: [
    {
      cards: [
        null,
        null,
        null,
        { _id: "4" },
        { _id: "5" },
        { _id: "9", unitClass: march.UNIT_CLASS_GOLD, hp: 5 },
        null,
        null,
        null
      ],
      effect: {
        unitClass: march.UNIT_CLASS_BOW,
        index: 3, // Cards array index
        target: [0, 4, 6] // "Victim" indexes array
      }
    },
    {
      cards: [
        { _id: "10", unitClass: march.UNIT_CLASS_GOLD, hp: 4 },
        null,
        null,
        null,
        { _id: "5", hp: 3 },
        null,
        { _id: "11", unitClass: march.UNIT_CLASS_GOLD, hp: 3 },
        null,
        null
      ]
    }
  ]
};
// move to bottom bomb (5 -> 8)
export const c3 = {
  data: [
    { _id: "0", unitClass: march.UNIT_CLASS_ENEMY, hp: 4 },
    { _id: "1", unitClass: march.UNIT_CLASS_ENEMY, hp: 5 },
    { _id: "2", unitClass: march.UNIT_CLASS_CHEST, hp: 5 },
    { _id: "3", unitClass: march.UNIT_CLASS_BOW, hp: 4 },
    { _id: "4", unitClass: march.UNIT_CLASS_PET, hp: 8, maxHp: 10 },
    { _id: "5", unitClass: march.UNIT_CLASS_ENEMY_BOSS, hp: 8 },
    { _id: "6", unitClass: march.UNIT_CLASS_TRAP, hp: 3, opened: true },
    { _id: "7", unitClass: march.UNIT_CLASS_BOMB, hp: 4 },
    { _id: "8", unitClass: march.UNIT_CLASS_GOLD, hp: 4 }
  ],
  response: [
    {
      cards: [
        { _id: "0", unitClass: march.UNIT_CLASS_ENEMY, hp: 4 },
        { _id: "1", unitClass: march.UNIT_CLASS_ENEMY, hp: 5 },
        { _id: "2", unitClass: march.UNIT_CLASS_CHEST, hp: 5 },
        { _id: "3", unitClass: march.UNIT_CLASS_BOW, hp: 4 },
        { _id: "7", unitClass: march.UNIT_CLASS_BOMB, hp: 4 },
        { _id: "5", unitClass: march.UNIT_CLASS_ENEMY_BOSS, hp: 8 },
        { _id: "6", unitClass: march.UNIT_CLASS_TRAP, hp: 3, opened: true },
        { _id: "4", unitClass: march.UNIT_CLASS_PET, hp: 8, maxHp: 10 },
        { _id: "8", unitClass: march.UNIT_CLASS_GOLD, hp: 4 }
      ],
      effect: {
        unitClass: march.UNIT_CLASS_BOMB,
        index: 4, // Cards array index
        target: [1, 3, 5, 7] // "Victim" indexes array
      }
    },
    {
      cards: [
        null,
        { _id: "1", hp: 1 },
        null,
        { _id: "9", unitClass: march.UNIT_CLASS_GOLD, hp: 4 },
        { _id: "10", unitClass: march.UNIT_CLASS_GOLD, hp: 4 },
        { _id: "5", hp: 4 },
        { _id: "6", opened: false },
        { _id: "4", hp: 4 },
        null
      ]
    }
  ]
};
// move to right ball lightning(5 -> 6)
export const c4 = {
  data: [
    { _id: "0", unitClass: march.UNIT_CLASS_ENEMY, hp: 4 },
    { _id: "1", unitClass: march.UNIT_CLASS_ENEMY, hp: 5 },
    { _id: "2", unitClass: march.UNIT_CLASS_CHEST, hp: 5 },
    { _id: "3", unitClass: march.UNIT_CLASS_BOW, hp: 4 },
    { _id: "4", unitClass: march.UNIT_CLASS_PET, hp: 10, maxHp: 10 },
    { _id: "5", unitClass: march.UNIT_CLASS_BALL_LIGHTNING, hp: 5 },
    { _id: "6", unitClass: march.UNIT_CLASS_TRAP, hp: 3, opened: true },
    { _id: "7", unitClass: march.UNIT_CLASS_BOMB, hp: 4 },
    { _id: "8", unitClass: march.UNIT_CLASS_GOLD, hp: 4 }
  ],
  response: [
    {
      cards: [
        null,
        null,
        null,
        { _id: "9", unitClass: march.UNIT_CLASS_GOLD, hp: 4 },
        { _id: "3", unitClass: march.UNIT_CLASS_BOW, hp: 4 },
        { _id: "4" },
        null,
        null,
        null
      ],
      effect: {
        unitClass: march.UNIT_CLASS_BALL_LIGHTNING,
        index: 5, // Cards array index
        target: [0, 1, 2, 4, 6] // "Victim" indexes array
      }
    },
    {
      cards: [
        { _id: "10", unitClass: march.UNIT_CLASS_GOLD, hp: 4 },
        { _id: "11", unitClass: march.UNIT_CLASS_GOLD, hp: 4 },
        { _id: "12", unitClass: march.UNIT_CLASS_GOLD, hp: 4 },
        { _id: "9", unitClass: march.UNIT_CLASS_GOLD, hp: 4 },
        { _id: "13", unitClass: march.UNIT_CLASS_GOLD, hp: 4 },
        { _id: "4", unitClass: march.UNIT_CLASS_PET, hp: 2 },
        { _id: "14", unitClass: march.UNIT_CLASS_GOLD, hp: 4 },
        null,
        null
      ]
    }
  ]
};
// move to right dragon breath(5 -> 8)
export const c5 = {
  data: [
    { _id: "0", unitClass: march.UNIT_CLASS_ENEMY, hp: 4 },
    { _id: "1", unitClass: march.UNIT_CLASS_ENEMY, hp: 5 },
    { _id: "2", unitClass: march.UNIT_CLASS_CHEST, hp: 5 },
    { _id: "3", unitClass: march.UNIT_CLASS_BOW, hp: 4 },
    { _id: "4", unitClass: march.UNIT_CLASS_PET, hp: 10, maxHp: 10 },
    { _id: "5", unitClass: march.UNIT_CLASS_DRAGON_BREATH, hp: 5 },
    { _id: "6", unitClass: march.UNIT_CLASS_TRAP, hp: 3, opened: true },
    { _id: "7", unitClass: march.UNIT_CLASS_BOMB, hp: 4 },
    { _id: "8", unitClass: march.UNIT_CLASS_GOLD, hp: 4 }
  ],
  response: [
    {
      cards: [
        null,
        null,
        null,
        { _id: "9", unitClass: march.UNIT_CLASS_GOLD, hp: 4 },
        { _id: "3", unitClass: march.UNIT_CLASS_BOW, hp: 4 },
        { _id: "4" },
        null,
        null,
        null
      ],
      effect: {
        unitClass: march.UNIT_CLASS_DRAGON_BREATH,
        index: 5, // Cards array index
        target: [0, 1, 2, 4, 6, 7] // "Victim" indexes array
      }
    },
    {
      cards: [
        { _id: "10", unitClass: march.UNIT_CLASS_GOLD, hp: 4 },
        { _id: "11", unitClass: march.UNIT_CLASS_GOLD, hp: 4 },
        { _id: "12", unitClass: march.UNIT_CLASS_GOLD, hp: 4 },
        { _id: "9", unitClass: march.UNIT_CLASS_GOLD, hp: 4 },
        { _id: "13", unitClass: march.UNIT_CLASS_GOLD, hp: 4 },
        { _id: "4", unitClass: march.UNIT_CLASS_PET, hp: 2 },
        { _id: "14", unitClass: march.UNIT_CLASS_GOLD, hp: 4 },
        { _id: "15", unitClass: march.UNIT_CLASS_GOLD, hp: 4 },
        { _id: "8", unitClass: march.UNIT_CLASS_GOLD, hp: 4 }
      ]
    }
  ]
};
