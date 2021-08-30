<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <LegionSelector
      class="margin-bottom-half"
      :army="$game.army"
      @legionChange="onLegionChanged"
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
                @click="goToSlot(slot)"
              />
            </div>

            <Title class="margin-bottom-1 margin-top-1" :title="$t('troops')" />

            <div class="units-grid width-100">
              <UnitSlot
                :id="`s-${slot.id}`"
                v-for="slot in troops"
                :key="slot.id"
                :unit="slot.unit"
                @click="goToSlot(slot)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <portal to="footer" v-if="isActive">
      <CustomButton type="grey" @click="editGenerals">{{$t("edit-generals")}}</CustomButton>
      <CustomButton type="grey" @click="editTroops">{{$t("edit-troops")}}</CustomButton>
    </portal> -->
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
    this.title = this.$t("window-title-army-compose");
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
  methods: {
    onLegionChanged(index) {
      this.legionIndex = index;
    },
    editGenerals() {
      this.$router.push({ name: "legion", params: { type: "generals" } });
    },
    editTroops() {
      this.$router.push({ name: "legion", params: { type: "troops" } });
    },
    goToSlot(slot) {
      this.$router.push({
        name: "edit-legion",
        params: {
          legion: this.legionIndex,
          slotId: slot.id,
          type: slot.troop ? "troops" : "generals"
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
