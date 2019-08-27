<template>
  <div id="app">
    <loading-screen :loading="loading"></loading-screen>
    <div class="content-wrap flex flex-column flex-no-wrap">
      <status-bar v-if="$game.authenticated"></status-bar>
      <div class="flex">
        <div class="flex flex-center section-name font-size-25">
          <span class="relative section-title">{{title}}</span>
          <div class="section-fill"></div>
        </div>
      </div>
      <keep-alive>
        <router-view class="content flex flex-no-wrap flex-column" v-if="!loading" />
      </keep-alive>
      <div class="footer flex-item-center">
        <span v-show="showBackMenu" class="back-button" @click="handleBackButton"></span>
        <div class="footer-container flex flex-end" style="flex: 1 1">
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
          <router-link to="/home"></router-link>
          <router-link to="/character"></router-link>
          <router-link to="/raid"></router-link>
        </div>
      </div>
    </div>

    <portal-target class="overlay" name="overlay"></portal-target>

    <RaidStatusNotification />

    <dialogs-wrapper></dialogs-wrapper>
  </div>
</template>

<script>
import StatusBar from "./components/StatusBar.vue";
import { disableBodyScroll } from "body-scroll-lock";
import Game from "./game";
import { Promise } from "q";
import Vue from "vue";
import BlockchainFactory from "./blockchain/blockchainFactory";
import RaidStatusNotification from "./components/Notifications/RaidStatusNotification.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";

export default {
  components: { StatusBar, RaidStatusNotification, LoadingScreen },
  data() {
    return {
      showBackMenu: false,
      title: null,
      loading: true,
      ready: false,
      footers: [],
      footerProps: []
    };
  },
  sectionBackButton: null,
  beforeCreate() {
    this.$on("section", section => {
      this.sectionBackButton = section.handleBackButton;
      this.title = section.title;
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
  async created() {
    Vue.prototype.$app = this;
    Vue.prototype.$game = new Game(this.$store);
    // check if the page requires authentication
    this.$router.beforeEach(async (to, from, next) => {
      if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!this.$game.authenticated) {
          next({
            name: "login",
            query: { url: this.$route.path }
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
      await this.updateUserData();
      this.loading = false;
      this.ready = true;
      if (this.$route.name == "login") {
        this.$router.replace({ name: "character" });
      }
    });

    this.$nextTick(() => {
      this.showBackButton();
    });

    this._blockchainClient = BlockchainFactory(this.$store.state.blockchain);

    try {
      await this._blockchainClient.init();
      Vue.prototype.$game.blockchain = this._blockchainClient;

      // wait for wallet to be unlocked
      await new Promise(resolve => {
        let tries = 0;
        let interval;
        interval = setInterval(() => {
          if (tries++ > 5) {
            // redirect to login page
            if (this.$route.matched.some(record => record.meta.requiresAuth)) {
              if (!this.$game.authenticated) {
                this.redirectToLogin();
              }
            }
            this.loading = false;
            clearInterval(interval);
            return;
          }

          if (this.$game.walletReady()) {
            clearInterval(interval);
            this.$game.connect();
          }
        }, 100);
      });
    } catch {
      // no wallet installed
      this.redirectToLogin();
    }
  },
  methods: {
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
</style>

<style lang="scss">
@import "~pretty-checkbox/src/pretty-checkbox.scss";
</style>

<style lang="less" scoped>
@import (reference) "./style/common.less";

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
}

.content-wrap {
  height: 100%;
}

@sectionPaddingRight: 4rem;
@sectionPaddingTop: 0.4rem;

.section-name {
  margin: 0 0 1rem 0;

  & > .section-fill {
    width: @sectionPaddingRight;
    height: calc(100%);

    background: url("./assets/ui/title_bg3.png");
    background-size: contain;
    background-position: left;
    background-repeat: no-repeat;
  }

  & > .section-title {
    text-align: left;
    pointer-events: none;

    min-width: 20rem;
    // padding-top: @sectionPaddingTop;
    // padding-right: @sectionPaddingRight;
    padding-left: 1.2rem;
    color: #281326;
    position: relative;
    background-color: #928691;
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
  bottom: @footerBottomPadding;
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
  padding: 0 1rem @footerBottomPadding 1rem;
}

.content {
  min-height: 0; // fix for overflowed content inside flex item
  flex: 1 1;
}

.root-menu {
  justify-content: space-between;
  background-color: #403f48;
  height: 32px;
}

#nav {
  display: flex;
  width: 100%;
  align-items: center;

  a {
    width: calc(100% - 30px);
    line-height: 32px;
    text-align: center;
    height: 32px;

    display: flex;
    justify-content: flex-start;

    .icon {
      height: 32px;
      width: 32px;
    }

    &:hover {
      background-color: #502d46;
    }

    &.router-link-active {
      background-color: #5f3653;
    }
  }
}

#app {
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
  background: @backgroundMainColor;
  .mobile({min-width: unset; max-width: unset; width: 100%;});
  .tablet({width: 48rem;});
  .laptop_small({width: 48rem;});
  .laptop({width: 48rem;});
  width: 48rem;
}

.home-link {
  background-size: cover;
  background-repeat: no-repeat;
}
</style>

<style lang="less">
@import (reference) "./style/common.less";

html {
  font-family: "Alef", sans-serif;
  font-size: 12px;
  line-height: 1.2;
  box-sizing: border-box;

  .mobile({font-size: 8px;});
  .tablet({font-size: 9px;});
  .laptop_small({font-size: 9px;});
  .laptop({font-size: 10px;});

  @media only screen and (max-width: 320px) {
    font-size: 7px;
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
  * > {
    margin-right: 0.3rem;
  }
}
</style>
