<template>
  <div class="flex flex-center flex-space-between margin-bottom-1">
    <PerkIcon :perk="perkName" class="flex-1" />
    <span class="font-size-20 flex-7">{{
      $t(description, { n: duration })
    }}</span>
    <CustomButton
      type="green"
      width="20rem"
      @click="handleActivate"
      v-if="timer.timeLeft <= 0"
    >
      Activate
      <IconWithValue iconClass="icon-sb">
        {{ priceFormatted }}
      </IconWithValue>
    </CustomButton>

    <CustomButton
      fontClass="font-size-18"
      type="yellow"
      width="20rem"
      v-else-if="active"
    >
      Active {{ activeCooldown.value }}
    </CustomButton>

    <CustomButton fontClass="font-size-18" type="grey" width="20rem" v-else>
      {{ timer.value }}
    </CustomButton>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  abbreviateNumber,
  getMainTowerPerkValue
} from "../../../../knightlands-shared/xmas";
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import PerkIcon from "./PerkIcon.vue";
import timer from "@/timer";

export default {
  props: ["perkName", "price", "tier", "currency"],
  components: { CustomButton, PerkIcon, IconWithValue },
  data: () => ({
    timer: new timer(true),
    activeCooldown: new timer(false)
  }),
  mounted() {
    this.updateCooldownTimer();
  },
  watch: {
    perkData: {
      deep: true,
      handler() {
        this.updateCooldownTimer();
      }
    }
  },
  computed: {
    ...mapState({
      perks: state => state.xmas.perks
    }),
    active() {
      return this.perkData.active;
    },
    perkData() {
      return this.perks[this.currency].tiers[this.tier][this.perkName];
    },
    duration() {
      const perkData = this.perkData;

      const duration = getMainTowerPerkValue(
        this.tier,
        this.perkName,
        perkData ? perkData.level : 0,
        this.currency
      );
      return Math.floor(duration);
    },
    priceFormatted() {
      return abbreviateNumber(this.price);
    },
    description() {
      return `d-${this.perkName}`;
    }
  },
  methods: {
    updateCooldownTimer() {
      const perkData = this.perkData;
      if (perkData && perkData.lastActivated) {
        this.timer.timeLeft =
          3600 - (this.$game.now - perkData.lastActivated) / 1000;
      }

      if (perkData && this.active) {
        this.activeCooldown.timeLeft =
          this.duration - (this.$game.now - perkData.lastActivated) / 1000;
      }
    },
    async handleActivate() {
      this.$store.dispatch("xmas/activatePerk", {
        currency: this.currency,
        tier: this.tier,
        perkName: this.perkName
      });
    }
  }
};
</script>
