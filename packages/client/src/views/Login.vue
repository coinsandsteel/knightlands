<template>
  <div class="login-container flex flex-center">
    <div class="screen-background"></div>
    <div class="font-size-20" v-if="!$game.hasWallet()">
      {{ $t("no-wallet") }}
    </div>
    <div class="font-size-20" v-else-if="!$game.walletReady()">
      {{ $t("unlock-wallet") }}
    </div>
    <PromisedButton :promise="request" size="big" v-else @click="signIn">{{
      $t("btn-signin")
    }}</PromisedButton>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import PromisedButton from "@/components/PromisedButton.vue";

export default {
  components: { PromisedButton },
  mixins: [AppSection],
  data: () => ({
    request: null
  }),
  created() {
    this.title = "Sign in";
    this.cb = this.redirectToNextPage.bind(this);
    this.$game.on(this.$game.SignUp, this.cb);
  },
  destroyed() {
    this.$game.off(this.$game.SignUp, this.cb);
  },
  mounted() {
    if (this.$game.authenticated) {
      this.redirectToNextPage();
    }
  },
  methods: {
    redirectToNextPage() {
      let url = this.$route.query.url;
      if (typeof url == "string" && !url.includes("login")) {
        this.$router.replace(url);
      } else {
        this.$router.replace({ name: "home" });
      }
    },
    async signIn() {
      this.request = this.$game.signIn();

      try {
        await this.request;
      } catch (e) {
        console.error(e);
      }

      this.redirectToNextPage();
    }
  }
};
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  width: 100%;
}
</style>
