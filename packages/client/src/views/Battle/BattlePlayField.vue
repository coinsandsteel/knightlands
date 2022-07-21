<template>
  <div
    class="battle-play-field width-100 height-100 dummy-height flex flex-column flex-no-wrap overflow-hidden"
    :style="{ '--base-size': `${baseSize}px` }"
  >
    <portal v-if="isActive" to="sectionTop" :slim="true">
      <div
        class="width-100 flex flex-center padding-top-1 padding-bottom-1 relative"
      >
        <progress-bar
          ref="energy"
          :maxValue="BATTLE_MAX_ENERGY"
          :value="energy"
          iconClass="icon-energy"
          :hideMaxValue="true"
          :expand="false"
          barType="blue"
          class="pointer width-30"
        ></progress-bar>
        <BattleCoin class="margin-left-2" />
        <BattleCrystal class="margin-left-2" />
        <CloseButton
          class="absolute-right top-unset margin-right-1"
          @click="exitHandler"
        />
      </div>
    </portal>
    <!-- play board -->
    <div
      class="battle-play-board-border-outer flex flex-center flex-grow-1 margin-top-4"
    >
      <div class="flex flex-space-between width-100">
        <div class="flex flex-column">
          <BattleSideCell
            v-for="fighter in units"
            :fighter="fighter"
            :key="fighter.fighterId"
            @click="showFighterDetails(fighter.fighterId)"
          />
        </div>
        <div class="battle-play-board-border relative">
          <div class="battle-play-board-background absolute-stretch"></div>
          <div class="battle-play-board">
            <BattleBoardCell
              v-for="(cell, cellIndex) in boardCells"
              :key="cellIndex"
              :index="cellIndex"
              :selectedAbilityClass="selectedAbilityClass"
              @click="cellClickHandler(cell, cellIndex, $event)"
            />
          </div>
        </div>
        <div class="flex flex-column">
          <BattleSideCell
            v-for="fighter in enemyUnits"
            :fighter="fighter"
            :key="fighter.fighterId"
            @click="showFighterDetails(fighter.fighterId)"
          />
        </div>
      </div>
    </div>
    <!-- skip button -->
    <div v-if="myActiveFighter" class="text-align-center margin-top-2">
      <CustomButton
        type="blue"
        width="20rem"
        class="inline-block"
        @click="skipHandler"
      >
        Skip Turn
      </CustomButton>
    </div>
    <!-- active unit -->
    <div v-if="activeFighter" class="margin-top-2 font-size-22">
      <div class="flex flex-center">
        <BattleUnit
          :unit="activeFighter"
          :is-enemy="!myActiveFighter"
          class="battle-current-active-fighter"
        />
      </div>
      <div class="text-align-center">
        # {{ activeFighter.unitTribe }} {{ activeFighter.unitClass }}
        {{ activeFighter.tier }} #
      </div>
      <div
        v-if="buffDescriptions && buffDescriptions.length > 0"
        class="text-align-center padding-left-2 padding-right-2"
      >
        <div v-for="(description, index) in buffDescriptions" :key="index">
          {{ description }}
        </div>
      </div>
      <template v-if="myActiveFighter">
        <div
          v-if="abilities && abilities.length > 0"
          class="flex flex-center margin-top-1 margin-bottom-1"
        >
          <BattleUnitAbility
            v-for="ability in abilities"
            :key="ability.abilityClass"
            :ability="ability"
            :isActive="ability.abilityClass === selectedAbilityClass"
            :value="ability.value"
            class="battle-current-active-fighter-ability pointer"
            :class="{ 'opacity-30 pointer-events-none': !ability.enabled }"
            @click.native="abilitySelectHandler(ability)"
          />
        </div>
        <div v-if="abilityCooldownEstimate" class="text-align-center">
          Cooldown!
          {{
            abilityCooldownEstimate > 1
              ? "Cooldown! " + abilityCooldownEstimate + " steps left"
              : "Cooldown! " + abilityCooldownEstimate + " step left"
          }}
        </div>
        <div v-if="abilityDescription" class="text-align-center">
          {{ abilityDescription }}
        </div>
      </template>
    </div>
    <div v-if="false" class="text-align-center margin-top-2">
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
    <!-- <Transition name="fade" appear>
      <BattleAbilitySelect
        v-if="false && abilitySelectResolve"
        :selectedFighterId="selectedFighterId"
        @close="abilitySelectCloseHandler"
      />
    </Transition>
    <Transition name="child-slide-left" appear>
      <BattleAbilitySelect2
        _v-if="
          isAbilitySelectVisible &&
            ((isAttackCellSelected && targetAbilities.length > 0) ||
              (!isAttackCellSelected && nonTargetAbilities.length > 0))
        "
        v-if="myActiveFighter && canSelectAbility"
        :isAttackCellSelected="isAttackCellSelected"
        :activeFighterId="activeFighterId"
        @close="abilitySelectCloseHandler2"
      />
    </Transition> -->
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { create } from "vue-modal-dialogs";
import _ from "lodash";
import cloneDeep from "lodash/cloneDeep";
import anime from "animejs/lib/anime.es.js";
import * as battle from "@/../../knightlands-shared/battle";
import ActivityMixin from "@/components/ActivityMixin.vue";
import BattleBoardCell from "@/views/Battle/BattleBoardCell.vue";
import ProgressBar from "@/components/ProgressBar.vue";
// import BattleAbilitySelect from "@/views/Battle/BattleAbilitySelect.vue";
// import BattleAbilitySelect2 from "@/views/Battle/BattleAbilitySelect2.vue";
import BattleObstacleInformation from "@/views/Battle/BattleObstacleInformation.vue";
// import BattleUnitListItem from "@/views/Battle/BattleUnitListItem.vue";
import BattleFighterDetails from "@/views/Battle/BattleFighterDetails.vue";
import BattleSideCell from "@/views/Battle/BattleSideCell.vue";
import BattleUnit from "@/views/Battle/BattleUnit.vue";
import BattleUnitAbility from "@/views/Battle/BattleUnitAbility.vue";
import BattleCoin from "@/views/Battle/BattleCoin.vue";
import BattleCrystal from "@/views/Battle/BattleCrystal.vue";
import BattleExitGame from "@/views/Battle/BattleExitGame.vue";
import CloseButton from "@/components/CloseButton.vue";

