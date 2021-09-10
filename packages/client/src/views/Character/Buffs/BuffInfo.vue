<template>
  <UserDialog @close="$close">
    <template v-slot:content>
      <ItemInfo :item="itemData">
        <template v-slot:stats>
          <div
            v-if="timer.timeLeft > 0"
            class="flex width-100 flex-space-evenly font-size-20 green-title margin-top-2 margin-bottom-2"
          >
            <span>{{ $t("buff-timer-left") }}</span>
            <span>{{ timer.value }}</span>
          </div>
        </template>
      </ItemInfo>
    </template>

    <template v-if="hasItem" v-slot:footer>
      <CustomButton type="yellow" @click="use">{{
        $t("btn-use")
      }}</CustomButton>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import ItemInfo from "@/components/ItemInfo.vue";
import CustomButton from "@/components/Button.vue";
import Timer from "@/timer";

export default {
  props: ["buff", "item"],
  components: { UserDialog, ItemInfo, CustomButton },
  data: () => ({
    timer: new Timer(true)
  }),
  mounted() {
    if (this.buff) {
      this.timer.timeLeft =
        this.buff.duration - (this.$game.now - this.buff.applyTime) / 1000;
    }
  },
  methods: {
    use() {
      this.$close(true);
    }
  },
  computed: {
    hasItem() {
      return (
        this.item ||
        this.$game.inventory.getItemByTemplate(this.buff.template).id != -1
      );
    },
    itemData() {
      let item =
        this.item || this.$game.inventory.getItemByTemplate(this.buff.template);
      return item.id != -1 ? item : this.buff.template;
    }
  }
};
</script>
