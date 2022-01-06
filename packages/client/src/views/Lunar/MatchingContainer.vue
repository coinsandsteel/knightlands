<template>
  <div class="matching-container width-100 padding-bottom-4 relative-position">
    <div class="flex flex-center margin-top-4">
      <Loot />
    </div>
    <div class="flex flex-center margin-top-4">
      <Loot
        v-for="(item, index) in filteredItems"
        :key="index"
        :item="item"
        class="margin-left-2 margin-right-2"
        @hint="removeItem(item)"
      />
    </div>
    <div class="text-center margin-top-4">
      <!-- <CustomButton type="yellow" class="inline-block margin-right-2">
        {{ $t("btn-search") }}
      </CustomButton> -->
      <CustomButton type="green" class="inline-block">
        {{ $t("btn-match") }}
      </CustomButton>
    </div>
    <div
      class="absolute-top-right height-100 flex flex-column flex-justify-center"
    >
      <CustomButton type="grey" class="inline-block margin-right-1">
        {{ $t("advanced") }}
      </CustomButton>
      <CustomButton
        type="grey"
        class="inline-block margin-right-2 margin-top-1"
      >
        {{ $t("expert") }}
      </CustomButton>
      <CustomButton
        type="grey"
        class="inline-block margin-right-2 margin-top-1"
      >
        {{ $t("NFT") }}
      </CustomButton>
    </div>
  </div>
</template>
<script>
// import Element from "@/views/Lunar/Element.vue";
import Loot from "@/components/Loot.vue";
import CustomButton from "@/components/Button.vue";
export default {
  components: {
    // Element,
    Loot,
    CustomButton
  },
  props: {
    maxSelectedItems: { type: Number, required: true },
    selectedItems: { type: Array, required: true }
  },
  data() {
    return {
      items: [null, null, null]
    };
  },
  computed: {
    filteredItems() {
      return [
        ...this.selectedItems,
        ...Array(this.maxSelectedItems).fill(null)
      ].slice(0, this.maxSelectedItems);
    }
  },
  methods: {
    removeItem(item) {
      if (!item) {
        return;
      }
      this.$emit("item-removed", item);
    }
  }
};
</script>
