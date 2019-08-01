<template>
  <div class="login-container flex flex-center">
    <div v-if="!$game.walletReady()">Unlock your Tronlink</div>
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
      this.$router.replace({ path: "/character" });
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

