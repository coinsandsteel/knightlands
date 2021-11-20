<template>
  <div class="screen-content flex-items-center full-flex relative">
    <div class="hallowen-bg"></div>
    <Title class="enemy-title-font margin-top-1 margin-bottom-1 font-outline">
      {{ $t("depth", { val: maze.floor }) }}
    </Title>

    <div class="flex flex-center panel-input padding-1" v-if="!$app.isProd">
      <CustomButton type="yellow" @click="resetDungeon"
        >Reset dungeon</CustomButton
      >
      <CustomButton @click="resetProgress">Reset progress</CustomButton>
      <CustomButton @click="sendTestAction('energy')"
        >Add 10 energy</CustomButton
      >
      <CustomButton @click="nextFloor" v-if="!maze.enemiesLeft" type="yellow"
        >Next floor</CustomButton
      >
    </div>

    <div class="width-100 margin-bottom-2 stat-panel">
      <ProgressBar
        :value="user.health"
        :maxValue="playerStats(null).maxHealth"
        height="4px"
        width="90%"
        valuePosition="top"
        barType="red"
        valueClass="white-font font-outline font-size-20"
      >
        <template v-slot:label><span class="icon-health"></span></template>
        <template v-slot:after-label
          ><span class="margin-left-1">{{
            $t("h-reg", { v: healthRegen })
          }}</span></template
        >
      </ProgressBar>

      <ProgressBar
        :value="maze.enemiesLeft"
        :maxValue="maze.totalEnemies"
        height="4px"
        width="90%"
        valuePosition="top"
        :hideMaxValue="true"
        barType="yellow"
        valueClass="white-font font-outline font-size-20"
      >
        <template v-slot:label><span>Enemies left:</span></template>
      </ProgressBar>

      <ProgressBar
        id="energy"
        :value="user.energy"
        :maxValue="playerStats(null).maxEnergy"
        height="4px"
        width="90%"
        valuePosition="top"
        barType="green-h"
        valueClass="white-font font-outline font-size-20"
      >
        <template v-slot:label><span class="h-energy"></span></template>
        <template v-slot:after-label
          ><span class="margin-left-1">{{
            $t("h-reg", { v: energyRegen })
          }}</span></template
        >
      </ProgressBar>

      <ProgressBar
        :value="user.exp"
        :maxValue="nextExp"
        height="4px"
        width="90%"
        valuePosition="top"
        barType="grey"
        valueClass="white-font font-outline font-size-20"
      >
        <template v-slot:label><span class="icon-exp"></span></template>
      </ProgressBar>

      <div class="flex flex-center btns">
        <CustomButton type="blue" @click="goToUser">
          <span class="icon-user"></span>
        </CustomButton>
        <CustomButton
          type="grey"
          @click="usePotion"
          :disabled="user.potion <= 0"
        >
          <IconWithValue iconClass="hpotion big">{{
            user.potion
          }}</IconWithValue>
        </CustomButton>
        <CustomButton
          type="grey"
          @click="useScroll"
          :disabled="user.scroll <= 0"
          ><IconWithValue iconClass="hscroll big">{{
            user.scroll
          }}</IconWithValue></CustomButton
        >
        <CustomButton type="grey" :disabled="true"
          ><IconWithValue iconClass="hkey big">{{
            user.key
          }}</IconWithValue></CustomButton
        >
      </div>
    </div>
    <Maze ref="maze" />
    <div
      class="overlay-color absolute-stretch flex flex-column flex-center"
      v-if="isFinished"
    >
      <span class="font-size-22"
        >Halloween dungeon is closed! Thank you for participating!</span
      >
      <CustomButton
        type="yellow"
        class="margin-top-2"
        @click="claimReward"
        v-if="hasReward && !claimed"
      >
        <div class="flex flex-center">
          <span>Claim</span>
          <IconWithValue iconClass="icon-usdc">{{ reward }}</IconWithValue>
        </div>
      </CustomButton>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import Maze from "./MazeView.vue";
import AppSection from "@/AppSection.vue";
import Title from "@/components/Title.vue";
import UiConstants from "@/ui_constants";
import ProgressBar from "@/components/ProgressBar.vue";
import anime from "animejs/lib/anime.es.js";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import meta from "@/metadata/halloween/dungeon_meta";
import Blockchains from "@/../../knightlands-shared/blockchains";

