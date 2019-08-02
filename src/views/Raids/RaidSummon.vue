<template>
  <div class="flex flex-column flex-center raid-summon-content">
    <div
      class="font-size-30 enemy-title-font raid-summon-title font-outline font-weight-700"
    >{{meta.name}}</div>
    <div class="pixelated raid-summon-boss-image" :style="enemyImage"></div>

    <div class="flex flex-column flex-center margin-top-3">
      <span class="font-size-25">Select Difficulty</span>
      <div class="flex flex-center margin-top-small">
        <div class="stage-selector" v-for="stage in availableDifficulties" :key="stage">
          <input
            :id="`stage${stage}`"
            type="radio"
            name="stage"
            :value="stage"
            ref="stages"
            v-model="selectedStage"
          />
          <label :for="`stage${stage}`" :class="`stage${stage}`"></label>
        </div>
      </div>
    </div>

    <div class="margin-top-3">
      <span class="font-size-25">Required Essences</span>
      <div class="flex flex-center margin-top-small">
        <crafting-ingridient
          v-for="(essence, index) in requiredEssences"
          :key="essence.itemId"
          :ingridient="essence"
        />
      </div>
    </div>

    <div class="margin-top-3 font-size-25">Summoning Fee: 9999 TRX</div>

    <custom-button class="margin-top-3" type="yellow" @click="confirmSummon">Summon</custom-button>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import RaidsMeta from "@/raids_meta";
import UiConstants from "@/ui_constants";
import CraftingIngridient from "@/components/CraftingIngridient.vue";
import CustomButton from "@/components/Button.vue";

import Prompt from "@/components/Prompt.vue";
import { create as CreateDialog } from "vue-modal-dialogs";

const ShowPrompt = CreateDialog(Prompt, ...Prompt.props);

export default {
  name: "raid-summon",
  mixins: [AppSection],
  props: ["raid"],
  components: { CraftingIngridient, CustomButton },
  created() {
    this.title = "Summon Raid";
  },
  mounted() {
    this.$refs.stages[this.selectedStage].checked = true;
  },
  data() {
    return {
      selectedStage: 1
    };
  },
  computed: {
    meta() {
      return RaidsMeta[this.raid];
    },
    enemyImage() {
      return `background-image: url("${UiConstants.enemyImage(
        this.meta.icon
      )}");`;
    },
    availableDifficulties() {
      return this.meta.stages.map((_, stage) => stage);
    },
    requiredEssences() {
      let stage = this.selectedStage;
      return this.$game.crafting.getRecipeIngridients(
        this.meta.stages[stage].summonRecipe
      );
    }
  },
  methods: {
    async confirmSummon() {
      let result = await ShowPrompt(
        `Are you sure?`,
        `Selected difficulty: ${UiConstants.stageNames[this.selectedStage]}`,
        [
          { type: "green", title: "Ok", response: true },
          { type: "red", title: "Cancel", response: false }
        ]
      );

      if (result === true) {
        let iapNonce = await this.$game.summonRaid(
          this.raid,
          this.selectedStage
        );
        console.log("IAP nonce", iapNonce);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.stage-selector {
  display: inline-grid;

  & input {
    appearance: none;
    margin: 0;
    padding: 0;
  }

  & label {
    transition: all 100ms ease-in;
    filter: brightness(1.8) grayscale(1) opacity(0.7);
  }

  & input:checked + label {
    filter: none;
  }
}

.raid-summon-title {
  position: absolute;
  top: 0;
}

.raid-summon-boss-image {
  height: 30rem;
  width: 100%;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

.raid-summon-content {
  position: relative;
}
</style>


