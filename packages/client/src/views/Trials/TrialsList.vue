<template>
  <div v-bar>
    <div>
      <div class="flex flex-column">
        <slot v-if="state" :open="openTrial" :unlockedTrials="state.unlockedTrials" :trialType="trialType"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["openTrial", "state", "trialType"]
};
</script>