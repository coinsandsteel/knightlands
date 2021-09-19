<template>
  <div
    class="absolute-stretch pointer-events-none t-root"
    v-if="conditionPassed"
  >
    <MusicButton class="sounds-btn e"></MusicButton>

    <TutorialForcedElement
      v-show="isPointer"
      :data="pointerData"
      @continue="handleContinue"
      @skip="handleSkip"
    />
    <TutorialDialog
      v-show="isDialog"
      :data="dialogData"
      @continue="handleContinue"
      @skip="handleSkip"
    />
  </div>
</template>

<script>
import TutorialForcedElement from "./TutorialForcedElement.vue";
import TutorialDialog from "./TutorialDialog.vue";
import { mapState } from "vuex";
import Scenario from "@/store/scenario";
import MusicButton from "@/components/MusicButton.vue";

export default {
  components: { MusicButton, TutorialForcedElement, TutorialDialog },
  data: () => ({
    inited: false
  }),
  watch: {
    "$character.level": {
      handler() {
        this.checkConditions();
      }
    },
    step: {
      immediate: true,
      handler() {
        this.checkConditions();
      }
    },
    $route: {
      deep: true,
      immediate: true,
      handler() {
        this.checkConditions();
      }
    }
  },
  async mounted() {
    await this.checkConditions();
    await this.trySkipAction();
  },
  computed: {
    ...mapState({
      step: state => state.tutorial.step,
      conditionPassed: state => state.tutorial.conditionPassed,
      actionIndex: state => state.tutorial.actionIndex
    }),
    isFinished() {
      return this.step + 1 > Scenario.length || !this.conditionPassed;
    },
    pointerData() {
      if (!this.actionData) {
        return null;
      }
      return this.actionData.pointer;
    },
    isPointer() {
      if (this.isFinished) {
        return false;
      }

      return !!this.pointerData;
    },
    dialogData() {
      if (!this.actionData) {
        return null;
      }

      return this.actionData.dialog;
    },
    actionData() {
      if (this.isFinished) {
        return null;
      }
      return this.stepData.actions[this.actionIndex];
    },
    isDialog() {
      if (this.isFinished) {
        return false;
      }

      return !!this.dialogData;
    },
    stepData() {
      if (this.isFinished) {
        return null;
      }

      return Scenario[this.step];
    }
  },
  methods: {
    async checkConditions() {
      if (this._inProcess) {
        return;
      }

      this._inProcess = true;

      await this.$store.dispatch("tutorial/checkConditions", {
        route: this.$route,
        isInit: !this.inited
      });

      this.inited = true;

      const redirect = await this.$store.dispatch("tutorial/getRedirectUrl", {
        route: this.$route
      });

      this._inProcess = false;

      if (redirect) {
        this.$router.replace(redirect);
      }
    },
    async handleSkip() {
      await this.$store.dispatch("tutorial/skipCurrentStep");
    },
    handleContinue() {
      this.$nextTick(() => {
        this.advance();
      });
    },
    async trySkipAction() {
      if (
        this.actionData &&
        this.actionData.lock &&
        this.actionData.lock.skip
      ) {
        const redirect = await this.$store.dispatch("tutorial/getRedirectUrl", {
          route: this.$route
        });

        if (!redirect) {
          this.advance();
        }
      }
    },
    async advance() {
      await this.$store.dispatch("tutorial/advanceAction");

      this.trySkipAction();
    }
  }
};
</script>

<style scoped>
.t-root {
  z-index: 151;
}
.e {
  pointer-events: all;
}
</style>
