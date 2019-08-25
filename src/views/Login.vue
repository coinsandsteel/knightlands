<template>
  <div class="login-container flex flex-center">
    <div class="font-size-20" v-if="!$game.walletReady()">Unlock your wallet</div>
    <custom-button size="big" v-else @click="signIn">Sign in</custom-button>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import CustomButton from "@/components/Button.vue";

export default {
  components: { CustomButton },
  mixins: [AppSection],
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
      if (url) {
        this.$router.replace(url);
      } else {
        this.$router.replace({ name: "character" });
      }
    },
    signIn() {
      this.$game.signIn();
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

