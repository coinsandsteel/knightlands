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
import PromptMixin from "@/components/PromptMixin.vue";

import NoShinies from "@/components/Modals/NoShinies.vue";
import NoGold from "@/components/Modals/NoGold.vue";
import { create } from "vue-modal-dialogs";

const ShowShiniesDialog = create(NoShinies);
const ShowGoldDialog = create(NoGold);

export default {
  mixins: [PromptMixin],
  props: ["price", "soft"],
  components: { CustomButton, IconWithValue },
  methods: {
    async handleClick() {
      if (this.soft && this.price > this.$game.softCurrency) {
        ShowGoldDialog();
      } else if (!this.soft && this.price > this.$game.hardCurrency) {
        ShowShiniesDialog();
      } else {
        if (!this.soft) {
          const response = await this.showPrompt(
            this.$t("buy-i-t"),
            this.$t("buy-i-q"),
            [
              {
                type: "red",
                title: this.$t("buy-i-n"),
                response: false
              },
              {
                type: "green",
                title: this.$t("buy-i-y"),
                response: true
              }
            ]
          );

          if (!response) {
            return;
          }
        }

        this.$emit("click");
      }
    }
  }
};
</script>
