<template>
  <div v-bar>
    <div>
      <div class="flex flex-column">
        <slot :open="openTrial" :trialType="trialType"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["openTrial", "trialType"]
};
</script>
