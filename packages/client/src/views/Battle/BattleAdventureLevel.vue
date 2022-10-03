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
          <div>Exp: {{ exp }}</div>
          <div class="flex flex-no-wrap">
            <div>Reward:</div>
            <BattleCoin class="margin-left-1" :value="coins" />
          </div>
        </div>
      </div>
      <div class="flex-full flex flex-center">
        <CustomButton
          v-if="isLevelAvailable"
          :disabled="!isFightersFullFilled"
          type="red"
          class="inline-block margin-right-1 margin-top-1"
          min-width="12rem"
          @click="clickHandler"
        >
          Start
        </CustomButton>
      </div>
    </div>

    <!-- blocker -->
    <div
      v-if="!isLevelAvailable"
      class="blocker center padding-top-1 font-size-30 font-weight-900"
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

export default {
  components: {
    BattleCoin
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
    ...mapState("battle", ["adventures"]),
    difficulty() {
      return this.adventures.difficulty ?? battle.GAME_DIFFICULTY_MEDIUM;
    },
    exp() {
      return this.levelMeta.reward.xp;
    },
    coins() {
      return this.levelMeta.reward.coins;
    },
    isLevelAvailable() {
      return this.levelData[this.difficulty];
    }
  },
  methods: {
    async clickHandler() {
      this.$store.dispatch("battle/enterLevel", {
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
  height: calc(100% + 2rem);
  background-color: #353440cc;
  z-index: 5;
}
.battle-adventure-level-image--0-0 {
  background: url("/images/enemies/Forest Fangrot.png") center/contain no-repeat;
}
.battle-adventure-level-image--0-1 {
  background: url("/images/enemies/Forest Fangrot.png") center/contain no-repeat;
}
.battle-adventure-level-image--0-2 {
  background: url("/images/enemies/Forest Fangrot.png") center/contain no-repeat;
}
.battle-adventure-level-image--0-3 {
  background: url("/images/enemies/Forest Fangrot.png") center/contain no-repeat;
}
.battle-adventure-level-image--0-4 {
  background: url("/images/enemies/Forest Fangrot.png") center/contain no-repeat;
}
.battle-adventure-level-image--1-0 {
  background: url("/images/enemies/Forest Grasshopper.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--1-1 {
  background: url("/images/enemies/Forest Grasshopper.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--1-2 {
  background: url("/images/enemies/Forest Grasshopper.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--1-3 {
  background: url("/images/enemies/Forest Grasshopper.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--1-4 {
  background: url("/images/enemies/Forest Grasshopper.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--2-0 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--2-1 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--2-2 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--2-3 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--2-4 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--3-0 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--3-1 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--3-2 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--3-3 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--3-4 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--4-0 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--4-1 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--4-2 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--4-3 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--4-4 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--5-0 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--5-1 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--5-2 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--5-3 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--5-4 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
</style>
