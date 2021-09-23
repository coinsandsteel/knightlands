<template>
  <div class="flex flex-center flex-column">
    <IconWithValue iconClass="icon-user">
      <span class="font-size-20 white-space-wide"
        >{{ slots }}/{{ maxSlots }}</span
      >
    </IconWithValue>

    <custom-button
      type="red"
      class="white-space-wide"
      @click="$emit('combatLog')"
    >
      <IconWithValue iconClass="icon-attack"></IconWithValue>
    </custom-button>

    <custom-button type="grey" class="raid-mid-btn" @click="$emit('showInfo')">
      <icon-with-value
        valueClass="font-size-20 btn-fix"
        iconClass="icon-info dark"
      ></icon-with-value>
    </custom-button>

    <custom-button
      v-if="hasChallenges"
      type="grey"
      class="raid-mid-btn"
      @click="$emit('showChallenges')"
    >
      <icon-with-value
        valueClass="font-size-20 btn-fix"
        iconClass="icon-challenge"
      ></icon-with-value>
    </custom-button>

    <custom-button
      type="grey"
      class="raid-mid-btn"
      @click="$emit('showRewards')"
    >
      <icon-with-value
        valueClass="font-size-20 btn-fix"
        iconClass="icon-loot"
      ></icon-with-value>
    </custom-button>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  components: { CustomButton, IconWithValue },
  props: ["slots", "maxSlots"]
};
</script>
