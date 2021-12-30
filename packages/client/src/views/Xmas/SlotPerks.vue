<template>
  <UserDialog @close="$close(true)" title="Upgrade perk">
    <template v-slot:content>
      <div class="width-100 flex flex-column flex-center">
        <div class="font-size-22 margin-bottom-2">
          Upgrade perks for this farm:
        </div>

        <div class="width-90">
          <div
            class="flex flex-start flex-justify-center margin-bottom-1"
            v-for="(level, perkName) in perks"
            :key="'wrapper_slot_perk_' + perkName"
          >
            <NumericValue
              class="margin-right-1"
              :id="'slot_perk_' + perkName"
              :showMax="true"
              :noExtra="true"
              :rowStyle="{ 'align-items': 'center' }"
              :btnStyle="{ width: '1em', height: '1em' }"
              :value="getStatValue(tier, perkName)"
              :maxValue="freePerkPoints"
              :decreaseCondition="canDecrease(tier, perkName)"
              :increaseCondition="canIncrease"
              @inc="increaseAttribute(tier, perkName)"
              @dec="decreaseAttribute(tier, perkName)"
              @reset="reset(tier, perkName)"
            />

            <PerkIcon
              class="margin-right-2"
              :key="'slot_perk_' + perkName"
              :perk="perkName"
              :level="level"
              :locked="false"
            />

            <span class="font-size-20">{{
              $t(`d-${perkName}`, { n: newPerks[perkName] })
            }}</span>
          </div>
        </div>

        <div class="flex flex-center margin-top-4">
          <CustomButton type="red" @click="$close(false)">{{
            $t("btn-cancel")
          }}</CustomButton>
          <CustomButton
            type="green"
            :disabled="!perksModified"
            @click="confirmPerks"
            >{{ $t("btn-confirm") }}</CustomButton
          >
        </div>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import PerkIcon from "./PerkIcon.vue";
import UserDialog from "@/components/UserDialog.vue";
import NumericValue from "@/components/NumericValue.vue";
import CustomButton from "@/components/Button.vue";

export default {
  components: {
    PerkIcon,
    UserDialog,
    NumericValue,
    CustomButton
  },
  props: ["tier"],
  data: () => ({
    newPerks: {}
  }),
  created() {
    this.init();
  },
  computed: {
    perks() {
      return this.slots[this.tier].slotPerks;
    },
    slot() {
      return this.slots[this.tier];
    },
    slotPerks() {
      return this.slot.slotPerks;
    },
    newPerksSum() {
      let sum = Object.values(this.newPerks).reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0
      );
      return sum;
    },
    perksSum() {
      let sum = Object.values(this.slotPerks).reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0
      );
      return sum;
    },
    perksModified() {
      for (let perkName in this.slotPerks) {
        if (this.newPerks[perkName] !== this.slotPerks[perkName]) {
          return true;
        }
      }
      return false;
    },
    currentLevel() {
      return this.slotPerks[this.perkName];
    },
    freePerkPoints() {
      return Math.floor(this.slot.level / 25) - this.perksSum;
    },
    canIncrease() {
      return this.newPerksSum - this.perksSum < this.freePerkPoints;
    },
    ...mapState({
      slots: state => state.xmas.slots
    })
  },
  methods: {
    init() {
      let perksClone = _.cloneDeep(this.slotPerks);
      for (let perkName in perksClone) {
        this.$set(this.newPerks, perkName, perksClone[perkName]);
      }
    },
    getStatValue(tier, perkName) {
      return this.newPerks[perkName];
    },
    canDecrease(tier, perkName) {
      return this.newPerks[perkName] > this.perks[perkName];
    },
    increaseAttribute(tier, perkName) {
      this.newPerks[perkName]++;
      return true;
    },
    decreaseAttribute(tier, perkName) {
      this.newPerks[perkName]--;
      return true;
    },
    async confirmPerks() {
      await this.$store.dispatch("xmas/commitSlotPerks", {
        slotPerks: this.newPerks,
        tier: this.tier
      });
      if (!this.freePerkPoints) {
        this.$close(true);
      }
    },
    reset(tier, perkName) {
      while (this.canDecrease(tier, perkName)) {
        this.decreaseAttribute(tier, perkName);
      }
    }
  }
};
</script>

<style lang="less" scoped>
// .perks-port {
//   position: absolute;
//   top: 0;
//   z-index: 75;
//   background: rgb(49, 49, 49);
//   color: white;
// }
.perks-wrap {
  padding-top: 0;
}
.currency-wrap {
  margin-bottom: 7rem;
  text-align: center;
}
.perk-item,
.currency-item {
  margin-bottom: 1rem;
  padding: 2rem 0;
}
.perk-item {
  background: rgb(90, 103, 116);
  padding: 1rem;
}
.currency-item {
  background: seagreen;
  padding: 2rem 0;
}
.tier-item {
  background: hotpink;
  padding: 1rem 0;
}
.lvl {
  font-weight: 600;
}
.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
}
.state-locked .tier-wrap {
  opacity: 0.35;
}

.label-bg {
  border-image: url("../../assets/xmas/text_input_blue.png");
  border-image-slice: 27 27 27 27 fill;
  border-image-width: 14px;
  border-image-outset: 0px 0px 0px 0px;
  border-image-repeat: stretch stretch;
  padding: 1rem;
}

& .row13 {
  grid-row: ~"1/4";
  grid-column: 2;
}
</style>
