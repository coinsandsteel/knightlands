<template>
  <div class="quest-content">
    <div class="screen-background"></div>
    <div v-show="!zone" v-bar>
      <div>
        <div class="quest-list">
          <router-link
            v-for="zone in zones"
            v-bind:key="zone._id"
            class="element font-size-30"
            :class="{ 'zone-locked': isLocked(zone) }"
            :to="{ path: zone._id + '', append: true }"
          >
            <div class="zone-picture">
              <img v-lazy="getZoneImage(zone._id)" />
              <div
                class="font-size-30 uppercase overlay-title font-outline font-weight-900"
              >
                {{ $t(getZoneName(zone._id)) }}
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <keep-alive>
      <div class="height-100" v-if="zone" v-bar>
        <div class="height-100">
          <keep-alive exclude="quest-mission">
            <quest-mission
              class="quest-view flex-no-wrap"
              v-if="showQuest"
              :zone="currentZone"
              :questIndex="quest"
              :maxQuestIndex="currentZone.quests.length - 1"
              :stage="zoneStage(zone)"
              @nextQuest="goToNextQuest"
              @prevQuest="goToPrevQuest"
              @nextDifficulty="handleNextDifficulty"
            ></quest-mission>

            <div class="quest" v-else>
              <zone-selection
                :zones="zones"
                :value="zone"
                v-if="zones.length > 0"
                @zoneChanged="handleZoneChanged"
                class="margin-bottom-3"
              ></zone-selection>

              <div class="quest-list center">
                <div class="center">
                  <quest-mission-element
                    v-for="(quest, index) of currentZone.quests"
                    :key="index"
                    :zone="currentZone"
                    :questIndex="index"
                    :stage="zoneStage(zone)"
                    @engage="selectQuest(index)"
                  ></quest-mission-element>
                </div>
                <div
                  class="blocker center padding-top-2 font-size-30 font-weight-900"
                  v-if="loaded && (isZoneLocked || levelLocked)"
                >
                  <p class="yellow-title" v-if="isZoneLocked">
                    {{ $t("prev-q-f") }}
                  </p>
                  <p class="font-error" v-if="levelLocked">
                    {{ $t("ch-lvl-req", { level: $game.character.level }) }}
                  </p>
                </div>
              </div>
            </div>
          </keep-alive>
        </div>
      </div>
    </keep-alive>

    <portal
      to="footer"
      v-if="isActive && zone !== undefined && zones.length > 0"
      :slim="true"
    >
      <CustomButton type="yellow" @click="openLuckyDrops">{{
        $t("btn-lck-drop")
      }}</CustomButton>

      <CustomButton
        v-if="allFinished"
        @click="handleResetProgress"
        type="grey"
        >{{ $t("btn-reset") }}</CustomButton
      >
      <DifficultySwitch
        :cb="handleDifficultySwitch"
        :stages="$game.getZoneStageStatuses(zone)"
        :current="zone"
      ></DifficultySwitch>
    </portal>
  </div>
</template>

<script>
import QuestMissionElement from "./QuestMissionElement.vue";
import Zones from "@/campaign_database";
import AppSection from "@/AppSection.vue";
import ZoneSelection from "./ZoneSelection.vue";
import QuestMission from "./QuestMission.vue";
import CustomButton from "@/components/Button.vue";
import DifficultySwitch from "@/components/DifficultySwitch.vue";

