<template>
  <div class="relative">
    <Title>Level {{ levelIndex + 1 }}</Title>
    <div class="flex">
      <div
        class="battle-adventure-level-image flex-full flex flex-center"
        :class="
          'battle-adventure-level-image--' + locationIndex + '-' + levelIndex
        "
      ></div>
      <div class="battle-adventure-info flex flex-center font-size-22">
        <!-- info -->
        <div>
          <div v-if="exp">Exp: {{ exp }}</div>
          <div v-if="coins" class="flex flex-center flex-no-wrap">
            <div>Rewards:</div>
            <BattleCoin
              class="margin-left-half white-space-no-wrap"
              :value="coins"
            />
          </div>
          <div
            v-if="bossCoins || bossCrystals"
            class="flex flex-center flex-no-wrap"
          >
            <div class="white-space-no-wrap">Boss:</div>
            <BattleCoin
              v-if="bossCoins"
              class="margin-left-half white-space-no-wrap"
              :value="bossCoins"
            />
            <BattleCrystal
              v-if="bossCrystals"
              class="margin-left-half white-space-no-wrap"
              :value="bossCrystals"
            />
          </div>
        </div>
      </div>
      <div class="flex-full flex flex-column flex-no-wrap flex-center">
        <CustomButton
          v-if="isLevelAvailable"
          :disabled="!canStart"
          :type="difficulty === 'high' ? 'red' : 'green'"
          class="inline-block margin-right-1 margin-top-1"
          min-width="14rem"
          @click="clickHandler"
        >
          Start
          <div class="icon-energy margin-left-1" />
          {{ energyCost }}
        </CustomButton>
        <div
          v-if="isLevelAvailable && !isFightersFullFilled"
          class="font-size-18 font-shadow rarity-mythical"
        >
          You need to build a squad
        </div>
      </div>
    </div>

    <!-- blocker -->
    <div
      v-if="!isLevelAvailable"
      class="blocker center padding-top-1 font-size-30 font-weight-900"
      :class="{ 'blocker--last': levelIndex === 4 }"
    >
      <p v-if="!levelIndex" class="yellow-title">
        {{ $t("prev-q-f") }}
      </p>
    </div>
  </div>
</template>
<script>
// import { create } from "vue-modal-dialogs";
// import BattleAdventureDifficultySelect from "@/views/Battle/BattleAdventureDifficultySelect.vue";
import { mapState, mapGetters } from "vuex";
import * as battle from "@/../../knightlands-shared/battle";
import BattleCoin from "@/views/Battle/BattleCoin.vue";
import BattleCrystal from "@/views/Battle/BattleCrystal.vue";

