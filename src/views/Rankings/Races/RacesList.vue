<template>
  <Promised :promise="request">
    <template v-slot:combined="{ isPending, isDelayOver }">
      <div class="screen-content">
        <LoadingScreen :loading="true" :opacity="0.7" v-show="isPending && isDelayOver"></LoadingScreen>
        <div
          class="font-size-20 panel-input pdding-1 margin-2"
          v-if="cooldownTimer.timeLeft > 0"
          v-html="$t('race-cooldown', {time: cooldownTimer.value})"
        ></div>
        <div v-bar>
          <div>
            <RaceListElement
              v-for="r in races"
              :key="r.id"
              :race="r"
              :currentRank="joined(r) ? current : null"
              :cooldown="cooldownTimer.timeLeft"
              @join="join(r)"
              @ranks="showRanks(r)"
              @rewards="showRewards(r)"
              @finished="fetchList"
            ></RaceListElement>
          </div>
        </div>

        <portal to="footer" :slim="true" v-if="isActive">
          <CustomButton type="yellow" @click="goToShop">{{$t("race-shop")}}</CustomButton>
          <CustomButton
            type="green"
            @click="previewRewards"
            :disabled="finishedRaces.length == 0"
          >{{$t("claim-rewards")}}</CustomButton>
        </portal>
      </div>
    </template>
  </Promised>
</template>

<script>
import AppSection from "@/AppSection.vue";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import CustomButton from "@/components/Button.vue";
import RaceListElement from "./RaceListElement.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import Timer from "@/timer";

export default {
  mixins: [AppSection, PromptMixin],
  components: { Promised, LoadingScreen, RaceListElement, CustomButton },
  created() {
    this.title = "window-races";
  },
  mounted() {
    this.fetchList();
    this.fetchFinishedRaces();
    this.listener = this.fetchList.bind(this);
    this.cooldownTimer.on("finished", this.listener);
  },
  beforeDestroy() {
    this.cooldownTimer.off("finsihed", this.listener);
  },
  data: () => ({
    request: null,
    races: [],
    current: null,
    finishedRaces: [],
    cooldownTimer: new Timer(true)
  }),
  methods: {
    previewRewards() {
      this.$router.push({
        name: "race-claim-rewards",
        params: {
          races: this.finishedRaces
        }
      });
    },
    async fetchFinishedRaces() {
      this.finishedRaces = await this.$game.getFinishedRaces();
    },
    async fetchList() {
      this.request = this.$game.fetchRaces();

      const info = await this.request;
      this.races = info.list;
      this.current = info.currentRace;
      this.cooldownTimer.timeLeft = info.cooldown;
    },
    goToShop() {
      this.$router.push({ name: "race-shop" });
    },
    joined(race) {
      if (!this.current) return false;
      return race._id == this.current.id;
    },
    async join(race) {
      if (this.current) {
        // if already joined race
        let response = await this.showPrompt(
          this.$t("prompt-confirm-title"),
          this.$t("race-leave-desc"),
          [
            {
              type: "yellow",
              title: "btn-ok",
              response: true
            },
            {
              type: "rd",
              title: "btn-cancel",
              response: false
            }
          ]
        );

        if (!response) {
          return;
        }
      }

      this.request = this.$game.joinRace(race._id);
      await this.request;
      await this.fetchList();
    },
    async showRanks(race) {
      this.$router.push({ name: "race", params: { id: race._id } });
      this.$router.replace({
        name: "race-ranks",
        params: { id: race._id }
      });
    },
    async showRewards(race) {
      this.$router.push({ name: "race", params: { id: race._id } });
      this.$router.replace({
        name: "race-rewards",
        params: { id: race._id }
      });
    }
  }
};
</script>