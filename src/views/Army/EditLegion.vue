<template>
  <div class="screen-content">
    <div class="flex">
      <UnitSlot
        v-for="slot in slots"
        :key="slot.id"
        :unit="slot.unit"
        @click="editSlot(slot.id)"
      />
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import UnitSlot from "./UnitSlot.vue";

export default {
  mixins: [AppSection],
  props: ["type"],
  data: () => ({
    legionIndex: -1,
    legion: null
  }),
  components: { UnitSlot },
  created() {
    this.title = `windows-legion-${this.type}`;
    this.$options.useRouterBack = true;
  },
  async mounted() {
    await this.$game.army.load();
    this.legionIndex = 0;
  },
  computed: {
    isTroops() {
      return this.type == "troops";
    },
    slots() {
      return this.$game.army.getSlots(this.legionIndex, this.isTroops);
    }
  },
  methods: {
    editSlot(slotId) {
      this.$router.push({
        name: "edit-legion",
        params: { legion: this.legionIndex, slotId: slotId }
      });
    }
  }
};
</script>
