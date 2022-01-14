<template>
  <UserDialog title="lunar-daily-rewards-title" @close="collectRewards">
    <template v-slot:content>
      <!-- tips -->
      <div class="font-size-20">{{ $t("lunar-daily-rewards-tips") }}</div>
      <!-- mystery lanterns -->
      <div
        class="flex flex-justify-center margin-left-auto margin-right-auto margin-2"
      >
        <Loot
          v-for="(item, itemIndex) in mysteryItems"
          :id="`i-${item.template}`"
          :item="item"
          :key="itemIndex"
          :inventory="false"
          :itemSlotClasses="
            item && item.itemSlotClasses ? item.itemSlotClasses : null
          "
          :iconClasses="item && item.iconClasses ? item.iconClasses : null"
          :selected="item.isCurrent"
          class="mystery-lantern-loot"
        >
          <CheckedIcon v-if="item.isCollected" class="checked-icon absolute" />
        </Loot>
      </div>
      <!-- daily rewards -->
      <div class="daily-rewards padding-top-1 padding-bottom-2">
        <div class="font-size-20">{{ $t("lunar-daily-rewards-message") }}</div>
        <div
          class="flex flex-justify-center margin-left-auto margin-right-auto margin-top-1"
        >
          <Loot
            v-for="(item, itemIndex) in rewardItems"
            :id="`i-${item.template}`"
            :item="item"
            :key="itemIndex"
            :inventory="false"
            :itemSlotClasses="
              item && item.itemSlotClasses ? item.itemSlotClasses : null
            "
            :iconClasses="item && item.iconClasses ? item.iconClasses : null"
            class="lantern-loot"
          />
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CustomButton type="green" @click="collectRewards"
        >{{ $t("claim-daily-bonus") }}
      </CustomButton>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import CustomButton from "@/components/Button.vue";
import Loot from "@/components/Loot.vue";
import CheckedIcon from "@/views/Lunar/Checked.vue";

export default {
  components: { UserDialog, CustomButton, Loot, CheckedIcon },
  data() {
    return {};
  },
  computed: {
    mysteryItems() {
      const newItem = () => {
        return {
          id: result.length + 1,
          itemSlotClasses: "lunar-lantern-slot",
          iconClasses: "mystery-lantern",
          isCustomElement: true,
          isCollected: false,
          isCurrent: false,
          count: 3
        };
      };
      const result = [];
      for (let i = 0; i < 7; i++) {
        const item = { ...newItem(), isCollected: i < 4, isCurrent: i === 4 };
        result.push(item);
      }

      return result;
    },

    rewardItems() {
      const newItem = () => {
        const index = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
        return {
          id: result.length + 1,
          itemSlotClasses: "lunar-lantern-slot",
          iconClasses: "basic-lantern" + index,
          isCustomElement: true,
          count: 4
        };
      };
      const result = [];
      for (let i = 0; i < 5; i++) {
        const item = newItem();
        result.push(item);
      }

      return result;
    }
  },
  methods: {
    collectRewards() {
      this.$close();
    }
  }
};
</script>

<style lang="less" scoped>
.mystery-lantern-loot,
.lantern-loot {
  margin: 0 2px 2px;
}
.daily-rewards {
  background: #2f7285;
  margin-bottom: -2rem;
}
.checked-icon {
  top: 2px;
  left: 2px;
  color: #80fa67;
  width: 15px;
  height: 15px;
}
</style>
