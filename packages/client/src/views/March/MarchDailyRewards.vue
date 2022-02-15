<template>
  <UserDialog title="lunar-daily-rewards-title" @close="collectRewards">
    <template v-slot:content>
      <!-- tips -->
      <div class="font-size-20">{{ $t("lunar-daily-rewards-tips") }}</div>
      <!-- mystery lanterns -->
      <div
        class="flex flex-justify-center margin-left-auto margin-right-auto margin-2"
      >
        Rewards ...
      </div>
      <!-- daily rewards -->
      <div class="daily-rewards padding-top-1 padding-bottom-2">
        <div class="font-size-20">{{ $t("lunar-daily-rewards-message") }}</div>
        <div
          class="flex flex-justify-center margin-left-auto margin-right-auto margin-top-1"
        >
          Daily rewards ...
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
// import CheckedIcon from "@/views/Lunar/Checked.vue";

export default {
  components: {
    UserDialog,
    CustomButton
    // CheckedIcon
  },
  mixins: [NetworkRequestErrorMixin],
  data() {
    return {};
  },
  computed: {
    ...mapState({
      // dailyRewards: state => state.march.dailyRewards
    })
  },
  methods: {
    async collectRewards() {
      // await this.performRequestNoCatch(
      //   this.$store.dispatch("march/collectDailyReward")
      // );
      this.$close();
    }
  }
};
</script>

<style lang="less" scoped>
// .mystery-lantern-loot,
// .lantern-loot {
//   margin: 0 2px 2px;
// }
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
