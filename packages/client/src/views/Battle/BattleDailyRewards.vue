<template>
  <UserDialog :title="$t('battle-daily-rewards-title')" @close="collectRewards">
    <template v-slot:content>
      <!-- tips -->
      <div class="font-size-20">
        {{ $t("battle-daily-rewards-tips") }}
      </div>
      <div
        class="battle-daily-rewards margin-top-5 margin-left-3 margin-right-3"
      >
        <BattleDailyReward
          v-for="(reward, index) in dailyRewards"
          :key="index"
          :index="index"
          :current="reward.active"
          :collected="reward.collected"
          :reward="reward"
        ></BattleDailyReward>
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
import * as battle from "@/../../knightlands-shared/battle";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import BattleDailyReward from "@/views/Battle/BattleDailyReward.vue";

export default {
  mixins: [NetworkRequestErrorMixin],
  components: { BattleDailyReward },
  computed: {
    ...mapGetters("battle", ["dailyRewards"])
  },
  methods: {
    async collectRewards() {
      this.$store.dispatch("battle/claimReward", {
        type: battle.REWARD_TYPE_DAILY
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
.battle-daily-rewards {
  display: grid;
  grid-template-columns: repeat(5, minmax(8rem, 1fr));
  justify-items: center;
}
</style>
