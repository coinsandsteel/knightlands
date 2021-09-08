<template>
  <div class="login-container flex flex-center">
    <div class="screen-background"></div>

    <MusicButton class="sounds-btn"></MusicButton>

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
      <PromisedButton
        type="grey"
        :promise="request"
        size="big"
        @click="discord"
      >
        <div class="flex flex-center">
          <span class="discord"></span>
        </div>
      </PromisedButton>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import PromisedButton from "@/components/PromisedButton.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import MusicButton from "@/components/MusicButton.vue";

export default {
  components: { PromisedButton, MusicButton },
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
    async discord() {
      this.request = this.performRequest(this.$game.signInWith("discord"));

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
  background-image: url("../assets/ui/discord.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 3.5rem;
  width: 3.5rem;
}
</style>
