<template>
  <div
    class="battle-play-field width-100 height-100 dummy-height flex flex-column flex-no-wrap overflow-hidden"
    :style="{ '--base-size': `${baseSize}px` }"
  >
    <!-- play board -->
    <div class="battle-play-board-border-outer flex flex-center flex-grow-1">
      <div class="battle-play-board-border relative">
        <div class="battle-play-board-background absolute-stretch"></div>
        <div class="battle-play-board">
          <BattleBoardCell
            v-for="(cell, cellIndex) in boardCells"
            :key="cellIndex"
            :index="cellIndex"
            @click="cellClickHandler(cell, cellIndex, $event)"
          />
        </div>
      </div>
    </div>
    <BattleUnitListItem v-if="myActiveFighter" :unit="myActiveFighter" />
    <div class="text-align-center margin-top-2">
      <CustomButton
        type="green"
        width="20rem"
        class="inline-block"
        @click="move1Handler"
        >move</CustomButton
      >
      <CustomButton
        type="green"
        width="20rem"
        class="inline-block"
        @click="animateHandler"
        >animate</CustomButton
      >
    </div>
    <Transition name="fade" appear>
      <BattleAbilitySelect
        v-if="false && abilitySelectResolve"
        :selectedFighterId="selectedFighterId"
        @close="abilitySelectCloseHandler"
      />
    </Transition>
    <Transition name="child-slide-left" appear>
      <BattleAbilitySelect2
        v-if="
          isAbilitySelectVisible &&
            ((isAttackCellSelected && targetAbilities.length > 0) ||
              (!isAttackCellSelected && nonTargetAbilities.length > 0))
        "
        :isAttackCellSelected="isAttackCellSelected"
        :activeFighterId="activeFighterId"
        @close="abilitySelectCloseHandler2"
      />
    </Transition>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { create } from "vue-modal-dialogs";
import _ from "lodash";
import cloneDeep from "lodash/cloneDeep";
import anime from "animejs/lib/anime.es.js";
import * as battle from "@/../../knightlands-shared/battle";
import BattleBoardCell from "@/views/Battle/BattleBoardCell.vue";
import BattleAbilitySelect from "@/views/Battle/BattleAbilitySelect.vue";
import BattleAbilitySelect2 from "@/views/Battle/BattleAbilitySelect2.vue";
import BattleObstacleInformation from "@/views/Battle/BattleObstacleInformation.vue";
import BattleUnitListItem from "@/views/Battle/BattleUnitListItem.vue";

const commonAnimationParams = {
  duration: 200,
  easing: "linear",
  delay: anime.stagger(30)
};

