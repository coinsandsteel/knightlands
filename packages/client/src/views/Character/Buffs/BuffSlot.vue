<template>
  <div
    class="relative margin-1 slot-effect padding-half"
    @click="$emit('info', buff, item)"
    :class="{ active: timer.timeLeft > 0 }"
  >
    <progress-bar
      v-if="timer.timeLeft > 0"
      :percentMode="true"
      v-model="timer.timeLeft"
      :maxValue="buff.duration"
      :hideValues="true"
      height="0.5rem"
      width="80%"
      :thresholds="thresholds"
      class="buff-progress"
    ></progress-bar>
    <div class="icon" :class="icon" />

    <span class="font-size-20 quantity font-weight-700 font-outline">{{
      count
    }}</span>
  </div>
</template>

<script>
import UiConstants from "@/ui_constants";
import Timer from "@/timer";
import ProgressBar from "@/components/ProgressBar.vue";

export default {
  props: ["buff", "item"],
  components: { ProgressBar },
  data: () => ({
    thresholds: UiConstants.progressThresholds,
    timer: new Timer()
  }),
  watch: {
    buff: {
      deep: true,
      handler() {
        this.refreshTimer();
      }
    }
  },
  mounted() {
    this.refreshTimer();
  },
  activated() {
    this.refreshTimer();
  },
  computed: {
    icon() {
      let template = (this.buff || this.item).template;
      if (template) {
        return this.$game.itemsDB.getIcon(template);
      }

      return "";
    },
    count() {
      if (this.item) {
        return this.item.count;
      }

      let item = this.$game.inventory.getItemByTemplate(this.buff.template);
      if (item) {
        return item.count;
      }

      return 0;
    }
  },
  methods: {
    refreshTimer() {
      if (this.buff) {
        this.timer.timeLeft =
          this.buff.duration - (this.$game.now - this.buff.applyTime) / 1000;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "../../../style/common.less";

.buff-progress {
  position: absolute;
  top: 0.5rem;
  left: -50%;
  transform: translateX(50%);
}

.slot-effect {
  position: relative;
  background-image: url("../../../assets/ui/slot_effect.png");
  background-size: contain;
  background-repeat: no-repeat;

  width: @lootCellSize;
  height: @lootCellSize;

  &.active {
    background-image: url("../../../assets/ui/slot_effect_active.png");
  }
}

.icon {
  width: 100%;
  height: 100%;
}

.quantity {
  position: absolute;
  bottom: 0.2rem;
  right: 0.6rem;
  z-index: 1;
}
</style>
