<template>
  <div id="app" class="d-flex flex-column w-100 h-100">
    <b-navbar id="nav" :sticky="true" toggleable="md">
      <div class="brand mr-3"></div>
      <b-nav-form>
        <b-form-input class="mr-sm-2" placeholder="Search items"></b-form-input>
      </b-nav-form>

      <Toggler v-model="showNavbar"></Toggler>

      <div class="nav-collapse" :class="{ show: showNavbar }">
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/browse">Browse</b-nav-item>
          <b-nav-item href="/create">Create</b-nav-item>
          <b-nav-item href="/help">Help</b-nav-item>
          <b-nav-item href="/account">Account</b-nav-item>

          <b-nav-item-dropdown text="Lang" right>
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">ES</b-dropdown-item>
            <b-dropdown-item href="#">RU</b-dropdown-item>
            <b-dropdown-item href="#">FA</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </div>
    </b-navbar>
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Toggler from "@/components/Toggler.vue";
 
export default Vue.extend({
  data: () => ({
    showNavbar: false
  }),
  components: { Toggler }
});
</script>

<style lang="less">
@import (reference) "./style/common.less";

@navBarHeight: 90px;

body {
  height: 100vh;
  width: 100vw;
  margin: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  position: relative;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: @mainFontColor;
  background-color: @mainBgColor;
  height: 100%;
}

#nav {
  height: @navBarHeight;
  background-color: @panelBgColor;
  box-shadow: 0px 2px 5px 0px rgba(15, 23, 61, 0.97);
  flex-wrap: nowrap !important;

  & .brand {
    width: 120px;
    height: 64px;
    background-image: url("./assets/klogo2x.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;

    .mobile({background-image: url("./assets/klogo_short.png") ;});
  }

  & .nav-collapse {
    display: flex;
    flex: auto;
    background-color: @panelBgColor;

    .medium(
      {display: none; &.show {margin-top: @navBarHeight; position: fixed;
        display: block; height: 100vh; width: 100vw; left: 0; top: 0;}}
    );
  }

  a {
    font-weight: bold;
    color: white;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
