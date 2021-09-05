<template>
  <CustomButton v-bind="$attrs" @click="handleClick">
    <div class="margin-right-1">
      <slot></slot>
    </div>

    <template v-if="price > 0">
      <IconWithValue iconClass="icon-gold" :iconMargin="false" v-if="soft">{{
        price
      }}</IconWithValue>
      <IconWithValue iconClass="icon-premium" :iconMargin="false" v-else>{{
        price
      }}</IconWithValue>
    </template>
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