const commonAnimationParams = {
  duration: 200,
  easing: "linear",
  delay: anime.stagger(30)
};

export default {
  mixins: [ActivityMixin],
  components: {
    BattleBoardCell,
    // BattleAbilitySelect,
    // BattleAbilitySelect2,
    // BattleUnitListItem,
    // BattleFighterDetails,
    BattleSideCell,
    BattleUnit,
    BattleUnitAbility,
    BattleCoin,
    BattleCrystal,
    ProgressBar,
    CloseButton
  },
  data() {
    return {
      abilitySelectResolve: null,
      // selectedFighterId: null,
      isAttackCellSelected: null,
      selectedIndex: null,
      isAbilitySelectVisible: false,
      localQueue: [],
      isProcessingQueue: false,
      selectedAbilityClass: null,
      // canSelectAbility: true
      BATTLE_MAX_ENERGY: battle.BATTLE_MAX_ENERGY
    };
  },
  computed: {
    ...mapState(["appSize"]),
    // ...mapState("battle", ["units", "enemies"]),
    ...mapState("battle", ["game", "user"]),
    ...mapGetters("battle", [
      "units",
      "enemyUnits",
      "isMyTurn",
      "activeFighterId",
      "moveCells"
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
    activeFighter() {
      return [...this.units, ...this.enemyUnits].find(
        ({ fighterId }) => fighterId === this.activeFighterId
      );
    },
    myActiveFighter() {
      return this.units.find(
        ({ fighterId }) => fighterId === this.activeFighterId
      );
    },
    myActiveFighterId() {
      return this.myActiveFighter ? this.myActiveFighter.fighterId : null;
    },
    abilities() {
      if (!this.myActiveFighter) {
        return [];
      }

      const additionalAbilities = [
        { abilityClass: battle.ABILITY_MOVE, enabled: true },
        { abilityClass: battle.ABILITY_ATTACK, enabled: true }
      ];
      // const abilities =
      //   this.myActiveFighter.abilities.filter(({ enabled }) => enabled) || [];
      const abilities = this.myActiveFighter.abilities || [];

      return [...additionalAbilities, ...abilities];
    },
    selectedAbility() {
      return this.abilities.find(
        ({ abilityClass }) => abilityClass === this.selectedAbilityClass
      );
    },
    abilityDescription() {
      if (!this.selectedAbility) {
        return null;
      }

      const name = this.selectedAbility.abilityClass;
      const level = this.selectedAbility.level
        ? this.selectedAbility.level.current
        : null;
      const value = this.selectedAbility.value;
      const items = [];

      if (name) {
        items.push(name);
      }
      if (level) {
        items.push("level: " + level);
      }
      if (value) {
        items.push("value: " + (value > 0 ? "+" : "") + value);
      }

      return items.join(", ");
    },
    abilityCooldownEstimate() {
      return this.selectedAbility &&
        this.selectedAbility.cooldown &&
        this.selectedAbility.cooldown.estimate
        ? this.selectedAbility.cooldown.estimate
        : null;
    },
    buffDescriptions() {
      return (this.activeFighter
        ? this.activeFighter.buffs || []
        : // [
          //   {
          //     source: "squad_bonus",
          //     type: "incoming_damage",
          //     modifier: 1.2,
          //     probability: 123,
          //     max: 1,
          //     estimate: 2
          //   }
          // ]
          []
      ).map(buff => {
        let description = `${buff.source} added effect of ${buff.type} by ${buff.modifier}`;

        if (buff.probability) {
          description += `, probability ${buff.probability}`;
        }

        if (buff.estimate) {
          description += `, ${buff.estimate} draws left`;
        }

        return description;
      });
    },
    energy() {
      return this.user.balance.energy;
    }
    // isStarted() {
    //   return this.game.combat.started;
    // }
    // nonTargetAbilities() {
    //   const abilities = this.myActiveFighter
    //     ? this.myActiveFighter.abilities
    //     : [];

    //   return abilities.filter(ability => {
    //     return (
    //       ability.abilityClass === battle.ABILITY_GROUP_HEAL ||
    //       ability.abilityClass === battle.ABILITY_AXE_BLOW ||
    //       battle.ABILITY_TYPES[ability.abilityClass] ===
    //         battle.ABILITY_TYPE_SELF_BUFF
    //     );
    //   });
    // },
    // targetAbilities() {
    //   const abilities = this.myActiveFighter
    //     ? this.myActiveFighter.abilities
    //     : [];

    //   return abilities.filter(ability => {
    //     return !(
    //       ability.abilityClass === battle.ABILITY_GROUP_HEAL ||
    //       ability.abilityClass === battle.ABILITY_AXE_BLOW ||
    //       battle.ABILITY_TYPES[ability.abilityClass] ===
    //         battle.ABILITY_TYPE_SELF_BUFF
    //     );
    //   });
    // }
  },
  watch: {
    // isStarted(value, oldValue) {
    //   if (this.isActive && oldValue === true && value === false) {
    //     this.$router.replace({ name: "battle-menu" });
    //   }
    // },
    queue(value) {
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
    },
    myActiveFighterId: {
      immediate: true,
      handler: function(value) {
        // select default ability
        this.$nextTick(() => {
          this.selectedAbilityClass = value
            ? this.moveCells.length > 0
              ? battle.ABILITY_MOVE
              : battle.ABILITY_ATTACK
            : null;
        });
      }
    }
  },
  created() {},
  mounted() {
    // if (!this.game.combat.started) {
    //   this.$router.replace({ name: "battle-menu" });
    //   return;
    // }
    this.showObstacleInformation();
  },
  // activated() {
  //   if (!this.isStarted) {
  //     this.$router.replace({ name: "battle-menu" });
  //   }
  // },
  methods: {
    async showObstacleInformation() {
      const show = create(BattleObstacleInformation);
      await show();
    },
    // async showAbilitySelect() {
    //   return new Promise(resolve => {
    //     this.abilitySelectResolve = resolve;
    //   });
    // },
    // abilitySelectCloseHandler(event) {
    //   if (!this.abilitySelectResolve) {
    //     return;
    //   }

    //   this.abilitySelectResolve(event);
    //   this.abilitySelectResolve = null;
    // },
    abilitySelectHandler(ability) {
      // this.selectedFighterId = null;
      // this.isAbilitySelectVisible = false;

      if (!(ability && ability.abilityClass && ability.enabled)) {
        return;
      }
      // let payload = {
      //   index: this.selectedIndex || null,
      //   fighterId: this.activeFighterId,
      //   ability: ability.abilityClass
      // };
      // if (this.isAttackCellSelected) {
      //   payload.index = this.selectedIndex;
      // }
      // this.$store.dispatch("battle/apply", payload);
      // this.isAttackCellSelected = false;
      // this.selectedIndex = null;
      this.selectedAbilityClass = ability.abilityClass;
      this.$store.dispatch("battle/chooseAbility", {
        abilityClass: ability.abilityClass
      });
    },
    async cellClickHandler(cell, index, event) {
      // if (!this.isMyTurn) {
      //   return;
      // }

      if (event.isAttackCell) {
        const payload = {
          index,
          ability: this.selectedAbilityClass || null
        };
        this.$store.dispatch("battle/apply", payload);

        return;
      }

      if (event.isMoveCell && !(event.isUnit || event.isEnemy)) {
        this.selectedIndex = index;
        this.isAttackCellSelected = false;
        this.isAbilitySelectVisible = false;
        this.$store.dispatch("battle/apply", {
          index,
          ability: battle.ABILITY_MOVE
        });

        return;
      }

      // if (event.isUnit) {
      //   this.showFighterDetails(event.unit.fighterId);
      //   return;
      // }

      // if (event.isEnemy) {
      //   this.showFighterDetails(event.enemy.fighterId);
      //   return;
      // }
    },
    async showFighterDetails(fighterId) {
      const show = create(BattleFighterDetails, "fighterId");
      await show(fighterId);
    },
    async exitHandler() {
      const showDialog = create(BattleExitGame);
      const result = await showDialog();
      if (result) {
        this.$store.dispatch("battle/exit");
        this.$router.replace({ name: "battle-menu" });
      }
    },
    skipHandler() {
      this.$store.dispatch("battle/skip");
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

      if (
        step.target &&
        step.target.fighterId &&
        typeof step.target.newHp === "number"
      ) {
        const isEnemy = this.enemyUnits.find(
          ({ fighterId }) => fighterId === step.target.fighterId
        );
        this.$store.dispatch("battle/update", {
          [isEnemy ? "enemyFighter" : "userFighter"]: [
            { fighterId: step.target.fighterId, hp: step.target.newHp }
          ]
        });
      }

      this.isProcessingQueue = false;

      this.processQueue();
    },
    async processQueueStep(step) {
      if (!step) {
        return;
      }

      if (step.target && (step.ability || step.buff)) {
        await this.abilityEffectHandler(step);
      } else if (step.action === "move") {
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
    async abilityEffectHandler(step) {
      const ability = step.ability || step.buff;
      const abilityClass = ability ? ability.abilityClass : null;
      const damage = ability ? ability.value || ability.damage || 0 : 0;
      const isCriticalHit = ability && ability.criticalHit;
      const isTargetMyFighter =
        step.target && step.target.fighterId
          ? !!this.units.find(
              ({ fighterId }) => fighterId === step.target.fighterId
            )
          : false;
      let colorClass = "";
      if (
        abilityClass &&
        battle.ABILITY_TYPES[abilityClass] === battle.ABILITY_TYPE_ATTACK
      ) {
        // attack
        if (isTargetMyFighter) {
          // target is my fighters
          colorClass = "battle-ability-effect-value--red";
        } else {
          colorClass = "battle-ability-effect-value--green";
        }
      } else if (
        abilityClass &&
        battle.ABILITY_TYPES[abilityClass] !== battle.ABILITY_TYPE_JUMP
      ) {
        // buff, debuff, self buff, healing
        colorClass = "battle-ability-effect-value--blue";
      }

      const el = document.createElement("div");
      el.className =
        "absolute-stretch flex flex-center text-center font-size-18 font-weight-700";
      el.style = "opacity: 0;";
      el.innerHTML =
        '<div class="battle-ability-effect _battle-ability-effect--attack_ battle-ability-effect--' +
        abilityClass +
        '"></div>' +
        '<div class="battle-ability-effect-value margin-left-half ' +
        colorClass +
        '">' +
        damage +
        (isCriticalHit ? " Crit!" : "") +
        "</div>";
      await this.animateSlideAndFade({ index: step.target.index, el });
      el.parentElement.removeChild(el);
    },
    async effectHandler(step) {
      const el = document.createElement("div");
      el.className =
        "absolute-stretch battle-effect--other-effect font-size-16 flex flex-center text-center";
      el.style = "opacity: 0;";
      el.innerText = "effect";
      await this.animateSlideAndFade({ index: 34, el });
      el.parentElement.removeChild(el);
    },
    async attackHandler(step) {
      const el = document.createElement("div");
      el.className =
        "absolute-stretch battle-effect--attack flex flex-center text-center font-size-18 font-weight-700";
      el.style = "opacity: 0;";
      el.innerHTML =
        "<div>" + (step.ability.value || step.ability.damage) + "</div>";
      // await this.animateSlideAndFade({ index: 30, el });
      await this.animateSlideAndFade({ index: step.target.index, el });
      el.parentElement.removeChild(el);
    },
    async buffHandler(step) {
      const el = document.createElement("div");
      el.className = "absolute-stretch battle-effect--buff";
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
        duration: 700,
        targets: el,
        translateY: [
          0,
          `calc(-5% - ${gapSize}px)`,
          `calc(-35% - ${gapSize}px)`,
          `calc(-50% - ${gapSize}px)`
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
      this.abilityEffectHandler({
        action: battle.ABILITY_TYPE_ATTACK,
        source: {
          unitId: "v4nv9",
          index: 3
        },
        target: {
          unitId: "v4nv9",
          index: 8,
          newHp: 5
        },
        ability: {
          abilityClass: battle.ABILITY_ATTACK,
          damage: 5,
          criticalHit: false
        }
      });
      // this.attackHandler({});
      // this.buffHandler({});
      // this.deBuffHandler({});
      // this.selfBuffHandler({});
      // this.effectHandler({});
      // this.damageHandler({});
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
.battle-unit.battle-current-active-fighter {
  width: calc(var(--base-size) * 1);
  height: calc(var(--base-size) * 1);
}
.battle-current-active-fighter-ability {
  width: calc(var(--base-size) * 0.8);
  height: calc(var(--base-size) * 0.8);
  margin: 0 calc(var(--base-size) * 0.125);
  border-radius: 50%;
}
// .battle-current-active-fighter-ability--active {
//   border: 2px solid #10b981;
//   background-clip: border-box;
// }
::v-deep {
  .battle-ability-effect {
    width: calc(var(--base-size) * 0.4);
    height: calc(var(--base-size) * 0.4);
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
  }
  .battle-ability-effect-value {
    border-radius: 6px;
    color: #fff;
    background: #555;
    padding: 0 3px;
  }
  .battle-ability-effect-value--red {
    background: #ef4444;
  }
  .battle-ability-effect-value--green {
    background: #10b981;
  }
  .battle-ability-effect-value--blue {
    color: #3b82f6;
  }
  //
  .battle-ability-effect--accurate_shot {
    background-image: url("/images/battle/abilities/accurate_shot.png");
  }
  .battle-ability-effect--agression {
    background-image: url("/images/battle/abilities/agression.png");
  }
  .battle-ability-effect--arrow_crush {
    background-image: url("/images/battle/abilities/arrow_crush.png");
  }
  .battle-ability-effect--axe_blow {
    background-image: url("/images/battle/abilities/axe_blow.png");
  }
  .battle-ability-effect--axe_crush {
    background-image: url("/images/battle/abilities/axe_crush.png");
  }
  .battle-ability-effect--blade_vortex {
    background-image: url("/images/battle/abilities/blade_vortex.png");
  }
  .battle-ability-effect--crush_of_doom {
    background-image: url("/images/battle/abilities/crush_of_doom.png");
  }
  .battle-ability-effect--curse {
    background-image: url("/images/battle/abilities/curse.png");
  }
  .battle-ability-effect--dark_vortex {
    background-image: url("/images/battle/abilities/dark_vortex.png");
  }
  .battle-ability-effect--dash {
    background-image: url("/images/battle/abilities/dash.png");
  }
  .battle-ability-effect--death_shot {
    background-image: url("/images/battle/abilities/death_shot.png");
  }
  .battle-ability-effect--double_shot {
    background-image: url("/images/battle/abilities/double_shot.png");
  }
  .battle-ability-effect--dragon_bite {
    background-image: url("/images/battle/abilities/dragon_bite.png");
  }
  .battle-ability-effect--dragon_fury {
    background-image: url("/images/battle/abilities/dragon_fury.png");
  }
  .battle-ability-effect--energy_bolt {
    background-image: url("/images/battle/abilities/energy_bolt.png");
  }
  .battle-ability-effect--fatal_strike {
    background-image: url("/images/battle/abilities/fatal_strike.png");
  }
  .battle-ability-effect--fire_blade {
    background-image: url("/images/battle/abilities/fire_blade.png");
  }
  .battle-ability-effect--flame_strike {
    background-image: url("/images/battle/abilities/flame_strike.png");
  }
  .battle-ability-effect--flight {
    background-image: url("/images/battle/abilities/flight.png");
  }
  .battle-ability-effect--frost_blade {
    background-image: url("/images/battle/abilities/frost_blade.png");
  }
  .battle-ability-effect--frozen_abyss {
    background-image: url("/images/battle/abilities/frozen_abyss.png");
  }
  .battle-ability-effect--fury_claws {
    background-image: url("/images/battle/abilities/fury_claws.png");
  }
  .battle-ability-effect--group_heal {
    background-image: url("/images/battle/abilities/group_heal.png");
  }
  .battle-ability-effect--hamstring {
    background-image: url("/images/battle/abilities/hamstring.png");
  }
  .battle-ability-effect--heal {
    background-image: url("/images/battle/abilities/heal.png");
  }
  .battle-ability-effect--initiative {
    background-image: url("/images/battle/abilities/initiative.png");
  }
  .battle-ability-effect--heavy_arrow {
    background-image: url("/images/battle/abilities/heavy_arrow.png");
  }
  .battle-ability-effect--heavy_strike {
    background-image: url("/images/battle/abilities/heavy_strike.png");
  }
  .battle-ability-effect--holy_strike {
    background-image: url("/images/battle/abilities/holy_strike.png");
  }
  .battle-ability-effect--hummer_blow {
    background-image: url("/images/battle/abilities/hummer_blow.png");
  }
  .battle-ability-effect--hurricane {
    background-image: url("/images/battle/abilities/hurricane.png");
  }
  .battle-ability-effect--javelin_throw {
    background-image: url("/images/battle/abilities/javelin_throw.png");
  }
  .battle-ability-effect--kunai_strike {
    background-image: url("/images/battle/abilities/kunai_strike.png");
  }
  .battle-ability-effect--laziness {
    background-image: url("/images/battle/abilities/laziness.png");
  }
  .battle-ability-effect--lethal_shot {
    background-image: url("/images/battle/abilities/lethal_shot.png");
  }
  .battle-ability-effect--lethal_strike {
    background-image: url("/images/battle/abilities/lethal_strike.png");
  }
  .battle-ability-effect--might {
    background-image: url("/images/battle/abilities/might.png");
  }
  .battle-ability-effect--mortal_blow {
    background-image: url("/images/battle/abilities/mortal_blow.png");
  }
  .battle-ability-effect--power_shot {
    background-image: url("/images/battle/abilities/power_shot.png");
  }
  .battle-ability-effect--power_strike {
    background-image: url("/images/battle/abilities/power_strike.png");
  }
  .battle-ability-effect--rage {
    background-image: url("/images/battle/abilities/rage.png");
  }
  .battle-ability-effect--retribution {
    background-image: url("/images/battle/abilities/retribution.png");
  }
  .battle-ability-effect--rush {
    background-image: url("/images/battle/abilities/rush.png");
  }
  .battle-ability-effect--shield {
    background-image: url("/images/battle/abilities/shield.png");
  }
  .battle-ability-effect--shield_strike {
    background-image: url("/images/battle/abilities/shield_strike.png");
  }
  .battle-ability-effect--shield_stun {
    background-image: url("/images/battle/abilities/shield_stun.png");
  }
  .battle-ability-effect--shield_wall {
    background-image: url("/images/battle/abilities/shield_wall.png");
  }
  .battle-ability-effect--spear_strike {
    background-image: url("/images/battle/abilities/spear_strike.png");
  }
  .battle-ability-effect--strong_punch {
    background-image: url("/images/battle/abilities/strong_punch.png");
  }
  .battle-ability-effect--stun {
    background-image: url("/images/battle/abilities/stun.png");
  }
  .battle-ability-effect--stun_shot {
    background-image: url("/images/battle/abilities/stun_shot.png");
  }
  .battle-ability-effect--sword_crush {
    background-image: url("/images/battle/abilities/sword_crush.png");
  }
  .battle-ability-effect--teleportation {
    background-image: url("/images/battle/abilities/teleportation.png");
  }
  .battle-ability-effect--weakness {
    background-image: url("/images/battle/abilities/weakness.png");
  }
  .battle-ability-effect--wind_walk {
    background-image: url("/images/battle/abilities/wind_walk.png");
  }
  .battle-ability-effect--wolf_bite {
    background-image: url("/images/battle/abilities/wolf_bite.png");
  }
  .battle-ability-effect--zealot {
    background-image: url("/images/battle/abilities/zealot.png");
  }
  .battle-ability-effect--move {
    background-image: url("/images/battle/abilities/move.png");
  }
  .battle-ability-effect--attack {
    background-image: url("/images/battle/abilities/attack.png");
  }
  //
  .battle-effect--attack {
    background: url("/images/battle/effect/attack.png") 0% center / 50%
      no-repeat;
    & > div {
      transform: translateX(60%);
    }
  }
  .battle-effect--buff {
    background: url("/images/battle/effect/buff.png") center/70% no-repeat;
  }
  .battle-effect--de-buff {
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
