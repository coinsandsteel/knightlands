<template>
  <div class="building font-size-25">
    <div class="bg"></div>
    <div class="img relative flex flex-column">
      <div class="tower-bg full-flex"></div>
      <ProgressWithLevel
        :level="tower.level"
        :value="tower.currentLevelPercent"
      ></ProgressWithLevel>
    </div>

    <slot v-if="perksVisible"></slot>

    <template v-else>
      <div class="row1 flex flex-center flex-space-between relative">
        <div class="label-bg width-45 flex flex-center ">
          <IconWithValue :inline="false" iconClass="icon-sb">{{
            balanceFormatted.santa_bucks
          }}</IconWithValue>
        </div>

        <div class="label-bg flex flex-center width-45">
          <IconWithValue :inline="false" iconClass="icon-cp">{{
            balanceFormatted.christmas_points
          }}</IconWithValue>
        </div>
      </div>

      <div
        class="row2 flex flex-items-center flex-start"
        v-if="mode != 'collect'"
      >
        <CustomButton type="green" @click="togglePerks"
          >Upgrade Perks</CustomButton
        >
      </div>
      <div class="row2 flex flex-items-center flex-start" v-else>
        <CustomButton type="green" class="btn" @click="showActivePerks"
          >Activate Perk</CustomButton
        >
      </div>

      <NewMultipliers class="row3" v-if="mode != 'collect'" />
    </template>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import { mapState } from "vuex";
import { create } from "vue-modal-dialogs";

import { abbreviateNumber } from "../../../../knightlands-shared/xmas";
import ProgressWithLevel from "./ProgressWithLevel.vue";
import NewMultipliers from "./NewMultipliers.vue";
import ActivatePerks from "./ActivatePerks.vue";

const ShowActivePerks = create(ActivatePerks);

export default {
  props: ["tier"],
  components: {
    ProgressWithLevel,
    IconWithValue,
    CustomButton,
    NewMultipliers
  },
  data: () => ({}),
  computed: {
    expirienceValueFormatted() {
      return abbreviateNumber(this.tower.exp);
    },
    ...mapState({
      mode: state => state.xmas.mode,
      tower: state => state.xmas.tower,
      balance: state => state.xmas.balance,
      perksVisible: state => state.xmas.flags.perks
    }),
    balanceFormatted() {
      let formattedBalance = {};
      for (let key in this.balance) {
        formattedBalance[key] = abbreviateNumber(this.balance[key]);
      }
      return formattedBalance;
    }
  },
  methods: {
    togglePerks() {
      this.$store.dispatch("xmas/toggleFlag", "perks");
    },
    showActivePerks() {
      ShowActivePerks();
    }
  }
};
</script>

<style lang="less" scoped>
.building {
  position: relative;
  padding: 0 3rem;
  padding-bottom: 3rem;
  width: 100%;
  height: 23rem;
  display: grid;
  column-gap: 2rem;
  grid-template-columns: 3fr 5fr;
  grid-template-rows: 1fr 1fr 1fr;
  justify-items: stretch;

  & .img {
    grid-row: ~"1/4";
    grid-column: 1;

    & .tower-bg {
      background-image: url("../../assets/xmas/buildings/building_base.png");
      background-repeat: no-repeat;
      background-size: contain;
    }
  }

  & .row1 {
    grid-row: 1;
    grid-column: 2;
  }

  & .row2 {
    grid-row: 2;
    grid-column: 2;
  }

  & .row3 {
    grid-row: 3;
    grid-column: 2;
  }
}

.label-bg {
  border-image: url("../../assets/xmas/text_input_blue.png");
  border-image-slice: 27 27 27 27 fill;
  border-image-width: 14px;
  border-image-outset: 0px 0px 0px 0px;
  border-image-repeat: stretch stretch;
  padding: 1rem;
}

.bg {
  background-image: url("../../assets/xmas/dashboard_bg.png");
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
}

.tower-bg {
  background-image: url("../../assets/xmas/buildings/building_base.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
</style>
