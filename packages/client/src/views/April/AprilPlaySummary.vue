<template>
  <UserDialog :title="$t('your-result')" @close="close()">
    <template v-slot:content>
      <div
        class="width-100 height-100 dummy-height flex flex-column flex-no-wrap"
      >
        <div class="flex-full flex flex-center font-size-22 width-100">
          <div class="text-center margin-top-1 width-100">
            <div class="flex flex-no-wrap flex-justify-center">
              <div class="margin-right-2">{{ $t("gold-earned") }}:</div>
              <AprilGold :value="balance ? balance.sessionGold || 0 : 0" />
            </div>
            <div class="flex flex-no-wrap flex-justify-center margin-top-2">
              <div class="margin-right-2">{{ $t("enemies-killed") }}:</div>
              <AprilPoints
                :value="playground ? playground.enemiesKilled || 0 : 0"
              />
            </div>
            <div class="margin-top-2">
              {{ $t("april-boss-killed-text") }}
            </div>
            <div
              v-if="hasFailed"
              class="resurrection-container margin-top-3 padding-top-2 padding-bottom-2 flex flex-column flex-center width-100"
            >
              <div class="text-align-center">{{ $t("resurrection-text") }}</div>
              <div class="resurrection-icon margin-top-2"></div>
              <div class="margin-top-2">
                <CustomButton
                  type="yellow"
                  class="btn-start inline-block"
                  @click="close(true)"
                >
                  {{ $t("buy-for") }} &nbsp;<AprilGold
                    :value="prices ? prices.resurrection : 0"
                  />
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CustomButton type="red" class="btn-exit inline-block" @click="close()">
        {{ $t("EXIT") }}
      </CustomButton>
    </template>
  </UserDialog>
</template>
<script>
import { mapState } from "vuex";
import * as april from "@/../../knightlands-shared/april";
import AprilGold from "@/views/April/AprilGold.vue";
import AprilPoints from "@/views/April/AprilPoints.vue";
import aprilPurchaseMixin from "@/views/April/aprilPurchaseMixin";

export default {
  mixins: [aprilPurchaseMixin],
  components: {
    AprilGold,
    AprilPoints
  },
  computed: {
    ...mapState("april", [
      "balance",
      "level",
      "prices",
      "sessionResult",
      "playground"
    ]),
    hasFailed() {
      return this.sessionResult === april.SESSION_RESULT_FAIL;
    }
  },
  methods: {
    async close(isResurrection = false) {
      if (isResurrection) {
        if (!this.checkGoldBalance(this.prices.resurrection)) {
          return;
        }
        await this.$store.dispatch("april/resurrect");
      } else {
        this.$app.logEvent("april-exit", {
          sessionGold: this.balance ? this.balance.sessionGold || 0 : 0,
          level: this.level
        });
        await this.$store.dispatch("april/exit");
      }
      // this.$close({ isResurrection });
      this.$emit("closed", { isResurrection });
    }
  }
};
</script>

<style scoped lang="less">
.resurrection-container {
  background: #2f7285;
}
.resurrection-icon {
  width: 50px;
  height: 50px;
  background: url("/images/april/hp_resurrection.png") center / 100% no-repeat;
}
.btn {
  min-width: 120px;
}
</style>
