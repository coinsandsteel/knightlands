<template>
  <UserDialog v-on="$listeners">
    <template v-slot:content>
      <div>
        <div class="flex flex-column flex-center width-100">
          <span class="font-size-20 width-100 weakness-title">{{
            $t("raid-weak")
          }}</span>

          <div
            class="width-100 weakness-content weakness-font flex flex-center flex-column padding-1"
          >
            <IconWithValue
              :iconClass="`unit_element_${currentWeakness.element}`"
              >{{ $t(`el-${currentWeakness.element}`) }}</IconWithValue
            >
            <IconWithValue
              class="margin-top-1"
              :iconClass="`unit_weapon_${currentWeakness.weapon}`"
              >{{ $t(currentWeakness.weapon) }}</IconWithValue
            >
          </div>

          <span class="font-size-20 width-100 next-weakness-title ">{{
            $t("raid-weak-next")
          }}</span>

          <div
            class="width-100 next-weakness-content next-weakness-font flex flex-center flex-column padding-1"
          >
            <IconWithValue
              :iconClass="`unit_element_${nextWeakness.element}`"
              >{{ $t(`el-${nextWeakness.element}`) }}</IconWithValue
            >
            <IconWithValue
              class="margin-top-1"
              :iconClass="`unit_weapon_${nextWeakness.weapon}`"
              >{{ $t(nextWeakness.weapon) }}</IconWithValue
            >

            <span class="margin-top-1 font-size-18">{{
              $t("raid-weak-timer", { time: untilNextWeakness.value })
            }}</span>
          </div>

          <span class="margin-top-1 font-size-18">{{
            $t("match-element-info")
          }}</span>
          <span class="font-size-18 margin-top-half">{{
            $t("match-weapon-info")
          }}</span>
        </div>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import RaidsMeta from "@/metadata/raids_meta";
import Timer from "@/timer";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  props: ["raidTemplateId", "isFreeRaid", "weakness", "dktFactor"],
  components: { UserDialog, IconWithValue },
  data: () => ({
    untilNextWeakness: new Timer(true)
  }),
  created() {
    this.untilNextWeakness.timeLeft = this.weakness.untilNextWeakness / 1000;
  },
  computed: {
    dktFactorComputed() {
      return Math.floor(this.dktFactor * 1000) / 1000;
    },
    currentWeakness() {
      return this.weakness.current;
    },
    nextWeakness() {
      return this.weakness.next;
    },
    meta() {
      return RaidsMeta[this.raidTemplateId];
    }
  }
};
</script>

<style lang="less" scoped>
.weakness-title {
  background-color: #324741;
}

.weakness-content {
  background-color: #3f5852;
}

.weakness-font {
  color: #d8fb9a;
}

.next-weakness-title {
  background-color: #512c3c;
}

.next-weakness-content {
  background-color: #603c4e;
}

.next-weakness-font {
  color: #ffa0a3;
}
</style>
