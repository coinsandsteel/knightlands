<template>
  <div class="flex flex-center" @click="showHint">
    <IconWithValue
      :flip="true"
      :iconMargin="true"
      iconClass="icon-info square big"
      class="pointer"
    >
      <slot></slot>
    </IconWithValue>
  </div>
</template>

<script>
import TutorialHint from "@/components/TutorialHint.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import { create } from "vue-modal-dialogs";

const ShowHint = create(TutorialHint, "title", "texts");

export default {
  props: ["title", "texts", "component", "flip"],
  components: { IconWithValue },
  methods: {
    async showHint() {
      if (this.component) {
        await this.component();
        return;
      }

      if (this.texts) {
        await this.showTextHint();
      }
    },
    async showTextHint() {
      await ShowHint(this.title, this.texts);
    }
  }
};
</script>

<style lang="less" scoped>
.mask {
  position: absolute;
  z-index: 110;
}
</style>
