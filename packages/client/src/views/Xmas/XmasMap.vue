<template>
  <div ref="port" class="relative width-100" v-bar>
    <div class="flex flex-column">
      <XmasTower />

      <div class="farm-grid">
        <XmasFarm
          :key="'tier-' + tier"
          v-for="(slot, tier) in slots"
          :style="slot.style"
          :tier="tier"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PromptMixin from "@/components/PromptMixin.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import XmasTower from "./XmasTower.vue";
import XmasFarm from "./XmasFarm.vue";
import { mapState } from "vuex";

export default {
  mixins: [PromptMixin, NetworkRequestErrorMixin],
  components: {
    XmasTower,
    XmasFarm
  },
  computed: {
    ...mapState({
      mode: state => state.xmas.mode,
      builtSlots: state => state.xmas.slots
    }),
    slots() {
      let slots = this.builtSlots;
      if (this.mode == "collect") {
        slots = {};
        for (const k in this.builtSlots) {
          if (this.builtSlots[k].level > 0) {
            slots[k] = this.builtSlots[k];
          }
        }
      }

      return slots;
    }
  }
};
</script>

<style lang="less" scoped>
.farm-grid {
  width: 100%;
  display: grid;
  column-gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
  justify-items: stretch;
}
</style>
