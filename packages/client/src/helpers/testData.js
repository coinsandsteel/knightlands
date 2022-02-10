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
      state: [
        { _id: "0", unitClass: march.UNIT_CLASS_ENEMY, hp: 4 },
        { _id: "4", unitClass: march.UNIT_CLASS_PET, hp: 8, maxHp: 10 },
        { _id: "2", unitClass: march.UNIT_CLASS_CHEST, hp: 5 },

        { _id: "3", unitClass: march.UNIT_CLASS_BARREL, hp: 5 },
        { _id: "7", unitClass: march.UNIT_CLASS_HP, hp: 1 },
        { _id: "5", unitClass: march.UNIT_CLASS_ENEMY_BOSS, hp: 8 },

        { _id: "6", unitClass: march.UNIT_CLASS_TRAP, hp: 3, opened: true },
        { _id: "9", unitClass: march.UNIT_CLASS_GOLD, hp: 1 },
        { _id: "8", unitClass: march.UNIT_CLASS_GOLD, hp: 4 }
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
      state: [
        { _id: "0", unitClass: march.UNIT_CLASS_ENEMY, hp: 4 },
        { _id: "1", unitClass: march.UNIT_CLASS_ENEMY, hp: 5 },
        { _id: "2", unitClass: march.UNIT_CLASS_CHEST, hp: 5 },

        { _id: "4", unitClass: march.UNIT_CLASS_PET, hp: 8, maxHp: 10 },
        { _id: "5", unitClass: march.UNIT_CLASS_ENEMY_BOSS, hp: 8 },
        { _id: "9", unitClass: march.UNIT_CLASS_GOLD, hp: 5 },

        { _id: "6", unitClass: march.UNIT_CLASS_TRAP, hp: 3, opened: true },
        { _id: "7", unitClass: march.UNIT_CLASS_HP, hp: 1 },
        { _id: "8", unitClass: march.UNIT_CLASS_GOLD, hp: 4 }
      ],
      effect: {
        type: march.UNIT_CLASS_BOW,
        sourceId: "4", // _id
        targetIds: ["0", "5", "6"]
      }
    },
    {
      state: [
        { _id: "0", unitClass: march.UNIT_CLASS_ENEMY, hp: 4 },
        { _id: "1", unitClass: march.UNIT_CLASS_ENEMY, hp: 5 },
        { _id: "2", unitClass: march.UNIT_CLASS_CHEST, hp: 5 },

        { _id: "4", unitClass: march.UNIT_CLASS_PET, hp: 8, maxHp: 10 },
        { _id: "5", unitClass: march.UNIT_CLASS_ENEMY_BOSS, hp: 8 },
        { _id: "9", unitClass: march.UNIT_CLASS_GOLD, hp: 5 },

        { _id: "6", unitClass: march.UNIT_CLASS_TRAP, hp: 3, opened: true },
        { _id: "7", unitClass: march.UNIT_CLASS_HP, hp: 1 },
        { _id: "8", unitClass: march.UNIT_CLASS_GOLD, hp: 4 }
      ]
    }
  ]
};