export default {
  components: {
    BattleCoin,
    BattleCrystal
  },
  props: {
    locationIndex: Number,
    levelIndex: Number,
    levelData: Object,

    /*
    {
      reward: { xp: 1702, coins: 3900 },
      bossReward: { coins: 51450, crystals: 55 },
      enemies: {
        level: 40,
        abilities: [14, 7, 2],
        templates: [211, 214, 217, 220, 223],
        boss: 220,
      },
    }
    */
    levelMeta: Object
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("battle", ["isFightersFullFilled"]),
    ...mapState("battle", ["user", "adventures"]),
    difficulty() {
      return this.adventures.difficulty || battle.GAME_DIFFICULTY_MEDIUM;
    },
    exp() {
      return this.levelMeta.reward.xp;
    },
    coins() {
      return this.levelMeta.reward.coins;
    },
    isNextLocationAvailable() {
      if (!(this.adventures && this.adventures.locations)) {
        return false;
      }

      let nextLocationIndex = this.locationIndex + 1;
      let nextLocationDifficulty = this.difficulty;

      if (nextLocationIndex > battle.ADVENTURES.length - 1) {
        if (this.difficulty === battle.GAME_DIFFICULTY_HIGH) {
          return false;
        }
        nextLocationIndex = 0;
        nextLocationDifficulty = battle.GAME_DIFFICULTY_HIGH;
      }

      return !!this.adventures.locations[nextLocationIndex].levels[0][
        nextLocationDifficulty
      ];
    },
    bossCoins() {
      if (!this.levelMeta.bossReward || this.isNextLocationAvailable) {
        return 0;
      }

      return this.levelMeta.bossReward.coins;
    },
    bossCrystals() {
      if (!this.levelMeta.bossReward || this.isNextLocationAvailable) {
        return 0;
      }

      return this.levelMeta.bossReward.crystals;
    },
    isLevelAvailable() {
      return this.levelData[this.difficulty];
    },
    energyCost() {
      if (this.adventures.difficulty === battle.GAME_DIFFICULTY_HIGH) {
        return 12;
      }

      return 8;
    },
    canStart() {
      return (
        this.isFightersFullFilled && this.user.balance.energy > this.energyCost
      );
    }
  },
  methods: {
    async clickHandler() {
      await this.$store.dispatch("battle/enterLevel", {
        location: this.locationIndex,
        level: this.levelIndex
      });
      this.$nextTick(() => {
        this.$router.push({
          name: "battle-adventure-play"
        });
      });
    }
  }
};
</script>
<style scoped lang="less">
.battle-adventure-info {
  width: 120px;
}
.battle-adventure-level-image {
  width: 100%;
  height: 80px;
}
.blocker {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  // height: calc(100% + 2rem);
  height: 100%;
  background-color: #353440cc;
  z-index: 5;
}
.blocker--last {
  height: calc(100% + 2rem);
}
.battle-adventure-level-image--0-0 {
  background: url("/images/battle/units/kobold-1.png") center/contain no-repeat;
}
.battle-adventure-level-image--0-1 {
  background: url("/images/battle/units/goblin-2.png") center/contain no-repeat;
}
.battle-adventure-level-image--0-2 {
  background: url("/images/battle/units/eldritch-2.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--0-3 {
  background: url("/images/battle/units/fallen-king-4.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--0-4 {
  background: url("/images/battle/units/kobold-5.png") center/contain no-repeat;
}
.battle-adventure-level-image--1-0 {
  background: url("/images/battle/units/legendary-1.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--1-1 {
  background: url("/images/battle/units/eldritch-3.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--1-2 {
  background: url("/images/battle/units/clockwork-1.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--1-3 {
  background: url("/images/battle/units/insect-5.png") center/contain no-repeat;
}
.battle-adventure-level-image--1-4 {
  background: url("/images/battle/units/assembling-2.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--2-0 {
  background: url("/images/battle/units/clockwork-2.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--2-1 {
  background: url("/images/battle/units/legendary-3.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--2-2 {
  background: url("/images/battle/units/assembling-4.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--2-3 {
  background: url("/images/battle/units/dwarf-3.png") center/contain no-repeat;
}
.battle-adventure-level-image--2-4 {
  background: url("/images/battle/units/clockwork-3.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--3-0 {
  background: url("/images/battle/units/egypt-2.png") center/contain no-repeat;
}
.battle-adventure-level-image--3-1 {
  background: url("/images/battle/units/ice-1.png") center/contain no-repeat;
}
.battle-adventure-level-image--3-2 {
  background: url("/images/battle/units/skeleton-2.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--3-3 {
  background: url("/images/battle/units/fallen-king-2.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--3-4 {
  background: url("/images/battle/units/eldritch-4.png") center/80% no-repeat;
}
.battle-adventure-level-image--4-0 {
  background: url("/images/battle/units/kobold-2.png") center/contain no-repeat;
}
.battle-adventure-level-image--4-1 {
  background: url("/images/battle/units/dwarf-4.png") center/contain no-repeat;
}
.battle-adventure-level-image--4-2 {
  background: url("/images/battle/units/orc-1.png") center/contain no-repeat;
}
.battle-adventure-level-image--4-3 {
  background: url("/images/battle/units/fallen-king-1.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--4-4 {
  background: url("/images/battle/units/ice-2.png") center/75% no-repeat;
}
.battle-adventure-level-image--5-0 {
  background: url("/images/battle/units/legendary-5.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--5-1 {
  background: url("/images/battle/units/skeleton-3.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--5-2 {
  background: url("/images/battle/units/assembling-1.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--5-3 {
  background: url("/images/battle/units/elf-1.png") center/contain no-repeat;
}
.battle-adventure-level-image--5-4 {
  background: url("/images/battle/units/legendary-4.png") center/65% no-repeat;
}
</style>
