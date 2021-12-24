<template>
  <UserDialog @close="$close(true)" title="Activate perk">
    <template v-slot:content>
      <div class="flex flex-column">
        <div v-for="currency in Object.keys(nonEmptyBranches)" :key="currency">
          <h2 class="font-size-25">
            <IconWithValue :iconClass="iconClass(currency)">
              {{ $t(currency) }}
            </IconWithValue>
          </h2>

          <div
            v-for="tier in Object.keys(nonEmptyBranches[currency])"
            :key="'tier_' + tier"
          >
            <h3 v-if="tier != 'all'" class="font-size-25">Tier {{ tier }}</h3>
            <ActivatePerkElement
              v-for="perkName in Object.keys(nonEmptyBranches[currency][tier])"
              :key="perkName"
              :perkName="perkName"
              :price="nonEmptyBranches[currency][tier][perkName].price"
              :tier="tier"
              :currency="currency"
            />
          </div>
        </div>

        <div
          class="flex flex-column flex-center"
          v-if="Object.keys(nonEmptyBranches).length == 0"
        >
          <span class="font-size-22 font-weight-900 flex-self-center"
            >No active perks yet</span
          >

          <CustomButton type="yellow" class="margin-top-2" @click="goToPerkList"
            >Upgrade Perks</CustomButton
          >
        </div>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import { mapState } from "vuex";
import UserDialog from "@/components/UserDialog.vue";
import CustomButton from "@/components/Button.vue";
import {
  CURRENCY_SANTABUCKS,
  CURRENCY_GOLD,
  CURRENCY_CHRISTMAS_POINTS,
  CURRENCY_UNIT_ESSENCE,
  CURRENCY_SHINIES,
  TOWER_PERK_BOOST,
  TOWER_PERK_SUPER_BOOST,
  TOWER_PERK_SPEED,
  TOWER_PERK_SUPER_SPEED,
  TOWER_PERK_PRESENT,
  TOWER_PERK_SLEEP
} from "@/../../knightlands-shared/xmas";
import ActivatePerkElement from "./ActivatePerkElement.vue";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  components: {
    CustomButton,
    UserDialog,
    ActivatePerkElement,
    IconWithValue
  },
  computed: {
    nonEmptyBranches() {
      let branches = {};
      for (let currency in this.perks) {
        for (let tier in this.perks[currency].tiers) {
          for (let perkName in this.perks[currency].tiers[tier]) {
            if (
              ![
                TOWER_PERK_BOOST,
                TOWER_PERK_SUPER_BOOST,
                TOWER_PERK_SPEED,
                TOWER_PERK_SUPER_SPEED
              ].includes(perkName)
            ) {
              continue;
            }

            let perkData = this.perks[currency].tiers[tier][perkName];
            if (perkData.level > 0) {
              if (!branches[currency]) {
                branches[currency] = {};
              }
              if (!branches[currency][tier]) {
                branches[currency][tier] = {};
              }
              branches[currency][tier][perkName] = perkData;
            }
          }
        }
      }
      return branches;
    },
    ...mapState({
      perks: state => state.xmas.perks
    })
  },
  methods: {
    goToPerkList() {
      this.$store.dispatch("xmas/toggleFlag", "perks");
      this.$close();
    },
    iconClass(currency) {
      switch (currency) {
        case CURRENCY_GOLD:
          return "icon-gold";
        case CURRENCY_SHINIES:
          return "icon-premium";
        case CURRENCY_SANTABUCKS:
          return "icon-sb";
        case CURRENCY_UNIT_ESSENCE:
          return "unit-essence";
        case CURRENCY_CHRISTMAS_POINTS:
          return "icon-cp";
      }
      return "";
    }
  }
};
</script>
