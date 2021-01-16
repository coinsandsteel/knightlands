<template>
  <div class="screen-content padding-top-1">
    <div class="screen-background"></div>
    <EquipmentContent
      v-if="character"
      :itemsInSlots="itemsInSlots"
      :level="character.level"
      :stats="character.stats"
      :hasBonus="{}"
      :showDetails="true"
      :nickname="character.nickname"
      @details="showDetails"
    />
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import EquipmentContent from "./Equipment/EquipmentContent.vue";
import { create as CreateDialog } from "vue-modal-dialogs";
import StatDetails from "./Equipment/StatDetails.vue";
const ShowDetails = CreateDialog(StatDetails);

export default {
  mixins: [AppSection],
  components: { EquipmentContent },
  data: () => ({
    character: null,
    itemsInSlots: null
  }),
  created() {
    this.$options.useRouterBack = true;
    this.title = "w-p-char";
  },
  props: ["id"],
  watch: {
    id: {
      immediate: true,
      handler() {
        this.reload();
      }
    }
  },
  methods: {
    showDetails() {
      ShowDetails();
    },
    async reload() {
      const data = await this.$game.loadUserPreview(this.id);
      this.character = data.user.character;

      let items = {};
      for (const slotId in this.character.equipment) {
        const itemId = this.character.equipment[slotId].id;

        items[slotId] = data.items.items.find(x => x.id == itemId);
      }

      this.itemsInSlots = items;
    }
  }
};
</script>
