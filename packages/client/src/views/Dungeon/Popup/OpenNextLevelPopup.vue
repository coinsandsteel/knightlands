<template>
  <UserDialog title="Next Level" class="font-size-22" @close="$close">
    <template v-slot:content>
      <div class="popup-container">
        <div>Next level will open after {{ timer.value }}</div>
        <div class="flex flex-items-center flex-no-wrap margin-top-half">
          Open level via flesh
          <CustomButton
            :disabled="!canBuy"
            type="yellow"
            min-width="13rem"
            @click="buyHandler"
          >
            <div class="flex flex-items-center">
              <IconWithValue iconClass="icon-dkt">
                <div class="inline-block margin-left-half">
                  {{ price }}
                </div>
              </IconWithValue>
            </div>
          </CustomButton>
        </div>
        <div class="flex flex-items-center margin-top-half">
          Your flesh balance:
          <IconWithValue iconClass="icon-dkt" class="margin-left-1">{{
            balance.flesh
          }}</IconWithValue>
        </div>
      </div>
    </template>

    <template v-slot:footer>
      <CustomButton type="grey" min-width="14rem" @click="$close">{{
        $t("close")
      }}</CustomButton>
    </template>
  </UserDialog>
</template>

<script>
import { mapState } from "vuex";
import timer from "@/timer";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

export default {
  mixins: [NetworkRequestErrorMixin],
  data: () => ({
    timer: new timer(true),
    canLeave: false
  }),
  computed: {
    ...mapState("dungeon", ["user"]),
    price() {
      return this.user && this.user.prices && this.user.prices.dungeon
        ? Math.floor(this.user.prices.dungeon * 100) / 100
        : 0;
    },
    balance() {
      return {
        // hard: this.$game.hardCurrency,
        flesh: this.$game.dkt
      };
    },
    canBuy() {
      return this.balance.flesh >= this.price;
    }
  },
  mounted() {
    this.updateTimer();
  },
  methods: {
    updateTimer() {
      const diff = this.$game.nowSec - this.$game.nowSec + 1200 * 60;
      this.timer.timeLeft = 86400 - (diff % 86400);
    },
    buyHandler() {
      this.performRequestNoCatch(
        this.$store.dispatch("dungeon/purchase", {
          type: "dungeon"
        })
      );
      this.$close();
    }
  }
};
</script>
<style scoped lang="less">
.popup-container {
  width: 200px;
  margin: 0 auto;
  text-align: left;
}
</style>
