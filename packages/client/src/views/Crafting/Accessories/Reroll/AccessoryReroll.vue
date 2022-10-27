<template>
  <div class="screen-content padding-top-1">
    <div class="screen-background"></div>
    <SoundEffect ref="fx" :files="['item_reroll']" channel="fx" />

    <div class="flex flex-column flex-no-wrap relative item-info-container">
      <Title class="margin-bottom-1" :class="`rarity-${item.rarity}`">{{
        $t(caption)
      }}</Title>

      <ItemHeader
        :item="item"
        :showLocked="false"
        class="margin-left-1 margin-right-1"
      >
        <template v-slot:level-bar>
          <slot name="level-bar"></slot>
        </template>
      </ItemHeader>

      <div class="color-panel-1 margin-top-1">
        <ItemProperties
          :item="item"
          :onlyStats="false"
          :accOptions="{ prevProps: canCancel, showRange: true }"
        ></ItemProperties>
      </div>

      <div v-show="canCancel">
        <Title :stackTop="true" :stackBottom="true">{{
          $t("acc-new-prop")
        }}</Title>
        <div class="color-panel-2">
          <ItemProperties
            :item="item"
            :onlyStats="false"
            :accOptions="{ showRange: true }"
          ></ItemProperties>
        </div>
      </div>

      <slot name="footer"></slot>
    </div>

    <CraftingIngridient class="margin-top-2" :ingridient="ingridient" />

    <div class="flex flex-center margin-top-2">
      <CustomButton type="yellow" :disabled="!canReroll" @click="reroll"
        >{{ $t("btn-reroll-acc") }}
        <IconWithValue iconClass="icon-gold">{{ price }}</IconWithValue>
      </CustomButton>

      <CustomButton type="red" :disabled="!canCancel" @click="cancel"
        >{{ $t("btn-reroll-can") }}
      </CustomButton>
    </div>
  </div>
</template>

<script>
import SoundEffect from "@/components/SoundEffect.vue";
import AppSection from "@/AppSection.vue";
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import CraftAccessoriesMeta from "@/metadata/craft_accessories";
import ItemProperties from "@/components/Item/ItemProperties.vue";
import ItemHeader from "@/components/Item/ItemHeader.vue";
import Title from "@/components/Title.vue";
import CraftingIngridient from "@/components/CraftingIngridient.vue";

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  props: ["itemId"],
  components: {
    CraftingIngridient,
    SoundEffect,
    ItemProperties,
    CustomButton,
    IconWithValue,
    ItemHeader,
    Title
  },
  created() {
    this.title = "btn-reroll-acc";
  },
  computed: {
    caption() {
      return this.$game.itemsDB.getName(this.item);
    },
    item() {
      return this.$game.inventory.getItem(this.itemId);
    },
    priceSettings() {
      let priceSettings = CraftAccessoriesMeta.reroll.find(
        x => x.rarity == this.$game.itemsDB.getRarity(this.item)
      );
      return priceSettings;
    },
    price() {
      let rerolls = this.item.rerolls || 1;
      return Math.floor(
        Math.pow(rerolls, this.priceSettings.base) * this.priceSettings.scale
      );
    },
    ingridient() {
      return {
        itemId: this.priceSettings.shardItem,
        quantity: this.priceSettings.shards
      };
    },
    canReroll() {
      return this.price <= this.$game.softCurrency;
    },
    canCancel() {
      let canReroll = true;
      const length = this.item.properties.length;
      for (let i = 0; i < length; ++i) {
        if (!this.item.properties[i].prevValue) {
          canReroll = false;
          break;
        }
      }

      return canReroll;
    }
  },
  methods: {
    async reroll() {
      await this.performRequest(this.$game.rerollAccessory(this.itemId));
      this.$refs.fx.play();
    },
    async cancel() {
      await this.performRequest(this.$game.rollbackAccessory(this.itemId));
    }
  }
};
</script>