export default {
  components: {
    BattleBoardCell,
    BattleAbilitySelect,
    BattleAbilitySelect2,
    BattleUnitListItem
  },
  data() {
    return {
      abilitySelectResolve: null,
      // selectedFighterId: null,
      isAttackCellSelected: null,
      selectedIndex: null,
      isAbilitySelectVisible: false,
      localQueue: [],
      isProcessingQueue: false
    };
  },
  computed: {
    ...mapState(["appSize"]),
    // ...mapState("battle", ["units", "enemies"]),
    ...mapState("battle", ["game"]),
    ...mapGetters("battle", [
      "units",
      "enemyUnits",
      "isMyTurn",
      "activeFighterId"
    ]),
    baseSize() {
      return this.appSize
        ? Math.floor(this.appSize.width / 6)
        : Math.floor(375 / 6);
    },
    boardCells() {
      return new Array(5 * 7).fill(null);
    },
    queue() {
      return this.game.combat.runtime.queue;
    },
    myActiveFighter() {
      return this.units.find(
        ({ fighterId }) => fighterId === this.activeFighterId
      );
    },
    nonTargetAbilities() {
      const abilities = this.myActiveFighter
        ? this.myActiveFighter.abilities
        : [];

      return abilities.filter(ability => {
        return (
          ability.abilityClass === battle.ABILITY_GROUP_HEAL ||
          ability.abilityClass === battle.ABILITY_AXE_BLOW ||
          battle.ABILITY_TYPES[ability.abilityClass] ===
            battle.ABILITY_TYPE_SELF_BUFF
        );
      });
    },
    targetAbilities() {
      const abilities = this.myActiveFighter
        ? this.myActiveFighter.abilities
        : [];

      return abilities.filter(ability => {
        return !(
          ability.abilityClass === battle.ABILITY_GROUP_HEAL ||
          ability.abilityClass === battle.ABILITY_AXE_BLOW ||
          battle.ABILITY_TYPES[ability.abilityClass] ===
            battle.ABILITY_TYPE_SELF_BUFF
        );
      });
    }
  },
  watch: {
    queue(value) {
      console.log("queue changed", value);
      if (value && value.length > 0) {
        for (let i = 0; i < value.length; i++) {
          this.localQueue.push(value[i]);
        }
      }
      this.processQueue();
    },
    myActiveFighter(value) {
      if (!value) {
        this.isAbilitySelectVisible = false;
        return;
      }
      this.isAbilitySelectVisible = true;
    }
  },
  created() {
    console.log("created");
  },
  mounted() {
    console.log("mounted");
    this.showObstacleInformation();
  },
  methods: {
    async showObstacleInformation() {
      const show = create(BattleObstacleInformation);
      await show();
    },
    async showAbilitySelect() {
      return new Promise(resolve => {
        this.abilitySelectResolve = resolve;
      });
    },
    abilitySelectCloseHandler(event) {
      if (!this.abilitySelectResolve) {
        return;
      }

      this.abilitySelectResolve(event);
      this.abilitySelectResolve = null;
    },
    abilitySelectCloseHandler2(ability) {
      // this.selectedFighterId = null;
      this.isAbilitySelectVisible = false;

      if (!(ability && ability.abilityClass)) {
        return;
      }
      let payload = {
        index: null,
        fighterId: this.activeFighterId,
        ability: ability.abilityClass
      };
      if (this.isAttackCellSelected) {
        payload.index = this.selectedIndex;
      }
      this.$store.dispatch("battle/apply", payload);
      this.isAttackCellSelected = false;
      this.selectedIndex = null;
    },
    async cellClickHandler(cell, index, event) {
      console.log("cell", cell);
      console.log("index", index);
      console.log("event", event);
      // console.log("selectedUnitId", this.selectedUnitId);
      console.log("isMyTurn", this.isMyTurn);
      console.log("isUnit", this.isUnit);

      // if (!this.isMyTurn) {
      //   if (event.isEnemy) {
      //     this.$store.commit("battle/updateState", {
      //       enemySelectedUnitId: event.enemy.unitId,
      //       enemyMoveCells: [
      //         index + 5,
      //         index + 4,
      //         index + 6,
      //         index + 10,
      //         index + 15,
      //         index + 20,
      //         index + 25,
      //         index + 30,
      //         index + 35
      //       ]
      //     });

      //     return;
      //   }

      //   if (event.isEnemyAvailableMove) {
      //     const enemyUnits = cloneDeep(this.enemyUnits) || [];
      //     const enemy = enemyUnits.find(
      //       ({ unitId }) => unitId === this.enemySelectedUnitId
      //     );
      //     enemy.index = index;
      //     this.$store.commit("battle/updateState", {
      //       enemySelectedUnitId: null,
      //       enemyAvailableMoves: [],
      //       enemyUnits
      //     });

      //     this.$store.commit("battle/updateState", {
      //       isMyTurn: true
      //     });
      //   }

      //   return;
      // }

      if (event.isUnit) {
        // if (this.selectedUnitId === event.unit.unitId) {
        //   this.$store.commit("battle/updateState", {
        //     selectedUnitId: null,
        //     moveCells: []
        //   });
        //   return;
        // }
        // this.$store.commit("battle/updateState", {
        //   selectedUnitId: event.unit.unitId,
        //   moveCells: [
        //     index - 5,
        //     index - 4,
        //     index - 6,
        //     index - 10,
        //     index - 15,
        //     index - 20,
        //     index - 25,
        //     index - 30,
        //     index - 35
        //   ]
        // });
        //
        // this.selectedIndex = index;
        // this.isAttackCellSelected = false;
        // this.isAbilitySelectVisible = true;
        // this.$store.dispatch("battle/chooseFighter", {
        //   fighterId: event.unit.fighterId
        //   // index
        // });
      }

      if (event.isMoveCell) {
        // if (event.isMoveCell && !event.isEnemy) {
        // const units = cloneDeep(this.units) || [];
        // const unit = units.find(({ unitId }) => unitId === this.selectedUnitId);
        // unit.index = index;
        // this.$store.commit("battle/updateState", {
        //   selectedUnitId: null,
        //   moveCells: [],
        //   units
        // });

        // this.$store.commit("battle/updateState", {
        //   isMyTurn: false
        // });
        // @todo: remove
        this.selectedIndex = index;
        this.isAttackCellSelected = false;
        this.isAbilitySelectVisible = false;
        // this.selectedFighterId = this.activeFighterId;
        this.$store.dispatch("battle/apply", {
          fighterId: this.activeFighterId,
          index
        });
      }

      if (event.isAttackCell) {
        // if (event.isAttackCell && event.isEnemy) {
        // this.clickedEnemy = cloneDeep(event.enemy);
        // this.$store.commit("battle/updateState", {
        //   moveCells: []
        // });
        // const result = await this.showAbilitySelect();
        // console.log("result", result);
        // this.clickedEnemy = null;
        // this.$store.commit("battle/updateState", {
        //   selectedUnitId: null
        // });
        // this.$store.commit("battle/updateState", {
        //   isMyTurn: false
        // });
        // return;

        this.selectedIndex = index;
        this.isAttackCellSelected = true;
        this.isAbilitySelectVisible = true;

        // this.selectedFighterId = this.activeFighterId;
        // const ability = await this.showAbilitySelect();
        // console.log("ability", ability);
        // if (!(ability && ability.abilityClass)) {
        //   return;
        // }
        // const payload = {
        //   fighterId: this.activeFighterId,
        //   index,
        //   ability: ability.abilityClass
        // };
        // if (
        //   ability.abilityClass === battle.ABILITY_GROUP_HEAL ||
        //   battle.ABILITY_TYPES[ability.abilityClass] ===
        //     battle.ABILITY_TYPE_SELF_BUFF
        // ) {
        //   delete payload.index;
        //   delete payload.fighterId;
        // }
        // this.$store.dispatch("battle/apply", payload);
      }
    },
    async processQueue() {
      // if (!(queue && queue.length > 0)) {
      //   return;
      // }

      // for (let i = 0; i < queue.length; i++) {
      //   const step = queue[i];
      //   await this.processQueueStep(step);
      // }

      if (this.isProcessingQueue || !(this.localQueue.length > 0)) {
        return;
      }
      const step = this.localQueue.shift();
      this.isProcessingQueue = true;
      await this.processQueueStep(step);
      this.isProcessingQueue = false;

      this.processQueue();
    },
    async processQueueStep(step) {
      console.log("processQueueStep", step);
      if (!step) {
        return;
      }

      if (step.action === "move") {
        await this.moveHandler(step);
      } else if (step.action === battle.ABILITY_TYPE_ATTACK) {
        await this.attackHandler(step);
      } else if (step.action === battle.ABILITY_TYPE_BUFF) {
        await this.buffHandler(step);
      } else if (step.action === battle.ABILITY_TYPE_DE_BUFF) {
        await this.deBuffHandler(step);
      }
    },
    moveHandler(step) {
      this.$store.dispatch("battle/move", {
        fighterId: step.fighterId,
        index: step.newIndex,
        ...step
      });
    },
    async effectHandler(step) {
      const el = document.createElement("div");
      el.className =
        "absolute-stretch battle-effect--other-effect font-size-22 flex flex-center text-center";
      el.style = "opacity: 0;";
      el.innerText = "effect";
      await this.animateSlideAndFade({ index: 34, el });
      el.parentElement.removeChild(el);
    },
    async attackHandler(step) {
      const el = document.createElement("div");
      el.className = "absolute-stretch battle-effect--group-attack";
      el.style = "opacity: 0;";
      await this.animateSlideAndFade({ index: 30, el });
      el.parentElement.removeChild(el);
    },
    async buffHandler(step) {
      const el = document.createElement("div");
      el.className = "absolute-stretch battle-effect--group-buff";
      el.style = "opacity: 0;";
      await this.animateSlideAndFade({ index: 31, el });
      el.parentElement.removeChild(el);
    },
    async deBuffHandler(step) {
      const el = document.createElement("div");
      el.className = "absolute-stretch battle-effect--group-de-buff";
      el.style = "opacity: 0;";
      await this.animateSlideAndFade({ index: 32, el });
      el.parentElement.removeChild(el);
    },
    async selfBuffHandler(step) {
      const el = document.createElement("div");
      el.className = "absolute-stretch battle-effect--self-buff";
      el.style = "opacity: 0;";
      await this.animateSlideAndFade({ index: 33, el });
      el.parentElement.removeChild(el);
    },
    async damageHandler(step) {
      const el = document.createElement("div");
      el.className =
        "absolute-stretch battle-effect--damage font-size-22 flex flex-center text-center";
      el.style = "opacity: 0;";
      el.innerText = "-999";
      await this.animateSlideAndFade({ index: 17, el });
      el.parentElement.removeChild(el);
    },
    async animateSlideAndFade({ index, el }) {
      const cells = document.querySelectorAll(".battle-board-cell-container");
      const effectContainer = cells[index].querySelector(".effect-wrapper");
      effectContainer.appendChild(el);

      const gapSize = 10;
      const animation = anime({
        ...commonAnimationParams,
        duration: 800,
        targets: el,
        translateY: [
          0,
          `calc(-5% - ${gapSize}px)`,
          `calc(-80% - ${gapSize}px)`,
          `calc(-100% - ${gapSize}px)`
        ],
        opacity: [0, 0.8, 1, 0]
      });
      await animation.finished;
    },
    resetStyle(el, resetStyle) {
      if (!resetStyle) {
        return;
      }

      if (el && typeof el.length === "number") {
        el.forEach(item => item.removeAttribute("style"));
      } else {
        el.removeAttribute("style");
      }
    },
    animateHandler() {
      // this.groupAttackHandler({
      //   action: battle.ABILITY_TYPE_ATTACK,
      //   source: {
      //     unitId: "v4nv9",
      //     index: 3
      //   },
      //   target: {
      //     unitId: "v4nv9",
      //     index: 8,
      //     newHp: 5
      //   },
      //   ability: {
      //     abilityClass: battle.ABILITY_DEATH_SHOT,
      //     damage: 5,
      //     criticalHit: false
      //   }
      // });
      this.attackHandler({});
      this.buffHandler({});
      this.deBuffHandler({});
      this.selfBuffHandler({});
      this.effectHandler({});
      this.damageHandler({});
    },
    move1Handler() {
      const units = _.cloneDeep(this.units);
      if (units && units.length > 0) {
        this.$store.dispatch("battle/move", {
          fighterId: units[0].fighterId,
          index: units[0].index === 17 ? 30 : 17,
          oldIndex: units[0].index === 17 ? 17 : 30
        });
      }
      const enemyUnits = _.cloneDeep(this.enemyUnits);
      if (enemyUnits && enemyUnits.length > 0) {
        this.$store.dispatch("battle/move", {
          fighterId: enemyUnits[0].fighterId,
          index: enemyUnits[0].index === 0 ? 12 : 0,
          oldIndex: enemyUnits[0].index === 0 ? 0 : 12
        });
      }
    }
  }
};
</script>
<style scoped lang="less">
.battle-play-board {
  display: grid;
  grid-template-columns: repeat(5, calc(var(--base-size) * 0.8));
}
::v-deep {
  .battle-effect--group-attack {
    background: url("/images/battle/effect/attack.png") center/70% no-repeat;
  }
  .battle-effect--group-buff {
    background: url("/images/battle/effect/buff.png") center/70% no-repeat;
  }
  .battle-effect--group-de-buff {
    background: url("/images/battle/effect/de_buff.png") center/70% no-repeat;
  }
  .battle-effect--self-buff {
    background: url("/images/battle/effect/self_buff.png") center/70% no-repeat;
  }
  .battle-effect--damage {
    color: red;
  }
}
</style>
