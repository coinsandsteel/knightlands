<template>
  <div class="flex flex-center font-size-18 flex-no-wrap">
    <div
      class="flex flex-center padding-1 padding-left-3 padding-right-3 panel-input height-100"
    >
      <div class="item-icon" :class="ticketIcon"></div>
      <span>{{ totalTickets }}</span>
      <span
        class="item-icon button_plus_footer margin-left-half pointer"
        @click="$emit('purchaseAttempts')"
      ></span>
    </div>

    <CustomButton type="grey" @click="$emit('open')">{{
      $t("btn-level-trials-cards")
    }}</CustomButton>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import TrialType from "@/../../knightlands-shared/trial_type";
import TrialsOfHonorMeta from "@/trials_of_honor";
import TrialsOfDecayMeta from "@/trials_of_decay";
import ConjuredTrialsMeta from "@/conjured_trials";
import InventoryListenerMixin from "@/components/InventoryListenerMixin.vue";

export default {
  mixins: [InventoryListenerMixin],
  props: ["trialType"],
  components: { CustomButton },
  data: () => ({
    itemTickets: 0,
    state: null
  }),
  mounted() {
    this.update();
  },
  watch: {
    trialType: {
      immediate: true,
      handler() {
        this.state = this.$game.getTrialState(this.trialType);
      }
    },
    state() {
      this.update();
    }
  },
  computed: {
    ticketIcon() {
      return this.$game.itemsDB.getIcon(this.meta.ticketItem);
    },
    totalTickets() {
      return this.nonItemAttempts + this.itemTickets;
    },
    nonItemAttempts() {
      if (!this.state) {
        return this.freeTickets;
      }

      return this.state.attempts + this.freeTickets;
    },
    freeTickets() {
      if (!this.state) {
        return 0;
      }

      return this.state.freeAttempts;
    },
    meta() {
      switch (this.trialType) {
        case TrialType.Weapon:
          return ConjuredTrialsMeta;
        case TrialType.Armour:
          return TrialsOfHonorMeta;
        case TrialType.Accessory:
          return TrialsOfDecayMeta;
      }
      return null;
    }
  },
  methods: {
    handleInventoryChanged() {
      this.update();
    },
    update() {
      const ticketItem = this.$game.inventory.getItemByTemplate(
        this.meta.ticketItem
      );

      if (ticketItem) {
        this.itemTickets = ticketItem.count;
      }
    }
  }
};
</script>
