<template>
  <div>
    <b-button v-b-toggle.sidebar-variant>Knightlands</b-button>
    <b-sidebar
      id="sidebar-variant"
      class="sidebar"
      title="Knightlands"
      bg-variant="dark"
      text-variant="light"
    >
      <div class="px-3 py-2">
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
        <b-img src="https://picsum.photos/500/500/?image=54" fluid thumbnail></b-img>
        <b-dropdown id="dropdown-1" text="Categories" class="m-md-2">
          <b-dropdown-item>One</b-dropdown-item>
          <b-dropdown-item>Two</b-dropdown-item>
          <b-dropdown-item>Three</b-dropdown-item>
        </b-dropdown>
      </div>
    </b-sidebar>
  </div>
</template>

<style lang="less" scoped>
@import (reference) "../style/common.less";

.sidebar {
  display: flex !important;

  & .b-sidebar {
    .not-mobile({display: flex; transform: translateX(0) ;});
  }
}
</style>
