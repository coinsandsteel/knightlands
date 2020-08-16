<template>
  <div id="app">
    <div class="content-wrap flex flex-column flex-no-wrap">
      <status-bar v-if="$game.authenticated" v-show="!hideTopBar" ref="statusBar"></status-bar>
      <div class="flex flex-center section-name flex-no-wrap" v-show="title">
        <div class="section-decor"></div>
        <div class="section-title font-size-20">{{$t(title)}}</div>
        <div class="section-decor right"></div>
      </div>

      <keep-alive exclude="gold-exchange">
        <router-view class="content dummy-height flex flex-no-wrap flex-column" v-if="showContent" />
      </keep-alive>

      <div class="footer flex-item-center">
        <div class="bg"></div>
        <span v-show="showBackMenu" class="back-button" @click="handleBackButton"></span>
        <portal-target class="footer-container flex flex-end width-100" name="footer" :multiple="true"></portal-target>
        <div class="footer-container flex flex-end full-flex">
          <component
            v-for="(footer, index) in footers"
            :key="index"
            :is="footer"
            v-bind="footerProps[index]"
          ></component>
        </div>
      </div>
      <div class="root-menu flex" v-if="$game.authenticated">
        <div id="nav">
          <router-link class="flex flex-center" to="/home">
            <span class="menu-icon home pointer-events-none"></span>
            <span class="menu-title">{{$t("menu-home")}}</span>
          </router-link>

          <router-link class="flex flex-center" to="/character">
            <span class="menu-icon character pointer-events-none"></span>
            <span class="menu-title">{{$t("menu-character")}}</span>
          </router-link>

          <router-link class="flex flex-center" to="/castle">
            <span class="menu-icon crafting pointer-events-none"></span>
            <span class="menu-title">{{$t("menu-castle")}}</span>
          </router-link>

          <router-link class="flex flex-center" to="/summon">
            <span class="menu-icon shop pointer-events-none"></span>
            <span class="menu-title">{{$t("menu-shop")}}</span>
          </router-link>

          <!-- <router-link  class="flex flex-center" to="/">
            <span class="menu-icon guild pointer-events-none"></span>
            <span class="menu-title">{{$t("menu-guild")}}</span>
          </router-link>-->

          <router-link class="flex flex-center" to="/social/chat">
            <span class="menu-icon chat pointer-events-none"></span>
            <span class="menu-title">{{$t("menu-chat")}}</span>
          </router-link>
        </div>
      </div>
    </div>

    <portal-target
      class="pointer-events-none absolute-stretch text-align-left"
      name="overlay"
      id="overlay"
    ></portal-target>

    <RaidStatusNotification />

    <LoadingNotification />

    <dialogs-wrapper></dialogs-wrapper>
  </div>
</template>

<script>
import StatusBar from "./components/StatusBar.vue";
// import { disableBodyScroll } from "body-scroll-lock";
import Game from "./game";
import { Promise } from "q";
import Vue from "vue";
import BlockchainFactory from "./blockchain/blockchainFactory";
import RaidStatusNotification from "./components/Notifications/RaidStatusNotification.vue";
import LoadingNotification from "./components/Notifications/LoadingNotification.vue";

import { create } from "vue-modal-dialogs";

import LevelUp from "@/views/LevelUp.vue";
const ShowLevelUp = create(LevelUp);

import SelectClass from "@/views/SelectClass/SelectClass.vue";
const ShowSelectClass = create(SelectClass);

