<template>
  <div class="sidebar flex-grow-1" :class="{ show: show }">
    <div class="px-3 py-2">
      <p>
        Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
        dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
        consectetur ac, vestibulum at eros.
      </p>
      <b-img src="https://picsum.photos/500/500/?image=54" fluid thumbnail></b-img>
      <b-dropdown id="dropdown-1" text="Categories" class="m-md-2">
        <b-dropdown-item        >One</b-dropdown-item>
        <b-dropdown-item>Two</b-dropdown-item>
        <b-dropdown-item>Three</b-dropdown-item>
      </b-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  props: ["show"]
};
</script>

<style lang="less" scoped>
@import (reference) "../../style/common.less";

.sidebar {
  position: sticky;
  max-width: 340px;
  background-color: @panelBgColor;

  .mobile(
    {max-width: unset; position: absolute; z-index: 100; width: 100vw; height: 100vh;
      display: none; &.show {display: inherit;}}
  );
}
</style>
