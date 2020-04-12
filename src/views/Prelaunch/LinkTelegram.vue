<template>
  <div class="flex flex-center">
    <div class="font-size-30" v-if="!$game.walletReady()">Unlock your wallet</div>

    <div v-else>
      <GridLoader color="#fde648" :size="15" margin="1px" v-if="loading" />
      <custom-button type="yellow" @click="linkAccount" v-else>Link Telegram to your TRON wallet.</custom-button>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import AppSection from "@/AppSection.vue";
import { create as CreateDialog } from "vue-modal-dialogs";
import WelcomeGift from "./WelcomeGift.vue";
import Prompt from "@/components/Prompt.vue";
import Config from "@/config";

const ShowWelcome = CreateDialog(WelcomeGift, ...WelcomeGift.props);
const ShowPrompt = CreateDialog(Prompt, ...Prompt.props);

export default {
  mixins: [AppSection],
  props: ["token", "user"],
  data: () => ({
    loading: false
  }),
  components: { CustomButton },
  created() {
    this.title = "Link Telegram";
  },
  methods: {
    async linkAccount() {
      let signedMessage = await this.$game.signMessage(
        `${this.token}${this.user}`
      );

      try {
        this.loading = true;
        let response = await this.$http.post(
          `${Config.httpEndpoint}/link/telegram`,
          {
            user: this.user,
            address: this.$game.account,
            signature: signedMessage
          }
        );

        if (response.body.items) {
          await ShowWelcome(response.body.softCurrency, response.body.items);
        } else {
          await ShowPrompt(
            "Success!",
            "Your telegram is connected to Knightlands.",
            [
              {
                type: "green",
                title: "Continue to inventory",
                response: true
              }
            ]
          );
        }
      } catch (exc) {
        console.log(exc);

        await ShowPrompt("Ooops!", "Link is expired!", [
          {
            type: "green",
            title: "Continue to inventory",
            response: true
          }
        ]);
      }

      this.$router.replace({ name: "inventory" });
      this.loading = false;
    }
  }
};
</script>

