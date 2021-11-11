<template>
  <div class="flex flex-column full-flex">
    <Title :stackTop="true" :stackBottom="true">{{
      $t("trial-fight-title", { fight: index + 1 })
    }}</Title>

    <div class="flex flex-full flex-space-between color-panel-2">
      <div class="flex flex-column flex-items-start padding-left-3 flex-8">
        <span class="font-size-18 margin-bottom-half">{{
          $t("tower-rewards")
        }}</span>
        <div class="flex flex-space-evenly">
          <IconWithValue
            valueClass="font-size-18 margin-right-3"
            iconClass="icon-gold"
            >{{ fight.soft }}</IconWithValue
          >
          <IconWithValue valueClass="font-size-18" iconClass="icon-exp">{{
            fight.exp
          }}</IconWithValue>
        </div>
      </div>

      <div class="flex flex-column padding-right-2 flex-4 flex-center">
        <div class="flex font-size-18 margin-bottom-half">
          <IconWithValue iconClass="icon-health">
            {{ fight.health }}
          </IconWithValue>
        </div>
        <div class="flex font-size-18">
          <IconWithValue iconClass="icon-attack">
            {{ fight.attack }}
          </IconWithValue>
        </div>

        <div class="flex margin-top-2">
          <span v-show="completed" class="rarity-mythical font-size-18">{{
            $t("trial-fight-completed")
          }}</span>
          <CustomButton
            v-show="!completed"
            :disabled="locked"
            minWidth="20rem"
            type="yellow"
            @click="$emit('engage')"
            >{{ $t("tower-challenge") }}</CustomButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import Title from "@/components/Title.vue";

export default {
  props: ["fight", "index", "locked", "completed"],
  components: { CustomButton, IconWithValue, Title }
};
</script>
