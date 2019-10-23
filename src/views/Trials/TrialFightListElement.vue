<template>
  <div class="flex flex-column panel padding-top-1 padding-bottom-1 margin-1 full-flex">
    <span
      class="font-size-22 flex-self-start margin-left-3 margin-bottom-1"
    >{{$t("trial-fight-title", {fight: index + 1})}}</span>

    <div class="flex flex-full flex-space-between">
      <div class="flex flex-column flex-items-start padding-left-3 flex-8">
        <span class="font-size-18 margin-bottom-half">{{$t("tower-rewards")}}</span>
        <div class="flex flex-space-evenly">
          <IconWithValue
            valueClass="font-size-18 margin-right-3"
            iconClass="icon-gold"
          >{{fight.soft}}</IconWithValue>
          <IconWithValue valueClass="font-size-18" iconClass="icon-exp">{{fight.exp}}</IconWithValue>
        </div>
      </div>

      <div class="flex flex-column padding-right-2 flex-4">
        <div class="flex font-size-18 margin-bottom-half">
          <span class="margin-right-1">{{$t("health")}}</span>
          <span>{{fight.health}}</span>
        </div>
        <div class="flex font-size-18 margin-bottom-1">
          <span class="margin-right-1">{{$t("attack")}}</span>
          <span>{{fight.attack}}</span>
        </div>

        <div class="flex">
          <span
            v-show="completed"
            class="rarity-mythical font-size-18"
          >{{$t("trial-fight-completed")}}</span>
          <CustomButton
            v-show="!completed"
            :disabled="locked"
            type="yellow"
            @click="$emit('engage')"
          >{{$t("tower-challenge")}}</CustomButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  props: ["fight", "index", "locked", "completed"],
  components: { CustomButton, IconWithValue }
};
</script>