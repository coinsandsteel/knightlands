<template>
  <div class="screen-content">
    <EquipmentContent />
  </div>
</template>

<script>
import EquipmentContent from "./Equipment/EquipmentContent.vue";

export default {
  components: { EquipmentContent },
  data: () => ({
    character: {}
  }),
  props: ["id"],
  watch: {
    id: {
      immediate: true,
      handler() {
        this.reload();
      }
    }
  },
  computed: {
    itemsInSlots() {
      let items = {};
      for (const slotId in this.character.equipment) {
        items[slotId] = this.$game.inventory.getItem(
          this.$character.equipment[slotId].id
        );
      }
      return items;
    }
  },
  methods: {
    async reload() {
      this.character = await this.$game.loadUserPreview(this.id);
      console.log(this.character);
    }
  }
};
</script>
