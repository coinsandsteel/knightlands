<template>
  <div ref="port" class="relative width-100 height-100" v-bar>
    <div id="map">
      <!-- <div
        class="flex flex-center width-100 margin-top-3 margin-bottom-3 font-size-25"
      >
        Santabucks: {{ balanceFormatted.santa_bucks }}<br />
        Gold: {{ balanceFormatted.gold }}<br />
        Unit Essence: {{ balanceFormatted.unit_essence }}<br />
        Christmas Points: {{ balanceFormatted.christmas_points }}<br />
        Shinies: {{ balanceFormatted.shinies }}
      </div> -->

      <XmasTower @click="$emit('toggle-perks')" />
      <XmasFarm
        :key="'tier-' + tier"
        v-for="(slot, tier) in slots"
        :style="slot.style"
        :tier="tier"
      />
    </div>
  </div>
</template>

<script>
import PromptMixin from "@/components/PromptMixin.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import XmasTower from "./XmasTower.vue";
import XmasFarm from "./XmasFarm.vue";

export default {
  mixins: [PromptMixin, NetworkRequestErrorMixin],
  components: {
    XmasTower,
    XmasFarm
  },
  watch: {},
  data: () => {
    return {
      slots: {
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
        6: {},
        7: {},
        8: {},
        9: {}
      }
    };
  }
};
</script>

<style lang="less" scoped>
#map {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: start;
}
</style>
