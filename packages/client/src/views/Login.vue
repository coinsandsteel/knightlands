<template>
  <div class="login-container flex flex-center margin-top-5">
    <div class="screen-background"></div>

    <MusicButton class="sounds-btn"></MusicButton>

    <img class="logo-intro" src="../assets/logo_beta.svg" />

    <input
      id="input"
      type="email"
      :placeholder="$t('mail-pl')"
      aria-invalid="true"
      class="input email-input white-font margin-bottom-2"
      aria-describedby="input-email"
      v-model="email"
      v-on:keyup.enter="onEnter"
    />

    <PromisedButton :promise="request" size="big" @click="signIn">{{
      $t("btn-signin")
    }}</PromisedButton>

    <div class="flex flex-center margin-top-5">
      <img
        class="pointer discord"
        @click="signWith('discord')"
        src="../assets/ui/Discord-Logo-Color.svg"
      />
      <img
        class="pointer"
        @click="signWith('google')"
        src="../assets/ui/btn_google_light_normal_ios.svg"
      />
    </div>

    <Locale/>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import PromisedButton from "@/components/PromisedButton.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import MusicButton from "@/components/MusicButton.vue";
import Locale from "@/components/Locale.vue";

export default {
  components: { PromisedButton, MusicButton, Locale },
  mixins: [AppSection, NetworkRequestErrorMixin],
  data: () => ({
    request: null,
    email: ""
  }),
  created() {
    this.title = "t-login";
    this.cb = this.redirectToNextPage.bind(this);
    this.$game.on(this.$game.SignUp, this.cb);
  },
  destroyed() {
    this.$game.off(this.$game.SignUp, this.cb);
  },
  mounted() {
    if (window.location.search.includes("provider")) {
      this.performRequest(this.$game.trySignIn());
    }
  },
  methods: {
    onEnter() {
      this.signIn();
    },
    redirectToNextPage() {
      let url = this.$route.query.url;
      if (typeof url == "string" && !url.includes("login")) {
        this.$router.replace(url);
      } else {
        this.$router.replace({ name: "home" });
      }
    },
    async signIn() {
      this.request = this.performRequest(
        this.$game.signIn(this.email, this.$route.query.referral)
      );

      try {
        await this.request;
      } catch (e) {
        console.error(e);
      }
    },
    async signWith(provider) {
      this.request = this.performRequest(this.$game.signInWith(provider));

      try {
        await this.request;
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  width: 100%;
}

.email-input {
  text-align: center;
  font-size: 2rem;
  line-height: 24px;
  padding: 6px;
  border-radius: 0;
  float: left;
  width: 80%;
  border: none;
  box-shadow: none;
  background-color: #194368;
}

.discord {
  background-color: white;
  border-radius: 2px;
  padding: 10px;
  width: 40px;
  height: 40px;
}

.logo-intro {
  max-width: 90%;
  margin-bottom: 5rem;
}
</style>
