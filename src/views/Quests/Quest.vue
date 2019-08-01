<template>
  <div class="quest-content">
    <div v-show="!zone" v-bar>
      <div>
        <div class="quest-list">
          <router-link
            v-for="zone in zones"
            v-bind:key="zone._id"
            class="element mission1 font-size-30"
            :to="{ path: zone._id+'', append: true }"
          >
            <div class="zone-picture">
              <img class="pixelated" :src="getZoneImage(zone._id)" />
              <div class="font-size-30 overlay-title font-outline">{{getZoneName(zone._id)}}</div>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <keep-alive>
      <div v-if="zone" v-bar>
        <div>
          <keep-alive>
            <quest-mission
              class="quest-view"
              v-if="quest && currentQuest"
              :zone="currentZone"
              :questIndex="quest"
              :maxQuestIndex="currentZone.quests.length-1"
              :stage="zoneStage(zone)"
              @nextQuest="goToNextQuest"
              @prevQuest="goToPrevQuest"
            ></quest-mission>

            <div class="quest" v-else>
              <zone-selection
                :zones="zones"
                :value="zone"
                v-if="zones.length > 0"
                @zoneChanged="handleZoneChanged"
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
                <div class="blocker center" v-if="loaded && isZoneLocked">
                  <p class="yellow-title font-size-30">Finish Previous Zone</p>
                </div>
              </div>
            </div>
          </keep-alive>
        </div>
      </div>
    </keep-alive>
  </div>
</template>

<script>
import QuestMissionElement from "./QuestMissionElement.vue";
import { Zones } from "@/campaign_database";
import AppSection from "@/AppSection";
import ZoneSelection from "@/components/ZoneSelection.vue";
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
    DifficultySwitch
  },
  props: ["zone", "quest"],
  data() {
    return {
      zones: [],
      currentQuest: undefined,
      currentZone: {},
      loaded: false
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
  async mounted() {
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
    currentStageStage() {
      return this.$store.state.zoneStages[this.zone];
    },
    isZoneLocked() {
      return this.$game.getZoneLocked(this.zone, this.currentStageStage);
    }
  },
  methods: {
    zoneStage(zone) {
      return this.$store.getters.getZoneStage(zone);
    },
    toggleFooterButtons() {
      this.removeFooter();
      // don't show inside quest or in zone list

      if (!this.zone || this.quest) {
        return;
      }

      let allFinished = true;
      let stage = this.zoneStage(this.zone);
      this.currentZone.quests.forEach((quest, index) => {
        let progress = this.$game.getQuestProgress(this.zone, index);
        if (progress.current < progress.max) {
          allFinished = false;
        }
      });

      if (allFinished) {
        this.addFooter(CustomButton, {
          cb: this.handleResetProgress.bind(this),
          caption: "Reset",
          type: "grey"
        });
      }

      // show difficulty switch
      this.addFooter(DifficultySwitch, {
        cb: this.handleDifficultySwitch.bind(this),
        stages: this.$game.getZoneStageStatuses(this.zone),
        current: this.zone
      });
    },
    handleDifficultySwitch(stage) {
      this.$store.commit("setZoneStage", {
        zone: this.zone,
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
      return Zones.getName(zone);
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
  width: 90%;
  margin: 0 auto;

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
  margin-bottom: 1rem;
}

.blocker {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #353440cc;
}
</style>
