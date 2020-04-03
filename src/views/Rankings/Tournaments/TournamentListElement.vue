<template>
    <div class="flex flex-column panel padding-top-1 padding-bottom-1 margin-1 full-flex">
    <span
      class="font-size-25 font-weight-900 margin-left-3 margin-bottom-1"
    >{{$t("tournament-title", { tier: tournament.tier })}}</span>

    <div class="flex flex-full flex-space-between">
      <div class="flex flex-column padding-right-2 flex-4">
        <!-- <div class="flex font-size-18 margin-bottom-half">
          <span class="margin-right-1">{{$t("health")}}</span>
          <span>{{fight.health}}</span>
        </div>
        <div class="flex font-size-18 margin-bottom-1">
          <span class="margin-right-1">{{$t("attack")}}</span>
          <span>{{fight.attack}}</span>
        </div> -->
          <div class="flex flex-center self-align-end">
              <CustomButton type="yellow" @click="$emit('join')">{{$t("btn-join")}}</CustomButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";

export default {
    props: ["tournament"],
    components: { CustomButton }
}
</script>

<style lang="less" scoped>
.tournament-title {
  font-size: 4rem;
  line-height: 4rem;
  background: linear-gradient(
    90deg,
    rgba(38, 16, 52, 0) 0%,
    rgba(38, 16, 52, 0.5550595238095238) 42%,
    rgba(38, 16, 52, 0.5858718487394958) 100%
  );

  min-width: 100%;
}
</style>