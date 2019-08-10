<template>
  <div class="flex flex-column full-flex width-100">
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
    loading: false
  }),
  mounted() {
    this.fetchInventory();
  },
  methods: {
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
          this.softCurrency = response.body.softCurrency;
          this.hardCurrency = response.body.hardCurrency;
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


