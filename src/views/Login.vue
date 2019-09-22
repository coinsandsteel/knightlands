<template>
  <div class="login-container flex flex-center">
    <div class="font-size-20" v-if="!$game.hasWallet()">{{$t("no-wallet")}}</div>
    <div class="font-size-20" v-else-if="!$game.walletReady()">{{$t("unlock-wallet")}}</div>
    <PromisedButton :promise="request" size="big" v-else @click="signIn">{{$t("btn-signin")}}</PromisedButton>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import PromisedButton from "@/components/PromisedButton.vue";

export default {
  components: { PromisedButton },
  mixins: [AppSection],
  data: ()=>({
    request: null
  }),
  created() {
    this.title = "Sign in";
    this.$game.on(this.$game.SignUp, () => {
      this.redirectToNextPage();
    });
  },
  mounted() {
    if (this.$game.authenticated) {
      this.redirectToNextPage();
    }
  },
  methods: {
    redirectToNextPage() {
      let url = this.$route.query.url;
      if (typeof url == "string" && !url.contains("login")) {
        this.$router.replace(url);
      } else {
        this.$router.replace({ name: "character" });
      }
    },
    signIn() {
      this.request = this.$game.signIn();
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

