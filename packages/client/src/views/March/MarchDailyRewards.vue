<template>
  <UserDialog :title="$t('march-daily-rewards-title')" @close="collectRewards">
    <template v-slot:content>
      <!-- tips -->
      <div class="font-size-20">
        {{ $t("march-daily-rewards-tips") }}
      </div>
      <div
        class="march-daily-rewards margin-top-5 margin-left-3 margin-right-3"
      >
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
import MarchDailyReward from "@/views/March/MarchDailyReward.vue";

export default {
  mixins: [NetworkRequestErrorMixin],
  components: { MarchDailyReward },
  computed: {
    ...mapState("march", ["dailyRewards"])
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
