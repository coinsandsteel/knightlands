<template>
  <div class="screen-content padding-top-1" v-if="character">
    <div class="screen-background"></div>
    <template v-if="character">
      <div v-bar>
        <div>
          <EquipmentContent
            :itemsInSlots="itemsInSlots"
            :level="character.level"
            :stats="character.stats"
            :hasBonus="{}"
            :preview="true"
            :nickname="character.name.v"
            :classIcon="character.class"
            :avatar="character.avatar"
            @details="showDetails"
            @hint="handlePreviewSlot"
          />
          <LegionPreview
            class="margin-top-2"
            v-if="army"
            :army="army"
            :items="items"
          ></LegionPreview>
        </div>
      </div>
    </template>
    <div class="flex flex-center height-100" v-else>
      <span class="font-size-22">{{ $t("no-char") }}</span>
    </div>
  </div>
</template>

<script>
import HintHandler from "@/components/HintHandler.vue";
import AppSection from "@/AppSection.vue";
import EquipmentContent from "./Equipment/EquipmentContent.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
// import { create as CreateDialog } from "vue-modal-dialogs";
// import StatDetails from "./Equipment/StatDetails.vue";
import LegionPreview from "./LegionPreview.vue";

// const ShowDetails = CreateDialog(StatDetails, "maxStats");

export default {
  mixins: [AppSection, HintHandler, NetworkRequestErrorMixin],
  components: { EquipmentContent, LegionPreview },
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
    handlePreviewSlot(slot) {
      this.handlePreviewHint(this.itemsInSlots[slot]);
    },
    showDetails() {
      // ShowDetails();
    },
    async reload() {
      try {
        const data = await this.performRequestNoCatch(
          this.$game.loadUserPreview(this.id)
        );
        this.character = data.user.character;

        let items = {};
        for (const slotId in this.character.equipment) {
          const itemId = this.character.equipment[slotId].id;

          items[slotId] = data.items.items.find(x => x.id == itemId);
        }

        this.itemsInSlots = items;
        this.items = data.items;

        if (data.army) {
          this.army = data.army;
        }
      } catch (exc) {
        this.character = null;
      }
    }
  }
};
</script>
