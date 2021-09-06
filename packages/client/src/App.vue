<template>
  <div id="app">
    <div class="content-wrap flex flex-column flex-no-wrap">
      <status-bar
        v-if="$game.authenticated"
        v-show="!hideTopBar"
        ref="statusBar"
      ></status-bar>
      <div class="flex flex-center section-name flex-no-wrap" v-show="title">
        <div class="section-decor"></div>
        <div class="section-title font-size-20">{{ $t(title) }}</div>
        <div class="section-decor right"></div>
      </div>

      <keep-alive :exclude="['Rankings']">
        <router-view
          class="content dummy-height flex flex-no-wrap flex-column"
          v-if="showContent"
        />
        <div v-else class="full-flex flex flex-center"></div>
      </keep-alive>

      <div class="footer flex-item-center">
        <span
          v-show="showBackMenu"
          class="back-button"
          @click="handleBackButton"
        ></span>
        <portal-target
          class="footer-container flex flex-end flex-items-center full-flex"
          name="footer"
          :multiple="true"
        ></portal-target>
        <div
          class="footer-container flex flex-end full-flex"
          v-if="footers.length > 0"
        >
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
          <router-link
            class="flex flex-center n-inner"
            to="/home"
            id="home-btn"
          >
            <span class="menu-icon home pointer-events-none">
              <div class="marker-pos">
                <HomeMarker></HomeMarker>
              </div>
            </span>
            <span class="menu-title">{{ $t("menu-home") }}</span>
          </router-link>

          <LockedSection class="flex flex-center n-inner" section="character">
            <router-link
              class="flex flex-center n-inner w"
              to="/character"
              id="char-btn"
            >
              <span class="menu-icon character pointer-events-none">
                <div class="marker-pos">
                  <CharacterMarker />
                </div>
              </span>
              <span class="menu-title">{{ $t("menu-character") }}</span>
            </router-link>
          </LockedSection>

          <LockedSection class="flex flex-center n-inner" section="castle">
            <router-link
              class="flex flex-center n-inner w"
              to="/castle"
              id="b-castle"
            >
              <span class="menu-icon crafting pointer-events-none">
                <div class="marker-pos">
                  <CastleMarker></CastleMarker>
                </div>
              </span>
              <span class="menu-title">{{ $t("menu-castle") }}</span>
            </router-link>
          </LockedSection>

          <LockedSection class="flex flex-center n-inner" section="shop">
            <router-link
              to="/summon"
              class="flex flex-center n-inner w"
              id="b-shop"
            >
              <span class="menu-icon shop pointer-events-none">
                <div class="marker-pos">
                  <ShopMarker></ShopMarker>
                </div>
              </span>
              <span class="menu-title">{{ $t("menu-shop") }}</span>
            </router-link>
          </LockedSection>

          <!-- <router-link  class="flex flex-center n-inner" to="/">
            <span class="menu-icon guild pointer-events-none"></span>
            <span class="menu-title">{{$t("menu-guild")}}</span>
          </router-link>-->

          <router-link class="flex flex-center n-inner" to="/social/chat">
            <span class="menu-icon chat pointer-events-none"></span>
            <span class="menu-title">{{ $t("menu-chat") }}</span>
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
    <DailyQuestCompleteNotification />
    <LoadingNotification />
    <RaceFinishedNotification />
    <SectionLockedNotification />

    <Tutorial ref="tutorial" v-if="$game.authenticated" />

    <dialogs-wrapper transition-name="fade" />
    <AudioPlayer ref="audio" :volume="0.3" />
    <audio ref="sound_ui" type="audio/mpeg" preload="auto" />
    <audio ref="sound_stinger" type="audio/mpeg" preload="auto" />
    <audio ref="sound_fx" type="audio/mpeg" preload="auto" />
    <SoundEffect ref="taskFx" :files="['quest_complete1']" channel="stinger" />
  </div>
</template>

