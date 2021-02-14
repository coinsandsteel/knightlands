<template>
  <div class="absolute-stretch t-dialog" @click="handleContinue">
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

        <CustomButton
          height="3rem"
          width="3rem"
          class="t-continue"
          type="grey"
          @click="handleContinue"
        >
          <span class="nav-arrow"></span>
        </CustomButton>
      </div>
    </div>
    <img src="../../assets/avatars/mordred.png" class="t-portrait" />
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
  right: 0;
}
</style>
