<template>
  <div>
    <div class="flex flex-center height-100" v-if="!ready || signin">
      <div class="font-size-30" v-if="!ready">{{$t('unlock_wallet')}}</div>

      <div v-else-if="signin">
        <GridLoader color="#fde648" :size="15" margin="1px" v-if="loading" />
        <custom-button type="yellow" @click="claimWelcomeGift" v-else>Claim Royal Giveaway</custom-button>
      </div>
    </div>

    <div class="flex flex-column flex-no-wrap full-flex width-100 height-100" v-else>
      <tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab" />

      <keep-alive>
        <div v-if="currentTab == InventoryTab" class="flex flex-column flex-full dummy-height">
          <PresaleFeed></PresaleFeed>

          <div class="currency-bar digit-font flex flex-center flex-space-evenly">
            <icon-with-value iconClass="icon-gold">{{Math.floor(softCurrency*100)/100}}</icon-with-value>
            <icon-with-value iconClass="icon-premium">{{Math.floor(hardCurrency*100)/100}}</icon-with-value>
            <icon-with-value iconClass="icon-dkt">{{Math.floor(dkt*100)/100}}</icon-with-value>
          </div>

          <div class="flex full-flex dummy-height" v-if="items.length > 0">
            <div v-bar class="width-100">
              <loot-container :items="items" :inventory="true" @hint="showHint"></loot-container>
            </div>
          </div>
        </div>
        <presale-chests v-if="currentTab == ChestsTab"></presale-chests>
        <Referrals v-if="currentTab == ReferralsTab"></Referrals>
      </keep-alive>
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
import Tabs from "@/components/Tabs.vue";
import PresaleChests from "./PresaleChests.vue";
import Referrals from "./Referrals.vue";
import PresaleFeed from "./PresaleFeed.vue";

const ShowWelcome = CreateDialog(WelcomeGift, ...WelcomeGift.props);
const ShowPrompt = CreateDialog(Prompt, ...Prompt.props);
const ShowHint = CreateDialog(LootHint, "item", "equip", "unequip", "actions");

const InventoryTab = "inventory";
const ChestsTab = "open-chests";
const ReferralsTab = "referrals";

export default {
  mixins: [AppSection],
  components: {
    IconWithValue,
    CustomButton,
    LootContainer,
    Tabs,
    PresaleChests,
    Referrals,
    PresaleFeed
  },
  created() {
    this.title = "Inventory";
  },
  data: () => ({
    softCurrency: 0,
    items: [],
    hardCurrency: 0,
    dkt: 0,
    loading: false,
    signin: false,
    welcomeToken: "",
    tabs: [
      { title: "inventory", value: InventoryTab },
      { title: "chests", value: ChestsTab },
      { title: "referrals", value: ReferralsTab }
    ],
    currentTab: InventoryTab,
    InventoryTab,
    ChestsTab,
    ReferralsTab
  }),
  mounted() {
    this.fetchInventory();

    this.$game.on(this.$game.WalletChanged, () => {
      window.location.reload();
    });
  },
  watch: {
    ready() {
      this.fetchInventory();
    },
    currentTab() {
      if (this.currentTab == this.InventoryTab) {
        this.fetchInventory();
      }
    }
  },
  computed: {
    ready() {
      return this.$game.walletReady();
    }
  },
  methods: {
    switchTab(newTab) {
      this.currentTab = newTab;
    },
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
    async fetchInventory() {
      try {
        this.loading = true;
        let response = await this.$http.get(
          `${Config.httpEndpoint}/get/inventory`,
          {
            params: {
              wallet: this.$game.account
            }
          }
        );

        if (response.body.items) {
          this.softCurrency = response.body.softCurrency || 0;
          this.hardCurrency = response.body.hardCurrency || 0;
          this.dkt = response.body.dkt || 0;
          this.items = response.body.items;
          this.items.sort((a, b) => {
            let sortingFactorA = this.$game.itemsDB.getRarityAsNumber(
              a.template
            );
            let sortingFactorB = this.$game.itemsDB.getRarityAsNumber(
              b.template
            );

            if (sortingFactorA == sortingFactorB) {
              sortingFactorA = a.id;
              sortingFactorB = b.id;
            }

            if (sortingFactorA > sortingFactorB) {
              return -1;
            }

            if (sortingFactorA < sortingFactorB) {
              return 1;
            }

            return 0;
          });
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