export default {
  name: "home",
  mixins: [AppSection],
  components: {
    QuestMissionElement,
    ZoneSelection,
    QuestMission,
    DifficultySwitch,
    CustomButton
  },
  props: ["zone", "quest"],
  data() {
    return {
      zones: [],
      currentQuest: undefined,
      currentZone: {},
      loaded: false,
      allFinished: false
    };
  },
  watch: {
    quest() {
      // watch router change quest param and refresh quest data
      this.updateCurrentZone();
    },
    zone() {
      this.updateCurrentZone();

      if (this.zone) {
        this.$store.commit("setQuestZone", this.zone);
      }
    }
  },
  async activated() {
    this.title = "Quests";

    await this.loadZones();

    this.loaded = true;

    this.updateCurrentZone();

    // load previously selected zone
    if (!this.zone && this.$store.getters.selectedQuestZone) {
      this.$router.push({
        path: `${this.$store.getters.selectedQuestZone}`,
        append: true
      });
    }
  },
  computed: {
    levelLocked() {
      return (
        Zones.getLastZone() * this.currentStage + +this.zone >
        this.$game.character.level
      );
    },
    currentStage() {
      return this.$store.getters.getZoneStage;
    },
    isZoneLocked() {
      return this.$game.getZoneLocked(this.zone, this.currentStage);
    },
    showQuest() {
      return this.quest !== undefined && this.currentQuest;
    }
  },
  methods: {
    openLuckyDrops() {
      this.$router.push({
        name: "lucky-drops",
        params: { stage: this.currentStage }
      });
    },
    isLocked(zone) {
      return this.$game.isZoneLocked(zone._id);
    },
    zoneStage(zone) {
      return this.$store.getters.getZoneStage;
    },
    toggleFooterButtons() {
      this.removeFooter();
      // don't show inside quest or in zone list

      if (!this.zone || this.quest !== undefined) {
        return;
      }

      this.allFinished = true;
      this.currentZone.quests.forEach((quest, index) => {
        let progress = this.$game.getQuestProgress(this.zone, index);
        if (progress.current < progress.max) {
          this.allFinished = false;
        }
      });
    },
    handleDifficultySwitch(stage) {
      this.$store.commit("setZoneStage", {
        stage
      });
    },
    goToNextQuest() {
      if (this.quest < this.currentZone.quests.length - 1) {
        this.selectQuest(this.quest * 1 + 1);
      }
    },
    goToPrevQuest() {
      if (this.quest > 0) {
        this.selectQuest(this.quest * 1 - 1);
      }
    },
    async handleResetProgress() {
      await this.$game.resetZone(this.zone);
    },
    updateCurrentZone() {
      if (this.zone) {
        this.$set(this, "currentZone", this.zones[this.zone - 1]);

        if (!this.currentZone) {
          return;
        }

        if (this.quest) {
          let questData = this.currentZone.quests[this.quest];

          if (!questData) {
            return;
          }

          this.$set(this, "currentQuest", questData);
        }
      }

      this.toggleFooterButtons();
    },
    getZoneName(zone) {
      return Zones.getZoneName(zone);
    },
    getZoneImage(zone) {
      return Zones.getBackground(zone);
    },
    selectQuest(questIndex) {
      if (this.quest) {
        this.$router.replace({
          path: `/home/quest/${this.zone}/${questIndex}`,
          append: false
        });
      } else {
        this.$router.push({
          path: `${questIndex}`,
          append: true
        });
      }
    },
    async loadZones() {
      let zones = await this.$game.getZonesData();
      this.$set(this, "zones", zones);
    },
    handleZoneChanged(zoneId) {
      if (this.zone == zoneId) {
        return;
      }

      // important to replace route instead of pushing to be able to move back in history freely
      this.$router.replace({ path: `${zoneId}` });
    },
    handleNextDifficulty() {
      this.$router.replace({
        name: "quests",
        params: {
          zone: 1,
          quest: 0
        }
      });

      this.$store.commit("setZoneStage", {
        stage: this.zoneStage(this.zone) + 1
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "../../style/common.less";

.status {
  width: 80%;
}

.quest-list {
  position: relative;
  width: 100%;

  .elements {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

.quests {
  height: 90%;
}

.zone-locked {
  filter: grayscale(100%) brightness(20%) sepia(100%) hue-rotate(-50deg)
    saturate(600%) contrast(0.8);
}

.button {
  background-color: #95a792;
  border-radius: 4px;
  width: 240px;
  height: 80px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #a0b39d;
  }

  &:active {
    background-color: #889785;
  }
}

.font-dark {
  color: #353440;
}

.zone-picture {
  min-height: 130px;
}

.blocker {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #353440cc;
  z-index: 5;
}
</style>