import ConnectWallet from "@/views/Account/ConnectWallet.vue";
import { create } from "vue-modal-dialogs";
const ShowWallet = create(ConnectWallet, "chain");

export default {
  mixins: [AppSection, NetworkRequestErrorMixin, PromptMixin],
  components: {
    Maze,
    Title,
    ProgressBar,
    CustomButton,
    IconWithValue
  },
  data: () => ({
    thresholds: UiConstants.progressThresholds
  }),
  activated() {
    this.$store.dispatch("dungeon/redirectToActiveCombat");
  },
  created() {
    this.title = "w-simple-dun";
    this.$options.useRouterBack = true;
    this.$app.$on("shake-energy", this.shakeEnergy);
  },
  destroyed() {
    this.$app.$off("shake-energy");
  },
  computed: {
    ...mapState({
      maze: state => state.dungeon.maze,
      user: state => state.dungeon.user,
      combat: state => state.dungeon.combat
    }),
    ...mapGetters({
      playerStats: "dungeon/playerStats",
      nextExp: "dungeon/nextExp",
      isFinished: "dungeon/isFinished"
    }),
    energyRegen() {
      const playerStats = this.playerStats(null);
      return Math.floor(3600 / playerStats.energyRegen);
    },
    healthRegen() {
      const playerStats = this.playerStats(null);
      return Math.floor(3600 / playerStats.hpRegen);
    }
  },
  asyncComputed: {
    async rank() {
      const currentRank = await this.performRequest(
        this.$store.dispatch("dungeon/fetchRank")
      );

      return currentRank;
    },
    async hasReward() {
      let rank = await this.rank;
      if (!rank) {
        return false;
      }

      rank = rank.rank;
      if (!rank) {
        return false;
      }

      if (rank - 1 >= meta.rewards.length) {
        return false;
      }

      return true;
    },
    async reward() {
      if (await this.hasReward) {
        const rank = await this.rank;
        if (!rank) {
          return 0;
        }
        return meta.rewards[rank.rank - 1];
      }

      return 0;
    },
    async claimed() {
      let rank = await this.rank;
      if (!rank) {
        return false;
      }
      return rank.claimed;
    }
  },
  methods: {
    async claimReward() {
      const { address } = await ShowWallet(Blockchains.Ethereum);
      const txDetails = await this.performRequest(
        this.$store.dispatch("dungeon/claimReward", address)
      );
      await this.$game.blockchain.withdrawUSDCPot(txDetails);
    },
    goToUser() {
      this.$router.push({ name: "dungeon-user" });
    },
    async resetDungeon() {
      await this.performRequest(this.$store.dispatch("dungeon/reset"));
    },
    async resetProgress() {
      await this.performRequest(this.$store.dispatch("dungeon/reset"));
    },
    async usePotion() {
      if (this.$refs.maze.isTrapped()) {
        return;
      }
      await this.performRequest(
        this.$store.dispatch("dungeon/useItem", "potion")
      );
    },
    async useScroll() {
      if (this.$refs.maze.isTrapped()) {
        return;
      }

      const used = await this.performRequest(
        this.$store.dispatch("dungeon/useItem", "scroll")
      );

      if (!used) {
        await this.showPrompt(this.$t("dl-no-use"), this.$t("dl-no-use-d"), [
          {
            type: "grey",
            title: "btn-ok",
            response: true
          }
        ]);
      }
    },
    async nextFloor() {
      await this.performRequest(this.$store.dispatch("dungeon/nextFloor"));
    },
    async sendTestAction(action) {
      await this.performRequest(
        this.$store.dispatch("dungeon/sendTestAction", action)
      );
    },
    async shakeEnergy() {
      const xMax = 16;
      await anime({
        targets: "#energy",
        easing: "easeInOutSine",
        duration: 400,
        translateX: [
          {
            value: xMax * -1
          },
          {
            value: xMax
          },
          {
            value: xMax / -2
          },
          {
            value: xMax / 2
          },
          {
            value: 0
          }
        ]
      }).finished;
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "../../style/common.less";

.hallowen-bg {
  background-color: #40374d;
  z-index: -1;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
}

.stat-panel {
  display: grid;
  justify-content: center;
  grid-template-rows: repeat(3, 4rem);
  grid-template-columns: repeat(2, 1fr);
  row-gap: 1rem;
}

.btns {
  grid-row: ~"2/4";
  grid-column: 2;
}

.overlay-color {
  z-index: 98;
}
</style>
