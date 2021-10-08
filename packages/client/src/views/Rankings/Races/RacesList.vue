<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <div
      class="font-size-20 panel-input pdding-1 margin-2"
      v-if="cooldownTimer.timeLeft > 0"
      v-html="$t('race-cooldown', { time: cooldownTimer.value })"
    ></div>
    <div v-bar>
      <div class="padding-top-2">
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
      <CustomButton type="yellow" @click="goToShop">{{
        $t("race-shop")
      }}</CustomButton>
      <CustomButton
        type="green"
        @click="previewRewards"
        :disabled="finishedRaces.length == 0"
        >{{ $t("claim-rewards") }}</CustomButton
      >
    </portal>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import CustomButton from "@/components/Button.vue";
import RaceListElement from "./RaceListElement.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import Timer from "@/timer";
import Events from "@/../../knightlands-shared/events";
import { mapState } from 'vuex';

export default {
  mixins: [AppSection, PromptMixin, NetworkRequestErrorMixin],
  components: { RaceListElement, CustomButton },
  created() {
    this.title = "window-races";
    this.$options.useRouterBack = true;
  },
  mounted() {
    this.cooldownTimer.on("finished", this.finishedRaceHandler);
  },
  activated() {
    this.fetchList();
    this.fetchFinishedRaces();
  },
  beforeDestroy() {
    if (this.current) {
      this.leaveRaceChannel();
    }
    this.cooldownTimer.off("finsihed", this.finishedRaceHandler);
  },
  data: () => ({
    races: [],
    current: null,
    finishedRaces: [],
    cooldownTimer: new Timer(true)
  }),
  watch: {
    "current.id": function(newId, oldId){
      if (oldId && !newId) {
        this.removeListener();
      }
      if (!oldId && newId) {
        this.addListener();
      }
    }
  },
  methods: {
    finishedRaceHandler(data){
      if (this.currentRace && this.currentRace.id == data.race) {
        this.fetchList();
      }
    },
    removeListener(){
      this.$game.off(Events.RaceFinished, this.finishedRaceHandler);
    },
    addListener(){
      this.$game.on(Events.RaceFinished, this.finishedRaceHandler);
    },
    previewRewards() {
      this.$router.push({
        name: "race-claim-rewards",
        params: {
          races: this.finishedRaces
        }
      });
    },
    async fetchFinishedRaces() {
      this.finishedRaces = await this.performRequest(
        this.$game.getFinishedRaces()
      );
    },
    async fetchList() {
      const info = await this.performRequest(this.$game.fetchRaces());
      this.races = info.list;
      this.current = info.currentRace;
      this.cooldownTimer.timeLeft = info.cooldown;

      this.$store.commit("rankings/setCurrentRace", { currentRace: info.currentRace });

      this.races.sort((x, y) => {
        let subject = x.config.tier - y.config.tier;

        if (info.currentRace && x._id == info.currentRace.id) {
          return -1;
        }

        if (info.currentRace && y._id == info.currentRace.id) {
          return 1;
        }

        if (subject == 0) {
          subject = x._id.localeCompare(y._id);
        }

        return subject;
      });
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

      await this.performRequest(this.$game.joinRace(race._id));
      await this.fetchList();
    },
    async showRanks(race) {
      this.$router.push({
        name: "race-ranks",
        params: { id: race._id }
      });
    },
    async showRewards(race) {
      this.$router.push({
        name: "race-rewards",
        params: { id: race._id }
      });
    }
  },
  computed: {
    ...mapState({
      currentRace: state => state.rankings.currentRace
    })
  }
};
</script>
