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
          :key="`mystery-lantern-${itemIndex}`"
          :inventory="false"
          :itemSlotClasses="
            item && item.itemSlotClasses ? item.itemSlotClasses : null
          "
          :iconClasses="item && item.iconClasses ? item.iconClasses : null"
          :selected="item.active"
          class="mystery-lantern-loot"
          @click="hadleDayClick(itemIndex)"
        >
          <CheckedIcon v-if="item.collected" class="checked-icon absolute" />
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
            :key="`reward-lantern-${itemIndex}`"
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
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import { mapState } from "vuex";
import UserDialog from "@/components/UserDialog.vue";
import CustomButton from "@/components/Button.vue";
import Loot from "@/components/Loot.vue";
import CheckedIcon from "@/views/Lunar/Checked.vue";
import { RARITY_CLASS_MAP } from "@/../../knightlands-shared/lunar";

export default {
  components: { UserDialog, CustomButton, Loot, CheckedIcon },
  mixins: [NetworkRequestErrorMixin],
  data() {
    return {};
  },
  computed: {
    ...mapState({
      dailyRewards: state => state.lunar.dailyRewards
    }),
    mysteryItems() {
      const result = [];
      for (let i = 0; i < this.dailyRewards.length; i++) {
        const day = { ...this.dailyRewards[i] };
        day.itemSlotClasses = "lunar-lantern-slot";
        day.iconClasses = "mystery-lantern";
        day.isCustomElement = true;
        day.count = day.quantity;
        result.push(day);
      }
      return result;
    },

    rewardItems() {
      const result = [];
      let index = this.dailyRewards.findIndex(({ active }) => active);
      const currentDailyReward = this.dailyRewards[index];
      for (let i = 0; i < currentDailyReward.items.length; i++) {
        const item = { ...currentDailyReward.items[i] };
        const info = this.$game.itemsDB.getTemplate(item.template);
        const lanternNumber = info.caption[info.caption.length - 1];
        item.info = info;
        item.id = item._id;
        (item.iconClasses = `${
          RARITY_CLASS_MAP[item.rarity]
        } basic-lantern${lanternNumber}`),
          (item.itemSlotClasses = "lunar-lantern-slot");
        item.isCustomElement = true;
        item.count = item.quantity;
        result.push(item);
      }
      return result;
    }
  },
  methods: {
    async collectRewards() {
      await this.performRequestNoCatch(
        this.$store.dispatch("lunar/collectDailyReward")
      );
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