export default {
  components: {
    StatusBar,
    RaidStatusNotification,
    LoadingNotification
  },
  data() {
    return {
      showBackMenu: false,
      title: null,
      loading: true,
      ready: false,
      footers: [],
      footerProps: [],
      hideTopBar: false
    };
  },
  sectionBackButton: null,
  beforeCreate() {
    this.$on("section", section => {
      this.sectionBackButton = section.handleBackButton;
      if (section.title) {
        this.title = section.title;
      }
    });

    this.$on("footer", (component, props) => {
      if (component) {
        this.footers.push(component);
        this.footerProps.push(props);
      } else {
        this.footers = [];
        this.footerProps = [];
      }
    });
  },
  computed: {
    showContent() {
      if (this.$route.meta.skipReady) {
        return !this.loading;
      }

      return !this.loading && this.$game.ready && this.$game.authenticated;
    }
  },
  async created() {
    Vue.prototype.$app = this;
    Vue.prototype.$game = new Game(this.$store);

    this.$game.on("change-class", async () => {
      if (this.selectionShown) {
        return;
      }

      this.selectionShown = true;
      await ShowSelectClass();
      this.selectionShown = false;
    });

    this.$game.on("level-up", async () => {
      await ShowLevelUp();
    });

    this.$router.beforeResolve((to, from, next) => {
      this.hideTopBar = to.matched.some(record => record.meta.noTopBar);
      next();
    });

    // check metas
    this.$router.beforeEach((to, from, next) => {
      if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!this.$game.authenticated) {
          next({
            name: "login",
            query: { url: to.path }
          });
          return;
        }
      }
      next();
    });

    // show login page when user signed out
    this.$game.on(this.$game.SignedOut, this.redirectToLogin.bind(this));

    // if disconnection due to corrupted sign up or other server side issue - open login
    this.$game.on(this.$game.Disconnected, () => {
      if (this.$route.matched.some(record => record.meta.requiresAuth)) {
        if (!this.$game.authenticated) {
          this.redirectToLogin();
        }
      }
    });

    this.$game.on(this.$game.Ready, () => {
      if (this.$route.matched.some(record => record.meta.requiresAuth)) {
        if (!this.$game.authenticated) {
          this.redirectToLogin();
        }
      }
      this.loading = false;
    });

    // fetch initial data
    this.$game.on(this.$game.SignUp, async () => {
      await this.$game.updateUserData();

      this.loading = false;
      if (this.$route.name == "login") {
        this.$router.replace({ name: "character" });
      }
    });

    this.$nextTick(() => {
      this.showBackButton();
    });

    this._blockchainClient = BlockchainFactory(this.$store.state.blockchain);

    try {
      Vue.prototype.$game.blockchain = this._blockchainClient;
      await this._blockchainClient.init();

      // wait for wallet to be unlocked
      await new Promise(resolve => {
        let tries = 0;
        let interval;
        interval = setInterval(() => {
          // if (tries++ > 10) {
          //   // redirect to login page
          //   if (this.$route.matched.some(record => record.meta.requiresAuth)) {
          //     if (!this.$game.authenticated) {
          //       this.redirectToLogin();
          //     }
          //   }
          //   this.loading = false;
          //   clearInterval(interval);
          //   return;
          // }

          // if (this.$game.walletReady()) {
          clearInterval(interval);
          this.$game.connect();
          // }
        }, 200);
      });
    } catch (e) {
      this.redirectToLogin();
    }
  },
  methods: {
    getStatusBar() {
      return this.$refs.statusBar;
    },
    handleToggleDrawer() {
      this.$refs.drawerLayout.toggle();
    },
    showBackButton() {
      // hamburger menu only supports 1st level path
      let params = this.$route.path.match(/[^//]+/g);
      this.showBackMenu = params ? params.length >= 2 : false;

      // override if route requires only hamburger menu
      if (this.$route.matched.some(record => record.meta.noBackButton)) {
        this.showBackMenu = false;
      }
    },
    handleBackButton() {
      if (!this.sectionBackButton || !this.sectionBackButton()) {
        let split = this.$route.path.split("/");

        while (split[split.length - 1] == "") {
          split.pop();
        }

        split.pop();

        this.$router.replace(split.join("/"));
      }
    },
    redirectToLogin() {
      this.ready = false;
      this.loading = false;
      this.$router.push({
        name: "login"
      });
    },
    async updateUserData() {
      await this.$game.updateUserData();
      this.loading = false;
    }
  },
  watch: {
    $route(to, from) {
      this.footer = undefined;
      this.showBackButton();
    }
  }
};
</script>

<style lang="less">
@import "./style/common.less";
@import "./views/Army/army.less";
</style>

<style lang="scss">
@import "~pretty-checkbox/src/pretty-checkbox.scss";
@import "~vue-virtual-scroller/dist/vue-virtual-scroller.css";
</style>

<style lang="less" scoped>
@import (reference) "./style/common.less";

@footerColor: #245178;

.content-wrap {
  height: 100%;
}

@sectionPaddingRight: 4rem;
@sectionPaddingTop: 0.4rem;

.section-name {
  pointer-events: none;
  background-color: #112c47;
  width: 200%;
  transform: translateX(-50%);
  right: -50%;
  position: relative;
  margin: 0;

  & > .section-decor {
    background-image: url("./assets/ui/title_decor.png");
    height: 100%;
    width: 6rem;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;

    &.right {
      background-image: url("./assets/ui/title_decor.png");
      transform: scaleX(-1);
    }
  }

  & > .section-title {
    text-transform: uppercase;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    background-image: rgb(134, 144, 157);
    background-image: linear-gradient(
      0deg,
      rgba(134, 144, 157, 1) 0%,
      rgba(245, 246, 247, 1) 100%
    );
    font-weight: 900;
    margin-left: 1rem;
    margin-right: 1rem;
  }
}

.logo {
  background-image: url("./assets/logo.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: 80%;
}

@backButtonWidth: 6rem;
@backButtonHeight: 4.2125rem;
@footerBottomPadding: 0.5rem;
.back-button {
  display: block;
  cursor: pointer;
  width: @backButtonWidth;
  height: @backButtonHeight;
  // .mobile({width: @backButtonWidth/2; height: @backButtonHeight / 2});
  left: 1.2rem;
  background: url("./assets/ui/button_back.png") no-repeat;
  background-size: contain;

  &:active {
    background: url("./assets/ui/button_back_active.png") no-repeat;
    background-size: contain;
  }
}

.footer {
  flex-basis: 0;
  display: flex;
  position: relative;
  justify-content: flex-start;
  align-items: center;
  background-color: @footerColor;
  padding-bottom: @footerBottomPadding;

  & > * {
    position: relative;
  }
}

.content {
  min-height: 0; // fix for overflowed content inside flex item
  flex: 1 1;
}

.root-menu {
  justify-content: space-between;
  background-color: @footerColor;
}

#nav {
  display: flex;
  width: 100%;
  align-items: center;
  height: 5rem;

  a {
    height: 100%;
    width: calc(100% - 30px);
    text-align: center;
    position: relative;

    .menu-title {
      font-size: 1.5rem;
      position: absolute;
      bottom: 0;
      opacity: 0;
      text-transform: uppercase;
      transition: all 0.2s ease;
    }

    .menu-icon {
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      width: 6rem;
      height: 6rem;
      transition: all 0.2s ease;
      position: absolute;
      bottom: -0.5rem;
      z-index: 1;
    }

    .home {
      background-image: url("./assets/ui/tabbar_home.png");
    }

    .crafting {
      background-image: url("./assets/ui/tabbar_castle.png");
    }

    .character {
      background-image: url("./assets/ui/tabbar_character.png");
    }

    .shop {
      background-image: url("./assets/ui/tabbar_shop.png");
    }

    .chat {
      background-image: url("./assets/ui/tabbar_chat.png");
    }

    background-image: url("./assets/ui/tabbar_bg.png");
    background-size: 100% 100%;

    &.router-link-active {
      background-image: unset;

      .menu-title {
        transition-delay: 0.2s;
        opacity: 1;
      }

      .menu-icon {
        bottom: 0.7rem;
        z-index: 2;
      }

      border-image-source: url("./assets/ui/tabbar_selected.png");
      border-image-slice: 60 59 27 59 fill;
      border-image-width: 20px 20px 20px 20px;
      border-image-outset: 0px 0px 0px 0px;
      border-image-repeat: stretch stretch;
    }
  }
}

#app {
  overflow: hidden;
  position: relative;
  color: white;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 35.625rem;
  margin: 0 auto;
  // background: @backgroundMainColor;
  // background: linear-gradient(0deg, #371c35 0%, #261034 100%);
  .mobile({min-width: unset; max-width: unset; width: 100%;});
  // .tablet({width: 60rem;});
  // .laptop_small({width: 60rem;});
  // .laptop({width: 60rem;});
  // width: 60rem;
  width: 55vh;
}

.home-link {
  background-size: cover;
  background-repeat: no-repeat;
}
</style>

<style lang="less">
@import (reference) "./style/common.less";

html {
  font-family: "Brandon", sans-serif;
  font-size: 8px;
  line-height: 1.2;
  box-sizing: content-box;

  .mobile({font-size: 6px;});
  .tablet({font-size: 7px;});
  .laptop_small({font-size: 8px;});
  .laptop({font-size: 8px;});
  .laptop({font-size: 8px;});
  .fourk_screen({font-size: 10px;});

  @media only screen and (max-width: 320px) {
    font-size: 6px;
  }

  background: @backgroundOutsideColor;
  background-image: url("./assets/ui/pattern.jpg");
  background-repeat: repeat;
  background-size: 20%;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

body {
  height: 100vh;
  min-height: 100vh;
  margin: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a,
a:visited {
  display: block;
  text-decoration: none;
  color: white;
}

.footer-container {
  height: 100%;
  * > {
    margin-right: 0.3rem;
  }
}
</style>
