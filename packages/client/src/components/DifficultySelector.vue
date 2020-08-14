<template>
  <div class="flex flex-center margin-top-small">
    <div
      class="panel-dark stage-selector"
      :class="[{'preview' : preview}, {'disabled' : isLocked(stage)}]"
      v-for="stage in stages"
      :key="stage"
    >
      <input
        ref="stages"
        :id="`stage${stage}`"
        type="radio"
        name="stage"
        :value="stage"
        v-model="selectedStage"
      />
      <label class="relative" :for="`stage${stage}`" :class="`stage${stage}`">
        <div :class="{'selector-border': selectedStage==stage}"></div>
        <span class="caption font-size-18">{{getStageBtnCaption(stage)}}</span>
      </label>
    </div>
  </div>
</template>

<script>
import CustomButton from "./Button.vue";
import UiConstants from "@/ui_constants";

export default {
  components: {
    CustomButton
  },
  props: ["stages", "value", "preview", "stagesState"],
  data: () => ({
    selectedStage: 0
  }),
  mounted() {
    this.selectedStage = this.value;
  },
  watch: {
    selectedStage() {
      this.$emit("input", this.selectedStage);
    },
    value() {
      this.selectedStage = this.value;
    }
  },
  methods: {
    getStageBtnCaption(stage) {
      return UiConstants.stageNames[stage];
    },
    isLocked(stage) {
      if (!this.stagesState) {
        return false;
      }

      return !this.stagesState[stage];
    }
  }
};
</script>


<style lang="less" scoped>
.caption {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateY(100%) translateX(-50%);
}

.stage-icon() {
  background-size: 75% 75%;
  background-repeat: no-repeat;
  background-position: center;
  width: 5rem;
  height: 5rem;
  display: inline-block;
  cursor: pointer;

  &.disabled {
    opacity: 0.3;
  }
}

.stage0 {
  background-image: url("./../assets/ui/difficulty_easy.png");
  .stage-icon();
}

.stage1 {
  background-image: url("./../assets/ui/difficulty_normal.png");
  .stage-icon();
}

.stage2 {
  background-image: url("./../assets/ui/difficulty_hard.png");
  .stage-icon();
}

.stage3 {
  background-image: url("./../assets/ui/difficulty_nightmare.png");
  .stage-icon();
}

.stage-selector {
  margin: 1rem;
  display: inline-grid;

  &.preview {
    margin: 0.3rem;
    pointer-events: none;

    & label {
      width: 4rem;
      height: 4rem;
    }

    & span {
      display: none;
    }
  }

  &.disabled {
    & label {
      filter: brightness(1.8) grayscale(1) opacity(0.7);
    }
  }

  & input {
    appearance: none;
    margin: 0;
    padding: 0;
  }

  & label {
    transition: all 100ms ease-in;
    filter: brightness(0.8) opacity(0.9);
  }

  & input:checked + label {
    filter: brightness(1) opacity(1);
  }
}

.selector-border {
  position: absolute;
  left: 0;
  top: 0;
  background: no-repeat url("./../assets/ui/difficulty_selected.png");
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
}
</style>


