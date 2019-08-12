<template>
  <div>
    <div class="flex flex-center height-100" v-if="!account || signin">
      <div class="font-size-30" v-if="!account">{{$t('unlock_wallet')}}</div>

      <div v-else-if="signin">
        <GridLoader color="#fde648" :size="15" margin="1px" v-if="loading" />
        <custom-button type="yellow" @click="claimWelcomeGift" v-else>Claim Welcome Gift</custom-button>
      </div>
    </div>

    <div class="flex flex-column full-flex width-100" v-else>
      <div class="currency-bar flex flex-center flex-space-evenly">
        <icon-with-value iconClass="icon-gold">{{softCurrency}}</icon-with-value>
        <icon-with-value iconClass="icon-premium">{{hardCurrency}}</icon-with-value>
      </div>

      <div class="flex full-flex dummy-height margin-top-3" v-if="items.length > 0">
        <div v-bar class="width-100">
          <loot-container :items="items" :inventory="true" @hint="showHint"></loot-container>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LootHint from "@/components/LootHint.vue";
import CustomButton from "@/components/Button.vue";
import AppSection from "@/AppSection";
import { create as CreateDialog } from "vue-modal-dialogs";
import IconWithValue from "@/components/IconWithValue.vue";
import Prompt from "@/components/Prompt.vue";
import LootContainer from "@/components/LootContainer.vue";
import Config from "@/config";
import WelcomeGift from "./WelcomeGift.vue";

const ShowWelcome = CreateDialog(WelcomeGift, ...WelcomeGift.props);
const ShowPrompt = CreateDialog(Prompt, ...Prompt.props);
const ShowHint = CreateDialog(LootHint, "item", "equip", "unequip", "actions");

export default {
  mixins: [AppSection],
  components: { IconWithValue, CustomButton, LootContainer },
  created() {
    this.title = "Inventory";
  },
  data: () => ({
    softCurrency: 0,
    items: [],
    hardCurrency: 0,
    loading: false,
    signin: false,
    welcomeToken: "",
    account: undefined
  }),
  mounted() {
    this.account = this.$game.account;
    if (this.account) {
      this.checkWelcomePackageStatus();
    }
  },
  watch: {
    ready() {
      if (this.account) {
        this.checkWelcomePackageStatus();
      }
    }
  },
  methods: {
    async claimWelcomeGift() {
      let signedMessage = await this.$game.signMessage(
        `${this.welcomeToken}${this.$game.account}`
      );

      try {
        this.loading = true;
        let response = await this.$http.post(
          `${Config.httpEndpoint}/claim/welcomePackage`,
          {
            wallet: this.$game.account,
            signature: signedMessage
          }
        );

        if (response.body.items) {
          await ShowWelcome(response.body.softCurrency, response.body.items);
        }

        this.signin = false;

        await this.fetchInventory();
      } catch (exc) {
        await ShowPrompt(
          "Ooops!",
          "Somethins is wrong. Contact us at support@knightlands.com.",
          [
            {
              type: "green",
              title: "OK",
              response: true
            }
          ]
        );
      }

      this.loading = false;
    },
    async checkWelcomePackageStatus() {
      let response = await this.$http.get(
        `${Config.httpEndpoint}/check/welcomeStatus`,
        {
          params: {
            wallet: this.$game.account
          }
        }
      );

      if (response.body.ok) {
        response = await this.$http.post(
          `${Config.httpEndpoint}/get/welcomeKey`,
          {
            wallet: this.$game.account
          }
        );
        this.welcomeToken = response.body.token;
        this.signin = true;
      } else {
        await this.fetchInventory();
      }
    },
    async fetchInventory() {
      try {
        this.loading = true;
        let response = await this.$http.get(
          `${Config.httpEndpoint}/inventory`,
          {
            params: {
              wallet: this.$game.account
            }
          }
        );

        if (response.body.items) {
          this.softCurrency = response.body.softCurrency || 0;
          this.hardCurrency = response.body.hardCurrency || 0;
          this.items = response.body.items;
        }
      } catch (exc) {
        console.log(exc);

        await ShowPrompt("Ooops!", "Something went wrong...", [
          {
            type: "green",
            title: "OK",
            response: true
          }
        ]);
      }
    },
    async showHint(item) {
      if (!item) {
        return;
      }

      await ShowHint(item, !item.equipped, item.equipped, { equip: false });
    }
  }
};
</script>

<style lang="less" scoped>
.currency-bar {
  background-color: #333e52;
  border-bottom: 0.25rem solid #928690;
  height: 4rem;
  width: 100%;
}

.dummy-height {
  min-height: 0;
}
</style>


