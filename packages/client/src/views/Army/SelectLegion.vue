<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <LegionSelector
      class="margin-bottom-half"
      @legionChange="onLegionChanged"
      :army="$game.army"
      :legion="legionIndex"
    />

    <div class="dummy-height flex-full">
      <div class="width-100 height-100 dummy-height" v-bar>
        <div class="flex flex-column">
          <div class="flex flex-column">
            <Title class="margin-bottom-1" :title="$t('generals')" />

            <div class="units-grid width-100">
              <UnitSlot
                v-for="slot in generals"
                :key="slot.id"
                :unit="slot.unit"
                @click="editSlot(slot.id, false)"
              />
            </div>

            <Title class="margin-bottom-1 margin-top-1" :title="$t('troops')" />

            <div class="units-grid width-100">
              <UnitSlot
                v-for="slot in troops"
                :key="slot.id"
                :unit="slot.unit"
                @click="editSlot(slot.id, true)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <portal to="footer" v-if="isActive">
      <CustomButton type="yellow" @click="selectLegion">{{
        $t("select-legion")
      }}</CustomButton>
    </portal>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import CustomButton from "@/components/Button.vue";
import UnitSlot from "./UnitSlot.vue";
import Title from "@/components/Title.vue";
import LegionSelector from "./LegionSelector.vue";

export default {
  mixins: [AppSection],
  data: () => ({
    legionIndex: 0
  }),
  components: {
    CustomButton,
    UnitSlot,
    Title,
    LegionSelector
  },
  created() {
    this.title = "window-legion-select";
    this.$options.useRouterBack = true;
  },
  computed: {
    generals() {
      return this.$game.army.getSlots(this.legionIndex, false);
    },
    troops() {
      return this.$game.army.getSlots(this.legionIndex, true);
    }
  },
  mounted() {
    this.legionIndex = this.$store.state.selectedLegion;
  },
  methods: {
    onLegionChanged(index) {
      this.legionIndex = index;
      this.$store.commit("setSelectedLegion", this.legionIndex);
    },
    selectLegion() {
      this.handleBackButton();
    },
    editSlot(slotId, troops) {
      this.$router.push({
        name: "edit-legion",
        params: {
          legion: this.legionIndex,
          slotId: slotId,
          type: troops ? "troops" : "generals"
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.units-grid {
  display: grid;
  grid-template-columns: repeat(3, 33%);
  grid-auto-rows: 26rem;
  justify-items: stretch;
  column-gap: 0.5%;
  row-gap: 1rem;
}
</style>
