<template>
  <UserDialog title="Daily gift???" @close="collectRewards">
    <template v-slot:content>
      <!-- tips -->
      <div class="font-size-20">
        {{ $t("Come back every day to collect your rewards???") }}
      </div>
      <!-- mystery lanterns -->
      <div
        class="march-daily-rewards margin-top-5 margin-left-3 margin-right-3"
      >
        <!-- <Loot
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
        </Loot> -->
        <MarchDailyReward
          v-for="(reward, index) in dailyRewards"
          :key="index"
          :index="index"
          :current="reward.active"
          :collected="reward.collected"
          :reward="reward"
        ></MarchDailyReward>
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
// import UserDialog from "@/components/UserDialog.vue";
// import CustomButton from "@/components/Button.vue";
// import Loot from "@/components/Loot.vue";
// import CheckedIcon from "@/views/Lunar/Checked.vue";
import MarchDailyReward from "@/views/March/MarchDailyReward.vue";

export default {
  // components: { UserDialog, CustomButton, Loot, CheckedIcon },
  mixins: [NetworkRequestErrorMixin],
  components: { MarchDailyReward },
  data() {
    return {};
  },
  computed: {
    ...mapState("march", ["dailyRewards"])
    // mysteryItems() {
    //   const result = [];
    //   for (let i = 0; i < this.dailyRewards.length; i++) {
    //     const day = { ...this.dailyRewards[i] };
    //     day.itemSlotClasses = "lunar-lantern-slot";
    //     day.iconClasses = "mystery-lantern";
    //     day.isCustomElement = true;
    //     day.count = day.quantity;
    //     result.push(day);
    //   }
    //   return result;
    // }
  },
  methods: {
    async collectRewards() {
      await this.performRequestNoCatch(
        this.$store.dispatch("march/collectDailyReward")
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
.march-daily-rewards {
  display: grid;
  grid-template-columns: repeat(5, minmax(8rem, 1fr));
  justify-items: center;
}
</style>
