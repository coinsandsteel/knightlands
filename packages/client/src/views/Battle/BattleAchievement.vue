<template>
  <div class="font-size-22">
    <div class="margin-top-2 padding-left-2 padding-right-2">
      Collect Tier 3 squads and get access to achievements that unlock NFT
    </div>
    <div class="margin-top-2">
      <div
        v-for="(item, itemIndex) in items"
        :key="itemIndex"
        class="margin-bottom-4"
      >
        <div>
          {{ item.name }}
        </div>
        <div
          class="battle-unit-list margin-top-1 padding-left-2 padding-right-2"
        >
          <BattleUnit
            v-for="unit in item.units"
            :unit="unit"
            :key="unit.unitId"
            :class="{ 'opacity-30': !unit.owned }"
          />
        </div>
        <div class="margin-top-1">
          <CustomButton
            :disabled="!item.canClaim"
            type="yellow"
            width="20rem"
            class="inline-block"
            @click="receiveHandler"
            >Receive</CustomButton
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import BattleUnit from "@/views/Battle/BattleUnit.vue";
export default {
  components: {
    BattleUnit
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("battle", ["inventory"]),
    ...mapGetters("battle", ["squadRewards"]),
    items() {
      if (!(this.squadRewards && this.squadRewards.length > 0)) {
        return [];
      }

      return this.squadRewards.map((reward, index) => {
        const units = reward.activeTemplates.map((template, templateIndex) => ({
          template,
          unitId: "unitId-" + (index * 5 + templateIndex),
          tribe: reward.tribe,
          owned: !!this.inventory.find(
            inventoryItem => inventoryItem.template === template
          )
        }));

        return {
          name: this.$t("battle-unit-tribe-name-" + reward.tribe),
          claimed: reward.claimed,
          canClaim: reward.canClaim && units.every(({ owned }) => !!owned),
          activeTemplates: reward.activeTemplates,
          units
        };
      });
    }
  },
  methods: {
    unitClickHandler() {},
    receiveHandler() {}
  }
};
</script>
<style scoped lang="less">
.battle-unit-list {
  display: grid;
  grid-template-columns: repeat(5, minmax(10rem, 1fr));
  justify-items: center;
  row-gap: 0.5rem;
  column-gap: 0.5rem;
}
.battle-unit {
  width: 100%;
}
</style>
