<template>
  <div class="flex status-bar flex-no-wrap flex-space-between">
    <div class="flex flex-center flex-column column">
      <progress-bar
        ref="health"
        :maxValue="maxHealth"
        iconClass="icon-health"
        :hideMaxValue="true"
        :timer="healthTimer"
        plusButton="grey"
        v-model="health"
        class="flex-full pointer"
        @refill="refillTimer(characterStats.Health)"
      ></progress-bar>

      <progress-bar
        ref="exp"
        :maxValue="nextExperience()"
        :percentMode="true"
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
        iconClass="icon-energy"
        :hideMaxValue="false"
        :timer="energyTimer"
        barType="blue"
        plusButton="grey"
        class="flex-full pointer"
        @refill="refillTimer(characterStats.Energy)"
      ></progress-bar>

      <progress-bar
        ref="stamina"
        :maxValue="maxStamina"
        v-model="stamina"
        iconClass="icon-stamina"
        :hideMaxValue="false"
        :timer="staminaTimer"
        plusButton="grey"
        barType="yellow"
        class="flex-full pointer"
        @refill="refillTimer(characterStats.Stamina)"
      ></progress-bar>
    </div>

    <div class="flex flex-column column" ref="softCurrency">
      <div class="flex flex-no-wrap flex-item-center">
        <div class="icon-gold"></div>
        <span class="status-bar-font">{{ softCurrency }}</span>
      </div>

      <div class="flex flex-no-wrap flex-item-center" ref="hardCurrency">
        <div class="icon-premium"></div>
        <span class="status-bar-font">{{ hardCurrency }}</span>
      </div>
    </div>

    <portal to="overlay" ref="portal"></portal>
  </div>
</template>

<script>
import UI from "@/ui_constants";
import ProgressBar from "./ProgressBar.vue";
import CharacterStats from "@/../../knightlands-shared/character_stat.js";
import TimerRefill from "@/views/TimerRefill/TimerRefillNew.vue";
import AttractorMixin from "@/components/AttractorMixin.vue";
import Vue from "vue";
import AttractableResource from "@/components/AttractableResource.vue";
import { create as CreateDialog } from "vue-modal-dialogs";

const TimerRefillModal = CreateDialog(TimerRefill, "stat");
const RESOURCE_NOT_DELAYED = -1;

export default {
  mixins: [AttractorMixin],
  data() {
    return {
      characterStats: CharacterStats,
      maxStats: this.$game.character.maxStats,
      timers: this.$game.character.timers,
      energyTimer: this.$game.character.timers[CharacterStats.Energy],
      staminaTimer: this.$game.character.timers[CharacterStats.Stamina],
      healthTimer: this.$game.character.timers[CharacterStats.Health],
      delayedResources: {
        health: RESOURCE_NOT_DELAYED,
        stamina: RESOURCE_NOT_DELAYED,
        energy: RESOURCE_NOT_DELAYED,
        softCurrency: RESOURCE_NOT_DELAYED,
        hardCurrency: RESOURCE_NOT_DELAYED,
        exp: RESOURCE_NOT_DELAYED
      }
    };
  },
  components: {
    ProgressBar
  },
  created() {
    this._refillCb = this.refillTimer.bind(this);
  },
  mounted() {
    this.$game.on("refill", this._refillCb);
  },
  destroyed() {
    this.$game.off("refill", this._refillCb);
  },
  computed: {
    maxHealth() {
      return this.maxStats[CharacterStats.Health];
    },
    health() {
      return this.getDelayedResourceValue(
        "health",
        this.timers[CharacterStats.Health].value
      );
    },
    exp() {
      return this.getDelayedResourceValue("exp", this.$game.character.exp);
    },
    energy() {
      return this.getDelayedResourceValue(
        "energy",
        this.timers[CharacterStats.Energy].value
      );
    },
    maxEnergy() {
      return this.maxStats[CharacterStats.Energy];
    },
    stamina() {
      return this.getDelayedResourceValue(
        "stamina",
        this.timers[CharacterStats.Stamina].value
      );
    },
    maxStamina() {
      return this.maxStats[CharacterStats.Stamina];
    },
    softCurrency() {
      return this.getDelayedResourceValue(
        "softCurrency",
        this.$game.softCurrency
      );
    },
    hardCurrency() {
      return this.getDelayedResourceValue(
        "hardCurrency",
        this.$game.hardCurrency
      );
    }
  },
  methods: {
    getDelayedResourceValue(resourceName, recentValue) {
      if (this.delayedResources[resourceName] != RESOURCE_NOT_DELAYED) {
        return this.delayedResources[resourceName];
      }
      return recentValue;
    },
    nextExperience() {
      return this.$game.getRequiredExperience(this.$game.character.level);
    },
    now() {
      return Math.floor(new Date().getTime() / 1000);
    },
    async refillTimer(stat) {
      await TimerRefillModal(stat);
    },
    setDelayResourceUpdate(delay) {
      for (const resourceName in this.delayedResources) {
        this.delayedResources[resourceName] = delay
          ? this[resourceName]
          : RESOURCE_NOT_DELAYED;
      }
    },
    async showResourceGained(resourceName, at, resourceValue, container) {
      const component = Vue.extend(AttractableResource);
      const instance = new component({
        propsData: {
          value: resourceValue,
          resourceName: resourceName
        }
      });
      instance.$mount();
      await this.attractToResource(
        instance,
        resourceName,
        at,
        resourceValue,
        container
      );
    },
    async attractToResource(
      instance,
      resourceName,
      at,
      resourceValue,
      container
    ) {
      let el = this.$refs[resourceName].$el;
      if (!el) {
        el = this.$refs[resourceName];
      }
      const offset = UI.offset(el);
      const to = {
        x: offset.left,
        y: offset.top + offset.height / 2
      };
      await this.attract(instance, at, to, container);
      if (!isNaN(+resourceValue)) {
        this.delayedResources[resourceName] += resourceValue;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.status-bar {
  height: 7rem;
  background-color: #23354d;
  padding-left: 1rem;
}

.column {
  flex-wrap: nowrap;
  flex-basis: 30%;
  align-items: flex-start;
  justify-content: space-evenly;
}
</style>
