<template>
  <div class="flex flex-column flex-end padding-bottom-2">
    <CustomButton
      class="margin-top-1"
      type="yellow"
      id="do-summon"
      @click="summon(1)"
      v-if="freeSummonTimer.timeLeft <= 0"
    >
      <span>{{ $t("free-summon") }}</span>
    </CustomButton>

    <div class="flex flex-center flex-column" v-else>
      <span class="font-size-18 margin-bottom-half">{{
        $t("free-summon-timer", { timer: freeSummonTimer.value })
      }}</span>

      <div>
        <template v-if="hasTicket">
          <CustomButton
            class="margin-top-1"
            type="yellow"
            @click="singleSummon"
          >
            <div
              class="flex flex-center"
              v-html="$t('unit-summon-item', { count: 1, icon: ticketIcon })"
            ></div>
          </CustomButton>

          <CustomButton
            class="margin-top-1"
            type="yellow"
            @click="batchSummon"
            v-if="batchSize > 1"
          >
            <div
              class="flex flex-center flex-no-wrap"
              v-html="
                $t('unit-summon-item', { count: batchSize, icon: ticketIcon })
              "
            ></div>
          </CustomButton>
        </template>

        <div class="flex flex-column" v-if="info.meta.iaps.length > 0">
          <PurchaseButton
            v-for="(iap, index) in info.meta.iaps"
            :key="index"
            :price="iap.price"
            class="margin-top-1"
            type="yellow"
            @click="purchaseSummon(index)"
          >
            <span>{{ $t("unit-summon", { count: iap.count }) }}</span>
          </PurchaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import PurchaseButton from "@/components/PurchaseButton.vue";
import ArmySummonType from "@/../../knightlands-shared/army_summon_type";
import Timer from "@/timer";

export default {
  props: ["info", "summonType"],
  components: { CustomButton, PurchaseButton },
  data: () => ({
    ArmySummonType,
    freeSummonTimer: new Timer(true)
  }),
  watch: {
    info: {
      deep: true,
      immediate: true,
      handler() {
        if (this.info && this.info.meta && this.info.meta.freeOpens > 0) {
          let resetCycle = 86400 / this.info.meta.freeOpens;
          let timeElapsed = this.$game.nowSec - this.info.lastSummon;
          this.freeSummonTimer.timeLeft = resetCycle - timeElapsed;
        }
      }
    }
  },
  computed: {
    totalTickets() {
      return this.$game.inventory.getItemsCountByTemplate(
        this.info.meta.ticketItem
      );
    },
    hasTicket() {
      return this.totalTickets > 0;
    },
    batchSize() {
      return this.totalTickets > 10 ? 10 : this.totalTickets;
    },
    ticketIcon() {
      return this.$game.itemsDB.getIcon(this.info.meta.ticketItem);
    }
  },
  methods: {
    summon(count) {
      this.$emit("summon", this.summonType, count);
    },
    purchaseSummon(iap) {
      this.$emit("purchaseSummon", this.summonType, iap);
    },
    batchSummon() {
      this.summon(this.batchSize);
    },
    singleSummon() {
      this.summon(1);
    }
  }
};
</script>
