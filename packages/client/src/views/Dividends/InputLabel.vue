<template>
  <span
    class="
      font-size-20
      margin-left-2 margin-top-2 margin-bottom-1
      font-weight-900
    "
    >{{ $t(title) }}</span
  >
</template>

<script>
export default {
  props: ["title"],
};
</script>