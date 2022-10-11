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
import { mapGetters } from "vuex";
import { create } from "vue-modal-dialogs";
import * as battle from "@/../../knightlands-shared/battle";
import BattleUnit from "@/views/Battle/BattleUnit.vue";
import ItemsReceived from "@/components/ItemsReceived.vue";
export default {
  components: {
    BattleUnit,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("battle", ["squadRewards", "fighters"]),
    items() {
      if (!(battle.SQUAD_REWARDS && battle.SQUAD_REWARDS.length > 0)) {
        return [];
      }

      return battle.SQUAD_REWARDS.map((rewardMeta, index) => {
        const rewardData = this.squadRewards.find(
          (entry) => entry.tribe === rewardMeta.tribe
        );

        const units = rewardMeta.templates.map((template, templateIndex) => ({
          template,
          unitId: "unitId-" + (index * 5 + templateIndex),
          tier: 3,
          tribe: rewardMeta.tribe,
          owned: rewardData.activeTemplates.includes(template)
        }));

        return {
          name: this.$t("battle-unit-tribe-name-" + rewardMeta.tribe),
          canClaim: rewardData.canClaim,
          units
        };
      });
    },
  },
  methods: {
    async receiveHandler() {
      let items = await this.performRequestNoCatch(
        this.$store.dispatch("battle/claimReward", {
          type: battle.REWARD_TYPE_SQUAD,
        })
      );
      const ShowItems = create(ItemsReceived, "items");
      if (items.length) {
        await ShowItems(items);
      }
    },
  },
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
