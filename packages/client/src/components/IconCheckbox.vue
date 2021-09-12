<template>
  <div class="flex flex-center pointer" @click="handleClick">
    <span
      class="value-icon"
      :class="{ [onClass]: value, [offClass]: !value }"
    ></span>
    <div class="font-size-25">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ["onClass", "offClass", "value"],
  methods: {
    handleClick() {
      this.$emit("input", !this.value);
    }
  }
};
</script>
