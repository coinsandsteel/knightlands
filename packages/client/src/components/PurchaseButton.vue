<template>
  <CustomButton v-bind="$attrs" @click="handleClick">
    <slot></slot>
    <IconWithValue iconClass="icon-premium">{{ price }}</IconWithValue>
  </CustomButton>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";

import NoShinies from "@/components/Modals/NoShinies.vue";
import { create } from "vue-modal-dialogs";

const ShowDialog = create(NoShinies);

export default {
  props: ["price"],
  components: { CustomButton, IconWithValue },
  methods: {
    handleClick() {
      if (this.price > this.$game.hardCurrency) {
        ShowDialog();
      } else {
        this.$emit("click");
      }
    }
  }
};
</script>
