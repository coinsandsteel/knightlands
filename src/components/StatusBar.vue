<template>
  <div class="flex status-bar flex-no-wrap flex-space-between">
    <div class="flex flex-center flex-column column">
      <progress-bar
        ref="health"
        :maxValue="maxHealth"
        height="inherit"
        iconClass="icon-health"
        :hideMaxValue="false"
        :timer="healthTimer"
        plusButton="grey"
        v-model="health"
        class="flex-full"
      ></progress-bar>

      <progress-bar
        ref="exp"
        :maxValue="nextExperience()"
        :percentMode="true"
        height="inherit"
        iconClass="icon-exp"
        :hideMaxValue="false"
        v-model="exp"
        barType="grey"
        class="flex-full"
      ></progress-bar>
    </div>

    <div class="flex flex-center flex-column column">
      <progress-bar
        ref="energy"
        :maxValue="maxEnergy"
        v-model="energy"
        height="inherit"
        iconClass="icon-energy"
        :hideMaxValue="false"
        :timer="energyTimer"
        barType="blue"
        plusButton="grey"
        class="flex-full"
      ></progress-bar>

      <progress-bar
        ref="stamina"
        :maxValue="maxStamina"
        v-model="stamina"
        height="inherit"
        iconClass="icon-stamina"
        :hideMaxValue="false"
        :timer="staminaTimer"
        plusButton="grey"
        barType="yellow"
        class="flex-full"
      ></progress-bar>
    </div>

    <div class="flex flex-column column">
      <div class="flex flex-no-wrap flex-item-center">
        <div class="icon-gold"></div>
        <span class="status-bar-font digit-font">{{softCurrency}}</span>
      </div>

      <div class="flex flex-no-wrap flex-item-center">
        <div class="icon-premium"></div>
        <span class="status-bar-font digit-font">{{hardCurrency}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from "./ProgressBar.vue";
import CharacterStats from "@/../knightlands-shared/character_stat.js";

export default {
  data() {
    return {
      maxStats: this.$game.character.maxStats,
      timers: this.$game.character.timers,
      energyTimer: this.$game.character.timers[CharacterStats.Energy],
      staminaTimer: this.$game.character.timers[CharacterStats.Stamina],
      healthTimer: this.$game.character.timers[CharacterStats.Health]
    };
  },
  components: {
    ProgressBar
  },
  computed: {
    maxHealth() {
      return this.maxStats[CharacterStats.Health];
    },
    health() {
      return this.timers[CharacterStats.Health].value;
    },
    exp() {
      return this.$game.character.exp;
    },
    energy() {
      return this.timers[CharacterStats.Energy].value;
    },
    maxEnergy() {
      return this.maxStats[CharacterStats.Energy];
    },
    stamina() {
      return this.timers[CharacterStats.Stamina].value;
    },
    maxStamina() {
      return this.maxStats[CharacterStats.Stamina];
    },
    softCurrency() {
      return this.$game.softCurrency;
    },
    hardCurrency() {
      return this.$game.hardCurrency;
    }
  },
  methods: {
    nextExperience() {
      return this.$game.getRequiredExperience(this.$game.character.level);
    },
    now() {
      return Math.floor(new Date().getTime() / 1000);
    }
  }
};
</script>

<style lang="less" scoped>
.status-bar {
  height: 7rem;
  background-color: #333e52;
  border-bottom: 0.25rem solid #928690;
  padding-left: 1rem;
}

.column {
  flex-wrap: nowrap;
  flex-basis: 30%;
  align-items: flex-start;

  padding-top: 1rem;
  padding-bottom: 1rem;

  > :first-child {
    margin-bottom: 1rem;
  }
}
</style>


