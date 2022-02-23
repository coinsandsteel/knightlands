<template>
  <div class="screen-content">
    <div class="full-flex width-100" v-bar>
      <div
        class="width-100 height-100 dummy-height flex flex-column flex-no-wrap"
      >
        <div class="option-name font-size-25 text-align-center padding-1">
          <div class="text-align-left">
            Choose pack
          </div>
        </div>

        <div
          class="option-items width-100 flex flex-center flex-space-evenly padding-1"
        >
          <div
            class="flex flex-column flex-center margin-1 padding-1"
            v-for="(shopItem, shopIndex) in options"
            :key="'option-' + shopIndex"
          >
            <div>
              <MarchGold
                class="march-gold--with-background margin-bottom-1"
                :value="shopItem.quantity"
              />

              <CustomButton type="grey" @click="purchase(shopIndex)">
                <div class="flex flex-center">${{ shopItem.price }}</div>
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { create } from "vue-modal-dialogs";
import * as march from "@/../../knightlands-shared/march";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
import ItemsReceived from "@/components/ItemsReceived.vue";
import MarchGold from "@/views/March/MarchGold.vue";

export default {
  components: {
    MarchGold
  },
  mixins: [ActivityMixin, NetworkRequestErrorMixin],
  data() {
    return {
      options: march.SHOP,
      shopIndex: null
    };
  },
  methods: {
    async purchase(shopIndex) {
      await this.performRequestNoCatch(
        this.$store.dispatch("march/purchase", {
          shopIndex
        })
      );

      const ShowDialog = create(ItemsReceived, "items", "marchGold");
      ShowDialog([], this.options[shopIndex].quantity);
    }
  }
};
</script>
<style scoped lang="less">
.v-bar-fix {
  & > div {
    overflow: auto !important;
  }
}
</style>
