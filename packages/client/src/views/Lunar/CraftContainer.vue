<template>
  <div
    class="craft-container margin-left-auto margin-right-auto padding-top-4 padding-bottom-4 relative-position"
  >
    <div class="relative-position">
      <div class="absolute-position width-100">
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
          <CustomButton type="green" class="inline-block">
            {{ $t("btn-combine") }}
          </CustomButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
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

<style lang="less" scoped>
.craft-container {
  width: 400px;
  max-width: 90%;
}
.craft-container > div {
  background-image: url("/images/lunar/element-crafting-background.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding-top: 75%;
}
.craft-container > div > div {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
