<template>
  <div class="absolute-stretch t-dialog" @click.self="handleContinue">
    <div class="t-bubble flex flex-column flex-center">
      <div
        class="color-panel-1 element-shadow padding-1 flex flex-column flex-center"
      >
        <div
          class="font-size-20 width-100 margin-bottom-2"
          v-for="t in text"
          :key="t"
          v-html="$t(t)"
        ></div>

        <div class="flex flex-end t-continue">
          <CustomButton
            height="3rem"
            type="red"
            @click="handleSkip"
            v-if="showSkipButton"
          >
            <!-- <span class="nav-arrow"></span> -->
            {{ $t("btn-skip-t") }}
          </CustomButton>

          <CustomButton height="3rem" type="grey" @click="handleContinue">
            {{ $t("btn-next-t") }}
            <span class="nav-arrow margin-left-half"></span>
          </CustomButton>
        </div>
      </div>
    </div>
    <img
      src="../../assets/avatars/mordred.png"
      class="pointer-events-none t-portrait"
    />
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";

export default {
  props: ["data"],
  data: () => ({
    step: 0
  }),
  components: { CustomButton },
  watch: {
    data() {
      this.step = 0;
    }
  },
  computed: {
    showSkipButton() {
      if (this.dialogFinished) {
        return false;
      }

      return !this.data[this.step].hideSkip;
    },
    text() {
      if (this.dialogFinished) {
        return "";
      }
      return this.data[this.step].text;
    },
    dialogFinished() {
      if (!this.data) {
        return true;
      }
      return this.step >= this.data.length;
    }
  },
  methods: {
    handleSkip() {
      this.$emit("skip");
    },
    handleContinue() {
      this.step++;

      if (this.dialogFinished) {
        this.$emit("continue");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.t-bubble {
  height: 60%;

  > div {
    min-height: 50%;
  }

  span {
    display: inline-block;
  }
}

.t-dialog {
  background-color: #21002847;
  pointer-events: all;
}

.t-portrait {
  max-width: 100%;
  height: 40%;
  object-fit: contain;
  position: absolute;
  bottom: 0;
  right: 0;
}

.t-continue {
  position: absolute;
  bottom: 0;
}
</style>
