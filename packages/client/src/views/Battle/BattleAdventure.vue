<template>
  <div class="flex flex-column flex-full overflow-auto">
    <BattleZoneSelection @change="changeHandler" />
    <div
      v-if="adventure"
      class="flex-full overflow-auto margin-top-4 padding-bottom-2 relative"
    >
      <BattleAdventureItem
        v-for="item in adventure.levels"
        :key="item.id"
        :adventure="adventure"
        :level="item"
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
import BattleAdventureItem from "@/views/Battle/BattleAdventureItem.vue";
import BattleAdventureDifficultySelect from "@/views/Battle/BattleAdventureDifficultySelect.vue";

export default {
  components: {
    BattleZoneSelection,
    BattleAdventureItem
  },
  mixins: [AppSection, ActivityMixin, NetworkRequestErrorMixin, PromptMixin],
  data() {
    return {
      adventure: null
    };
  },
  computed: {
    ...mapState("battle", ["game"]),
    difficulty() {
      return this.game && this.game.adventureDifficulty
        ? this.game.adventureDifficulty
        : battle.GAME_DIFFICULTY_MEDIUM;
    },
    battleItems() {
      return battle.LOCATIONS;
    }
  },
  methods: {
    changeHandler({ adventure }) {
      this.adventure = adventure;
    },
    async switchDifficultyHandler() {
      const show = create(BattleAdventureDifficultySelect);
      await show();
    }
  }
};
</script>
<style scoped lang="less"></style>
