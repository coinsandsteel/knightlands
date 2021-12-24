<template>
  <div class="flex flex-center flex-space-between margin-bottom-1">
    <PerkIcon :perk="perkName" class="flex-1" />
    <span class="font-size-20 flex-7">{{
      $t(description, { n: duration })
    }}</span>
    <CustomButton type="green" width="20rem" @click="handleActivate">
      Activate
      <IconWithValue iconClass="icon-sb">
        {{ priceFormatted }}
      </IconWithValue>
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

export default {
  props: ["perkName", "price", "tier", "currency"],
  components: { CustomButton, PerkIcon, IconWithValue },
  computed: {
    ...mapState({
      perks: state => state.xmas.perks
    }),
    duration() {
      let perkData = this.perks[this.currency].tiers[this.tier][this.perkName];
      let duration = getMainTowerPerkValue(
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
