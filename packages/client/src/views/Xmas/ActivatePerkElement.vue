<template>
  <div class="flex flex-center flex-space-between margin-bottom-1">
    <PerkIcon :perk="perk" class="flex-1" />
    <span class="font-size-20 flex-7">{{ $t(description) }}</span>
    <CustomButton type="green" width="20rem" @click="$emit('activate', perk)">
      Activate
      <IconWithValue iconClass="icon-sb">
        {{ Math.floor(Math.random() * 10000) }}
      </IconWithValue>
    </CustomButton>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import PerkIcon from "./PerkIcon.vue";

export default {
  props: ["perk"],
  components: { CustomButton, PerkIcon, IconWithValue },
  computed: {
    description() {
      return `d-${this.perk}`;
    }
  }
};
</script>
