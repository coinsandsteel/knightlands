<template>
  <div class="flex flex-column flex-full overflow-auto">
    <BattleZoneSelection @change="changeHandler" />
    <div
      v-if="locationMeta && locationData"
      class="flex-full overflow-auto margin-top-4 padding-bottom-2 relative"
    >
      <BattleAdventureLevel
        v-for="(levelMeta, levelIndex) in locationMeta.levels"
        :key="'adv-level-' + levelIndex"
        :locationIndex="locationIndex"
        :levelIndex="levelIndex"
        :levelMeta="levelMeta[difficulty]"
        :levelData="levelData(levelIndex)"
      />
    </div>

    <portal v-if="isActive" to="footer" :slim="true">
      <div class="width-100 flex flex-items-start">
        <div class="flex-full"></div>
        <div>
          <CustomButton
            type="grey"
            class="inline-block margin-right-2 margin-top-1"
            @click="switchDifficultyHandler"
          >
            Difficulty: {{ this.difficulty }}
          </CustomButton>
        </div>
      </div>
    </portal>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { create } from "vue-modal-dialogs";
import * as battle from "@/../../knightlands-shared/battle";
import AppSection from "@/AppSection.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import BattleZoneSelection from "@/views/Battle/BattleZoneSelection.vue";
import BattleAdventureLevel from "@/views/Battle/BattleAdventureLevel.vue";
import BattleAdventureDifficultySelect from "@/views/Battle/BattleAdventureDifficultySelect.vue";

export default {
  components: {
    BattleZoneSelection,
    BattleAdventureLevel
  },
  mixins: [AppSection, ActivityMixin, NetworkRequestErrorMixin, PromptMixin],
  data() {
    return {
      locationIndex: 0
    };
  },
  computed: {
    ...mapState("battle", ["adventures"]),
    difficulty() {
      return this.adventures.difficulty || battle.GAME_DIFFICULTY_MEDIUM;
    },
    locationMeta() {
      return battle.ADVENTURES[this.locationIndex] || null;
    },
    locationData() {
      return this.adventures.locations[this.locationIndex] || null;
    },
    levelData() {
      return levelIndex => {
        return this.adventures.locations[this.locationIndex].levels[levelIndex];
      };
    }
  },
  methods: {
    changeHandler({ locationIndex }) {
      this.locationIndex = locationIndex;
    },
    async switchDifficultyHandler() {
      const show = create(BattleAdventureDifficultySelect, "locationIndex");
      await show(this.locationIndex);
    }
  }
};
</script>
<style scoped lang="less"></style>
