<template>
  <Promised :pendingDelay="200" :promise="request">
    <template v-slot:combined="{ isPending, isDelayOver }">
      <loading-screen :loading="isPending && isDelayOver"></loading-screen>
      <div
        class="min-height-30 flex-column color-panel-1 flex-items-center"
        v-if="data"
      >
        <div
          class="flex font-size-25 margin-top-2 margin-bottom-3 title flex-center"
        >
          <div class="margin-right-1">{{ $t("total-ref-dkt") }}</div>
          <IconWithValue iconClass="icon-dkt">{{
            data.body.totalDkt
          }}</IconWithValue>
        </div>

        <div class="width-100">
          <div v-bar>
            <div>
              <div
                v-for="ref in data.body.referees"
                :key="ref.id"
                class="width-100 margin-bottom-2 font-size-20 flex flex-items-center flex-space-around"
              >
                <span>{{ ref.id }}</span>
                <IconWithValue iconClass="icon-dkt">{{
                  ref.dkt
                }}</IconWithValue>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Promised>
</template>

<script>
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import Config from "@/config";

export default {
  components: { LoadingScreen, Promised, IconWithValue },
  data: () => ({
    request: null,
    data: null
  }),
  activated() {
    this.fetchReferrals();
  },
  methods: {
    async fetchReferrals() {
      this.request = this.$http.get(`${Config.httpEndpoint}/get/referrals`, {
        params: {
          wallet: this.$game.account
        }
      });

      this.data = await this.request;
    }
  }
};
</script>

<style lang="less" scoped></style>
