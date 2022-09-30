<template>
  <div class="relative">
    <Title>Level {{ level.id }}</Title>
    <div class="flex">
      <div
        class="battle-adventure-level-image flex-full flex flex-center"
        :class="
          'battle-adventure-level-image--' + adventure.id + '-' + level.id
        "
      ></div>
      <div class="battle-adventure-info flex flex-center font-size-22">
        <!-- info -->
        <div>
          <div>Exp: {{ exp }}</div>
          <div class="flex flex-no-wrap">
            <div>Reward:</div>
            <BattleCoin class="margin-left-1" :value="reward" />
          </div>
        </div>
      </div>
      <div class="flex-full flex flex-center">
        <CustomButton
          v-if="isLevelAvailable"
          type="red"
          class="inline-block margin-right-2 margin-top-1"
          min-width="12rem"
          @click="clickHandler"
        >
          Start
        </CustomButton>
      </div>
    </div>

    <!-- blocker -->
    <div
      v-if="!isAdventureAvailable"
      class="blocker center padding-top-2 font-size-30 font-weight-900"
    >
      <p v-if="level && level.id === 1" class="yellow-title">
        {{ $t("prev-q-f") }}
      </p>
    </div>
  </div>
</template>
<script>
// import { create } from "vue-modal-dialogs";
// import BattleAdventureDifficultySelect from "@/views/Battle/BattleAdventureDifficultySelect.vue";
import { mapState } from "vuex";
import * as battle from "@/../../knightlands-shared/battle";
import BattleCoin from "@/views/Battle/BattleCoin.vue";

export default {
  components: {
    BattleCoin
  },
  props: {
    adventure: Object,
    level: Object
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("battle", ["adventures"]),
    difficultyIndex() {
      return this.adventures.difficulty === battle.GAME_DIFFICULTY_HIGH ? 1 : 0;
    },
    exp() {
      return this.level.exp[this.difficultyIndex];
    },
    reward() {
      return this.level.reward[this.difficultyIndex];
    },
    // passedLevels() {
    //   if (
    //     !(this.adventure && this.level && this.user && this.user.adventures)
    //   ) {
    //     return [];
    //   }

    //   const ids = Object.keys(this.user.adventures);
    //   const id = this.adventure.id + "";

    //   if (!(ids && ids.includes(id))) {
    //     return [];
    //   }

    //   return Object.keys(this.user.adventures[id]).filter(levelId => {
    //     return !!this.user.adventures[id][levelId][
    //       this.game.adventureDifficulty
    //     ];
    //   });
    // },
    isAdventureAvailable() {
      // if (
      //   !(this.adventure && this.level && this.user && this.user.adventures)
      // ) {
      //   return false;
      // }

      // const ids = Object.keys(this.user.adventures);
      // const id = this.adventure.id + "";

      // if (!(ids && ids.includes(id))) {
      //   return false;
      // }

      if (!this.adventure) {
        return false;
      }

      return (
        this.adventures.locations[this.adventure.id - 1] &&
        this.adventures.locations[this.adventure.id - 1][this.level.id - 1] &&
        this.adventures.locations[this.adventure.id - 1].find(
          level => !!level[this.adventures.difficulty]
        )
      );
    },
    isLevelAvailable() {
      if (!this.level) {
        return false;
      }
      return (
        this.isAdventureAvailable &&
        this.adventures.locations[this.adventure.id - 1][this.level.id - 1] &&
        this.adventures.locations[this.adventure.id - 1][this.level.id - 1][
          this.adventures.difficulty
        ]
      );
      // return false;
      // const id = this.adventure.id + "";
      // const levelId = this.level.id + "";
      // return (
      //   this.isAdventureAvailable &&
      //   // !this.passedLevels.includes(this.level.id + "")
      //   this.user.adventures[id][levelId]
      // );
    }
    // isLevelAvailable() {
    //   return this.isAdventureAvailable;
    // }
  },
  methods: {
    async clickHandler() {
      // const show = create(BattleAdventureDifficultySelect);
      // await show();
      // this.$router.push({
      //   name: "battle-adventure-squad",
      //   params: { id: this.adventure.id }
      // });
      this.$store.dispatch("battle/enterLevel", {
        room: this.adventure.id,
        level: this.level.id
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
.battle-adventure-level-image--1-1 {
  background: url("/images/enemies/Forest Fangrot.png") center/contain no-repeat;
}
.battle-adventure-level-image--1-2 {
  background: url("/images/enemies/Forest Fangrot.png") center/contain no-repeat;
}
.battle-adventure-level-image--1-3 {
  background: url("/images/enemies/Forest Fangrot.png") center/contain no-repeat;
}
.battle-adventure-level-image--1-4 {
  background: url("/images/enemies/Forest Fangrot.png") center/contain no-repeat;
}
.battle-adventure-level-image--1-5 {
  background: url("/images/enemies/Forest Fangrot.png") center/contain no-repeat;
}
.battle-adventure-level-image--2-1 {
  background: url("/images/enemies/Forest Grasshopper.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--2-2 {
  background: url("/images/enemies/Forest Grasshopper.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--2-3 {
  background: url("/images/enemies/Forest Grasshopper.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--2-4 {
  background: url("/images/enemies/Forest Grasshopper.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--2-5 {
  background: url("/images/enemies/Forest Grasshopper.png") center/contain
    no-repeat;
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
.battle-adventure-level-image--3-5 {
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
.battle-adventure-level-image--4-5 {
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
.battle-adventure-level-image--5-5 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--6-1 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--6-2 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--6-3 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--6-4 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--6-5 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
</style>