<script>
import SoundEffect from "@/components/SoundEffect.vue";
import AudioPlayer from "@/components/AudioPlayer.vue";
import StatusBar from "./components/StatusBar.vue";
import CharacterMarker from "@/components/Markers/Character/CharacterMarker.vue";
import ShopMarker from "@/components/Markers/Shop/ShopMarker.vue";
import CastleMarker from "@/components/Markers/Castle/CastleMarker.vue";
import HomeMarker from "@/components/Markers/Home/HomeMarker.vue";
import Vue from "vue";
import RaidStatusNotification from "@/components/Notifications/RaidStatusNotification.vue";
import LoadingNotification from "@/components/Notifications/LoadingNotification.vue";
import DailyQuestCompleteNotification from "@/components/Notifications/DailyQuestCompleteNotification.vue";
import RaceFinishedNotification from "@/components/Notifications/RaceFinishedNotification.vue";
import SectionLockedNotification from "@/components/Notifications/SectionLockedNotification.vue";
import LockedSection from "@/components/LockedSection.vue";
import Tutorial from "@/views/Tutorial/Tutorial.vue";
import MusicButton from "@/components/MusicButton.vue";
import Events from "@/../../knightlands-shared/events";
import PromptMixin from "@/components/PromptMixin.vue";
import { create } from "vue-modal-dialogs";

import LevelUp from "@/views/LevelUp.vue";
const ShowLevelUp = create(LevelUp, "data");

import SelectClass from "@/views/SelectClass/SelectClass.vue";
const ShowSelectClass = create(SelectClass);

import ChangeNickname from "@/views/Character/ChangeNickname.vue";
const ShowChangeNickname = create(ChangeNickname);

import ItemsReceived from "@/components/ItemsReceived.vue";
const ShowItemsReceived = create(ItemsReceived, "items", "soft", "hard");

import ChangeAvatar from "@/views/Character/Avatars/ChangeAvatar.vue";
const ShowChangeAvatar = create(ChangeAvatar);

