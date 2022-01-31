<template>
  <div class="screen-content">
    <div class="full-flex width-100" v-bar>
      <div
        class="width-100 height-100 dummy-height flex flex-column flex-no-wrap"
      >
        <div class="option-name font-size-25 text-align-center padding-1">
          <div class="text-align-left">
            Choose payment option
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
            <Loot
              :item="3214"
              :quantity="shopItem.quantity"
              :inventory="false"
              :itemSlotClasses="'lunar-lantern-slot'"
              :class="'margin-bottom-1'"
            >
            </Loot>

            <CustomButton
              :disabled="balance.hard < shopItem.hardPrice"
              type="grey"
              @click="chooseOption(shopIndex, 'hard')"
              :class="'margin-bottom-1'"
            >
              <div class="flex flex-center">
                <IconWithValue iconClass="icon-premium">{{
                  shopItem.hardPrice
                }}</IconWithValue>
              </div>
            </CustomButton>

            <CustomButton
              :disabled="balance.flesh < shopItem.fleshPrice"
              type="grey"
              @click="chooseOption(shopIndex, 'flesh')"
            >
              <div class="flex flex-center">
                <IconWithValue iconClass="icon-dkt">{{
                  shopItem.fleshPrice
                }}</IconWithValue>
              </div>
            </CustomButton>
          </div>
        </div>

        <div
          class="option-name font-size-25 text-align-center padding-1"
          v-if="shopIndex !== null"
        >
          <div class="text-align-left">
            Choose elements to buy
          </div>
        </div>

        <div
          class="option-items width-100 flex flex-center flex-space-evenly padding-1"
          v-if="shopIndex !== null"
        >
          <div
            class="flex flex-column flex-center margin-1 quantity-item"
            v-for="(entry, index) in itemsCount"
            :key="'quantity-item-' + entry.item"
          >
            <Loot
              :item="entry.item"
              :inventory="false"
              :itemSlotClasses="'lunar-lantern-slot'"
              :class="'margin-bottom-1'"
            >
            </Loot>
            <NumericValue
              :id="'num_value_' + index"
              :showMax="false"
              :noExtra="true"
              :rowStyle="{ 'align-items': 'center' }"
              :btnStyle="{ width: '1em', height: '1em' }"
              :value="getStatValue(index)"
              :decreaseCondition="entry.quantity > 0"
              :increaseCondition="canIncrease"
              @inc="increaseAttribute(index)"
              @dec="decreaseAttribute(index)"
            />
          </div>
        </div>

        <div
          class="font-size-22 flex flex-center flex-column margin-bottom-2"
          v-if="shopIndex !== null"
        >
          Items left: {{ itemsLeft }}
        </div>

        <div class="flex flex-center flex-column " v-if="shopIndex !== null">
          <div class="font-size-22 flex flex-center margin-bottom-1">
            FLESH balance:
            <IconWithValue iconClass="icon-dkt" class="margin-left-1">{{
              balance.flesh
            }}</IconWithValue>
          </div>
          <div class="font-size-22 margin-bottom-3 flex flex-center">
            Shinies balance:
            <IconWithValue iconClass="icon-premium" class="margin-left-1">{{
              balance.hard
            }}</IconWithValue>
          </div>
          <CustomButton
            :disabled="!!itemsLeft || !enoughCurrency"
            type="green"
            @click="purchase"
          >
            Purchase&nbsp;<IconWithValue :iconClass="iconClasses[currency]">{{
              price
            }}</IconWithValue>
          </CustomButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
import Loot from "@/components/Loot.vue";
import meta from "@/lunar_meta.json";
import IconWithValue from "@/components/IconWithValue.vue";
import CustomButton from "@/components/Button.vue";
import NumericValue from "@/components/NumericValue.vue";

const BASE_ELEMENTS = [3214, 3215, 3216, 3217];

export default {
  components: {
    Loot,
    IconWithValue,
    CustomButton,
    NumericValue
  },
  mixins: [ActivityMixin, NetworkRequestErrorMixin],
  data() {
    return {
      options: meta.shop,
      shopIndex: null,
      itemsCount: [
        { item: BASE_ELEMENTS[0], quantity: 1 },
        { item: BASE_ELEMENTS[1], quantity: 1 },
        { item: BASE_ELEMENTS[2], quantity: 1 },
        { item: BASE_ELEMENTS[3], quantity: 1 }
      ],
      currency: null,
      iconClasses: {
        flesh: "icon-dkt",
        hard: "icon-premium"
      }
    };
  },
  computed: {
    price() {
      return this.options[this.shopIndex][this.currency + "Price"];
    },
    currentOption() {
      return this.options[this.shopIndex];
    },
    enoughCurrency() {
      return this.balance[this.currency] >= this.price;
    },
    balance() {
      return {
        hard: this.$game.hardCurrency,
        flesh: this.$game.dkt
      };
    },
    currentSum() {
      let currentSum = 0;
      for (let i = 0; i < 4; i++) {
        currentSum += this.itemsCount[i].quantity;
      }
      return currentSum;
    },
    itemsLeft() {
      return this.currentOption.quantity - this.currentSum;
    },
    canIncrease() {
      return this.currentSum < this.currentOption.quantity;
    }
  },
  methods: {
    getStatValue(index) {
      return this.itemsCount[index].quantity;
    },
    increaseAttribute(index) {
      this.itemsCount[index].quantity++;
    },
    decreaseAttribute(index) {
      this.itemsCount[index].quantity--;
    },
    chooseOption(shopIndex, currency) {
      this.shopIndex = shopIndex;
      this.currency = currency;

      this.itemsCount.forEach(entry => {
        entry.quantity = this.currentOption.quantity / 4;
      });
    },
    async purchase() {
      await this.performRequestNoCatch(
        this.$store.dispatch("lunar/purchase", {
          shopIndex: this.shopIndex,
          itemsCount: _.fromPairs(
            this.itemsCount.map(entry => [entry.item, entry.quantity])
          ),
          currency: this.currency
        })
      );
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
/*.option-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  justify-items: center;
  grid-gap: 2rem;
}*/
.option-name {
  background: rgba(0, 0, 0, 0.5);
}
.quantity-item {
  min-width: 18%;
}
</style>
