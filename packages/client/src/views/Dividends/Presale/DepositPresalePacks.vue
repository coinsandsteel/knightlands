<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <div class="flex flex-center height-100" v-if="tokens.length == 0">
      <CustomButton type="yellow" @click="scan">{{
        $t("scan-presale")
      }}</CustomButton>
    </div>

    <div class="width-100" v-bar>
      <div class="cards">
        <CardElement
          v-for="data in tokens"
          :key="data.tokenId"
          :data="data"
          @deposit="deposit"
          @submit="submit"
        ></CardElement>
      </div>
    </div>
  </div>
</template>

<script>
import Blockchains from "@/../../knightlands-shared/blockchains";
import Events from "@/../../knightlands-shared/events";
import CustomButton from "@/components/Button.vue";
import AppSection from "@/AppSection.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import CardElement from "./CardElement.vue";

import ConnectWallet from "@/views/Account/ConnectWallet.vue";
import { create } from "vue-modal-dialogs";

const ShowWallet = create(ConnectWallet);
const POLYGON_CHAIN = Blockchains.Polygon;

export default {
  mixins: [AppSection, NetworkRequestErrorMixin, PromptMixin],
  components: { CustomButton, CardElement },
  name: "DepositPresalePacks",
  created() {
    this.title = "w-presale";
  },
  data: () => ({
    tokens: []
  }),
  mounted() {
    this._handler = async () => {
      this.refreshTokens();
    };
    this.$game.on(Events.FounderPackAcquired, this._handler);
  },
  destroyed() {
    this.$game.off(Events.FounderPackAcquired, this._handler);
  },
  methods: {
    async scan() {
      await ShowWallet({
        chain: POLYGON_CHAIN
      });

      await this.refreshTokens();

      if (this.tokens.length == 0) {
        await this.showPrompt(
          this.$t("pr-no-tokens"),
          this.$t("pr-no-tokens-d"),
          [
            {
              type: "green",
              title: this.$t("btn-ok"),
              response: true
            }
          ]
        );
      }
    },
    async deposit(tokenId) {
      const { depositId } = await this.performRequest(
        this.$game.depositFounderPacks(
          this.$game.blockchain.getAddress(),
          POLYGON_CHAIN,
          [tokenId]
        )
      );

      await this.refreshTokens();

      await this.submit(tokenId, depositId);
    },
    async refreshTokens() {
      this.tokens = await this.performRequest(
        this.$game.fetchFoundersPresale(this.$game.blockchain.getAddress())
      );

      this.tokens.sort((a, b) => {
        let aS = 0;
        if (a.pending) {
          aS = 3;
        } else if (a.canDeposit) {
          aS = 2;
        } else {
          aS = 1;
        }

        let bS = 0;
        if (b.pending) {
          bS = 3;
        } else if (b.canDeposit) {
          bS = 2;
        } else {
          bS = 1;
        }

        return bS - aS;
      });
    },
    async submit(tokenId, depositId) {
      const isAllowed = await this.performRequest(
        this.$game.blockchain.isAllowedAllForPresale()
      );
      if (!isAllowed) {
        const result = await this.showPrompt(
          this.$t("pr-no-allow"),
          this.$t("pr-no-allow-d"),
          [
            {
              type: "green",
              title: this.$t("btn-ok"),
              response: true
            },
            {
              type: "red",
              title: this.$t("btn-cancel"),
              response: false
            }
          ]
        );

        if (result === false) {
          return;
        }

        await this.performRequest(this.$game.blockchain.allowAllForPresale());
      }

      await this.performRequest(
        this.$game.blockchain.depositPresalePacks(depositId, [tokenId])
      );
    }
  }
};
</script>