export default {
  components: {
    MusicButton,
    SoundEffect,
    AudioPlayer,
    Tutorial,
    CharacterMarker,
    HomeMarker,
    StatusBar,
    RaidStatusNotification,
    LoadingNotification,
    DailyQuestCompleteNotification,
    SectionLockedNotification,
    RaceFinishedNotification,
    ShopMarker,
    CastleMarker,
    LockedSection
  },
  mixins: [PromptMixin],
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
    this.$game.on(Events.PurchaseComplete, context => {
      context = context.context;
      if (context.item) {
        ShowItemsReceived([context]);
      } else {
        ShowItemsReceived([], 0, context.hard);
      }
      this.$store.commit("shop/setPurchaseComplete");
    });

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
  mounted() {
    Vue.prototype.$tutorial = this.$refs.tutorial;
  },
  async created() {
    Vue.prototype.$app = this;

    this.$game.on("change-class", async () => {
      if (this.selectionShown) {
        return;
      }

      this.selectionShown = true;
      await ShowSelectClass();
      this.selectionShown = false;
    });

    this.$game.on("level-up", async args => {
      await ShowLevelUp(args);
    });

    this.$router.beforeEach(async (to, from, next) => {
      let playDefault = true;
      for (const m of to.matched) {
        if (m.meta.music) {
          this.$refs.audio.play(m.meta.music);
          playDefault = false;
        }
      }

      if (playDefault) {
        this.$refs.audio.play("menu");
      }

      if (!this.$game.authenticated) {
        next();
        return;
      }

      const redirect = await this.$store.dispatch("tutorial/getRedirectUrl", {
        route: to
      });
      next(redirect);
    });

    this.$router.beforeResolve((to, from, next) => {
      this.hideTopBar = to.matched.some(record => record.meta.noTopBar);

      next();
    });

    // show login page when user signed out
    this.$game.on(this.$game.SignUp, async () => {
      await this.$game.notifications.init();

      if (!this.$game.character.nickname || !this.$game.character.nickname.v) {
        await ShowChangeNickname();
      }

      if (!this.$game.character.avatar) {
        await ShowChangeAvatar();
      }
    });
    this.$game.on(this.$game.SignedOut, this.redirectToLogin.bind(this));

    this.$game.on(this.$game.Disconnected, () => {
      if (this.$route.matched.some(record => record.meta.requiresAuth)) {
        if (!this.$game.authenticated) {
          this.redirectToLogin();
        }
      }
    });

    // this.$game.on(this.$game.ConnectionError, async () => {
    //   this.$game.disconnect();

    //   await this.showPrompt(
    //     this.$t("prompt-conn-t"),
    //     this.$t("prompt-conn-m"),
    //     [
    //       {
    //         type: "green",
    //         title: this.$t("btn-retry"),
    //         response: true
    //       }
    //     ]
    //   );

    //   this.$game.connect();
    // });

    this.$game.on(this.$game.Ready, () => {
      if (this.$route.matched.some(record => record.meta.requiresAuth)) {
        if (!this.$game.authenticated) {
          this.redirectToLogin();
        }
      }
      this.loading = false;
    });

    this.$nextTick(() => {
      this.showBackButton();
    });

    this.$game.connect();

    this.$game.on("task_complete", () => {
      this.$refs.taskFx.play();
    });
  },
  methods: {
    getSoundChannel(id) {
      return this.$refs[`sound_${id}`];
    },
    getStatusBar() {
      return this.$refs.statusBar;
    },
    handleToggleDrawer() {
      this.$refs.drawerLayout.toggle();
    },
    showBackButton() {
      let params = this.$route.path.match(/[^//]+/g);
      this.showBackMenu = params ? params.length >= 2 : false;

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
        name: "login",
        query: { url: this.$route.fullPath }
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
@import "./style/sprites.less";
@import "./style/ui.less";
@import "./views/Army/army.less";
</style>

<style lang="scss">
@import "~pretty-checkbox/src/pretty-checkbox.scss";
@import "~vue-virtual-scroller/dist/vue-virtual-scroller.css";
</style>

<style lang="less" scoped>
@import (reference) "./style/common.less";
@import (reference) "./style/ui.less";

@footerColor: #112b46;

.content-wrap {
  height: 100%;
}

.content-wrapper {
  align-items: stretch;
}

@sectionPaddingRight: 4rem;
@sectionPaddingTop: 0.4rem;

.marker-pos {
  position: absolute;
  top: 0rem;
  right: 0rem;
  z-index: 10;
}

.section-name {
  pointer-events: none;
  background-color: @footerColor;
  height: 5rem;
  width: 200%;
  transform: translateX(-50%);
  right: -50%;
  position: relative;
  margin: 0;

  & > .section-decor {
    .title_decor;
    max-height: 50%;
    width: 10rem !important;

    &.right {
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

@backButtonWidth: 4.2125rem;
@backButtonHeight: 4.2125rem;
@footerBottomPadding: 0.5rem;
.back-button {
  display: block;
  cursor: pointer;
  width: @backButtonWidth !important;
  height: @backButtonHeight !important;
  // .mobile({width: @backButtonWidth/2; height: @backButtonHeight / 2});
  margin-left: 1.2rem;
  .button_back;

  &:active {
    .button_back_active;
  }
}

.vue-notification-group {
  min-width: ~"max(25vw, 50rem)";
  max-width: 55vh;

  .mobile({min-width: unset; max-width: unset; width: 100%;});
}

.footer {
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
  flex: 1;
}

.root-menu {
  width: 100%;
  justify-content: space-between;
  background-color: @footerColor;
}

#nav {
  display: flex;
  width: 100%;
  align-items: center;
  height: 5rem;

  a {
    background-image: url("./assets/ui/tabbar_bg.png");
    background-size: 100% 100%;
  }

  .n-inner {
    display: inherit !important;
    text-align: center;
    position: relative;
    height: 100%;
    width: calc(100% - 30px);

    &.w {
      width: 100%;
    }

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
      width: 6rem !important;
      height: 6rem !important;
      transition: all 0.2s ease;
      position: absolute;
      bottom: -0.5rem;
      z-index: 1;
    }

    .home {
      .tabbar_home;
    }

    .crafting {
      .tabbar_castle;
    }

    .character {
      .tabbar_character;
    }

    .shop {
      .tabbar_shop;
    }

    .chat {
      .tabbar_chat;
    }

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
      border-image-slice: 50 59 27 59 fill;
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
  min-width: ~"max(25vw, 50rem)";
  margin: 0 auto;
  // background: @backgroundMainColor;
  // background: linear-gradient(0deg, #371c35 0%, #261034 100%);
  .mobile({min-width: unset; max-width: unset; width: 100%;});
  // .tablet({width: 60rem;});
  // .laptop_small({width: 60rem;});
  // .laptop({width: 60rem;});
  // width: 60rem;
  max-width: 55vh;
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
  line-height: 1.3;
  box-sizing: content-box;

  .fourk_screen({font-size: 8px;});
  .mobile({font-size: 6px;});
  .laptop({font-size: 8px;});

  background: @backgroundOutsideColor;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

body {
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);
  min-height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  min-height: calc(var(--vh, 1vh) * 100);
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
  & > div,
  span {
    margin-right: 0.3rem;
  }
}
</style>
