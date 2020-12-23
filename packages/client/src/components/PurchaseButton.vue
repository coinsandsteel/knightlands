<template>
  <CustomButton v-bind="$attrs" @click="handleClick">
    <slot></slot>

    <IconWithValue iconClass="icon-gold" v-if="soft">{{ price }}</IconWithValue>
    <IconWithValue iconClass="icon-premium" v-else>{{ price }}</IconWithValue>
  </CustomButton>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";

import NoShinies from "@/components/Modals/NoShinies.vue";
import NoGold from "@/components/Modals/NoGold.vue";
import { create } from "vue-modal-dialogs";

const ShowShiniesDialog = create(NoShinies);
const ShowGoldDialog = create(NoGold);

export default {
  props: ["price", "soft"],
  components: { CustomButton, IconWithValue },
  methods: {
    handleClick() {
      if (this.soft && this.price > this.$game.softCurrency) {
        ShowGoldDialog();
      } else if (!this.soft && this.price > this.$game.hardCurrency) {
        ShowShiniesDialog();
      } else {
        this.$emit("click");
      }
    }
  }
};
</script>
