<template>
  <div class="login-container flex flex-center">
    <div class="screen-background"></div>

    <input
      id="input"
      type="email"
      :placeholder="$t('mail-pl')"
      aria-invalid="true"
      class="input email-input white-font margin-bottom-2"
      aria-describedby="input-email"
      v-model="email"
    />

    <PromisedButton :promise="request" size="big" @click="signIn">{{
      $t("btn-signin")
    }}</PromisedButton>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import PromisedButton from "@/components/PromisedButton.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

export default {
  components: { PromisedButton },
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
    // if (window.location.search.includes("magic_credential")) {
    //   this.performRequest(this.$game.trySignIn());
    // } else {
    //   if (this.$game.authenticated) {
    //     this.redirectToNextPage();
    //   }
    // }

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
      this.request = this.performRequest(this.$game.signIn(this.email));

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

.email-input {
  text-align: center;
  font-size: 2rem;
  line-height: 24px;
  padding: 6px 151px;
  border-radius: 0;
  float: left;
  border: none;
  box-shadow: none;
  background-color: #194368;
}
</style>
