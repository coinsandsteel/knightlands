<template>
  <UserDialog :title="$t('april-daily-rewards-title')" @close="collectRewards">
    <template v-slot:content>
      <!-- tips -->
      <div class="font-size-20">
        {{ $t("april-daily-rewards-tips") }}
      </div>
      <div
        class="april-daily-rewards margin-top-5 margin-left-3 margin-right-3"
      >
        <AprilDailyReward
          v-for="(reward, index) in dailyRewards"
          :key="index"
          :index="index"
          :current="reward.active"
          :collected="reward.collected"
          :reward="reward"
        ></AprilDailyReward>
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
import { mapGetters } from "vuex";
import * as april from "@/../../knightlands-shared/april";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import AprilDailyReward from "@/views/April/AprilDailyReward.vue";

export default {
  mixins: [NetworkRequestErrorMixin],
  components: { AprilDailyReward },
  computed: {
    ...mapGetters("april", ["dailyRewards"])
  },
  methods: {
    async collectRewards() {
      this.$store.dispatch("april/claimReward", {
        type: april.REWARD_TYPE_DAILY
      });
      this.$close();
    }
  }
};
</script>

<style lang="less" scoped>
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
.april-daily-rewards {
  display: grid;
  grid-template-columns: repeat(5, minmax(8rem, 1fr));
  justify-items: center;
}
</style>
