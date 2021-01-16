<template>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</template>

<script>
export default {
  data: () => ({
    request: null
  })
};
</script>
