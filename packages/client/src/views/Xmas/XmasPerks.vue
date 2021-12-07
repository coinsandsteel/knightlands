<template>
  <div ref="port" class="perks-port relative width-100 height-100">
    <div
      class="stat-commit flex flex-center width-100 margin-top-2 margin-bottom-2 flex-evenly-spaced margin-bottom-3"
    >
      <CustomButton
        :disabled="!rebalanceAllowed"
        type="blue"
        @click="rebalancePerks"
      >
        {{ $t("rebalance") }}
        <IconWithValue iconClass="h-gold" valueClass="font-size-18">{{
          40
        }}</IconWithValue>
      </CustomButton>
      <CustomButton v-show="perksModified" @click="resetPerks">{{
        $t("btn-reset")
      }}</CustomButton>
      <CustomButton
        v-show="perksModified"
        type="green"
        @click="confirmPerks"
        id="apply-btn"
        >{{ $t("btn-apply") }}</CustomButton
      >
      <a class="close-btn" @click.prevent="back"></a>
    </div>
    <div class="height-100" v-bar>
      <div class="perks-wrap padding-5 font-size-25">
        <div
          class="currency-wrap"
          v-for="(perks, currencyName) in perks"
          :key="currencyName"
        >
          <div class="currency-item">
            <strong>{{ currencyName }}</strong>
          </div>
          <div
            class="perk-item flex"
            v-for="(perkData, perkName) in perks"
            :key="perkName"
          >
            <NumericValue
              v-if="upgradeAllowed"
              :id="'perk_' + currencyName + '_' + perkName"
              :showMax="true"
              :noExtra="true"
              :rowStyle="{ 'align-items': 'center' }"
              :btnStyle="{ width: '1em', height: '1em' }"
              :value="getStatValue(currencyName, perkName)"
              :maxValue="getMaxStatValue(currencyName, perkName)"
              :decreaseCondition="canDecrease(currencyName, perkName)"
              :increaseCondition="canIncrease"
              @inc="increaseAttribute(currencyName, perkName)"
              @dec="decreaseAttribute(currencyName, perkName)"
              @reset="reset(currencyName, perkName)"
            />
            &nbsp;lvl&nbsp;{{ perkData.level }}&nbsp;<strong>{{
              perkName
            }}</strong>
          </div>
        </div>
      </div>
    </div>
    <div class="font-size-25" @click="back">Close</div>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import CustomButton from "@/components/Button.vue";
import NumericValue from "@/components/NumericValue.vue";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  mixins: [],
  components: {
    CustomButton,
    NumericValue,
    IconWithValue
  },
  watch: {
    perks: {
      deep: true,
      immediate: true,
      handler() {
        this.init();
      }
    }
  },
  data: () => ({
    newPerks: {}
  }),
  methods: {
    back() {
      this.$store.dispatch("xmas/toggleFlag", "perks");
    },
    init() {
      let perksClone = _.cloneDeep(this.perks);
      for (let currencyName in perksClone) {
        if (_.isUndefined(this.newPerks[currencyName])) {
          this.$set(this.newPerks, currencyName, {});
        }
        for (let perkName in perksClone[currencyName]) {
          this.$set(
            this.newPerks[currencyName],
            perkName,
            perksClone[currencyName][perkName]
          );
        }
      }
    },
    getStatValue(currencyName, perkName) {
      return this.newPerks[currencyName][perkName].level;
    },
    getMaxStatValue() {
      return this.tower.level - 1 - this.newPerksSum;
    },
    canDecrease(currencyName, perkName) {
      return (
        this.newPerks[currencyName][perkName].level >
        this.perks[currencyName][perkName].level
      );
    },
    increaseAttribute(currencyName, perkName) {
      this.newPerks[currencyName][perkName].level++;
      return true;
    },
    decreaseAttribute(currencyName, perkName) {
      this.newPerks[currencyName][perkName].level--;
      return true;
    },
    confirmPerks() {
      this.$store.dispatch("xmas/commitPerks", this.newPerks);
    },
    reset(currencyName, perkName) {
      while (this.canDecrease(currencyName, perkName)) {
        this.decreaseAttribute(currencyName, perkName);
      }
    },
    resetPerks() {
      let perksClone = _.cloneDeep(this.perks);
      for (let currencyName in this.newPerks) {
        for (let perkName in this.newPerks[currencyName]) {
          this.newPerks[currencyName][perkName].level =
            perksClone[currencyName][perkName].level;
        }
      }
    },
    async rebalancePerks() {
      // Modal
      const result = await this.showPrompt(
        "Rebalance all perks",
        "Are you sure you want to rebalance all the tower perks?",
        [
          {
            type: "red",
            title: this.$t("btn-cancel"),
            response: false
          },
          {
            type: "green",
            title: this.$t("btn-ok"),
            response: true
          }
        ]
      );

      if (!result) {
        return;
      }

      let newPerks = _.cloneDeep(this.perks);
      for (let currencyName in newPerks) {
        for (let perkName in newPerks[currencyName]) {
          newPerks[currencyName][perkName].level = 0;
        }
      }
      this.$store.dispatch("xmas/commitPerks", newPerks);
    }
  },
  computed: {
    newPerksSum() {
      let sum = 0;
      for (let currencyName in this.newPerks) {
        sum += _.sum(
          _.map(Object.values(this.newPerks[currencyName]), "level")
        );
      }
      return sum;
    },
    perksSum() {
      let sum = 0;
      for (let currencyName in this.perks) {
        sum += _.sum(_.map(Object.values(this.perks[currencyName]), "level"));
      }
      return sum;
    },
    perksModified() {
      for (let currencyName in this.newPerks) {
        for (let perkName in this.newPerks[currencyName]) {
          if (
            this.newPerks[currencyName][perkName].level !==
            this.perks[currencyName][perkName].level
          ) {
            return true;
          }
        }
      }
      return false;
    },
    canIncrease() {
      return this.newPerksSum < this.tower.level - 1;
    },
    upgradeAllowed() {
      return this.perksSum < this.tower.level - 1;
    },
    rebalanceAllowed() {
      return this.perksSum > 0;
    },
    ...mapState({
      tower: state => state.xmas.tower,
      perks: state => state.xmas.perks
    })
  }
};
</script>

<style lang="less" scoped>
.perks-port {
  position: absolute;
  top: 0;
  z-index: 75;
  background: rgb(49, 49, 49);
  color: white;
}
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
  padding: 1rem 0;
}
.currency-item {
  background: seagreen;
  padding: 2rem 0;
}
.lvl {
  font-weight: 600;
}
.close-btn {
  position: absolute;
  top: 2.5rem;
  right: 2.5rem;
}
</style>
