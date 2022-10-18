<template>
  <UserDialog title="Select tribe" @close="closeHandler()" emitClose>
    <template v-slot:content>
      <div class="font-size-25 capitalize flex width-100 flex-column padding-1">
        <div class="flex width-100 flex-space-evenly margin-top-2">
          <p-check
            v-for="tribeOption in tribeOptions"
            :key="tribeOption.value"
            class="checkbox margin-bottom-1"
            color="warning"
            :checked="selectedTribe === tribeOption.value"
            @change="tribeCheckHandler(tribeOption)"
            >{{ $t(tribeOption.label) }}</p-check
          >
        </div>

        <div class="text-align-center margin-top-4">
          <CustomButton
            :disabled="!selectedTribe"
            type="yellow"
            class="inline-block"
            width="15rem"
            @click="closeHandler(selectedTribe)"
          >
            Select
          </CustomButton>
        </div>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import * as battle from "@/../../knightlands-shared/battle";

export default {
  data() {
    return {
      selectedTribe: null
    };
  },
  computed: {
    tribeOptions() {
      return [
        {
          value: battle.UNIT_TRIBE_KOBOLD,
          label: this.$t("battle-unit-tribe-name-" + battle.UNIT_TRIBE_KOBOLD)
        },
        {
          value: battle.UNIT_TRIBE_DWARF,
          label: this.$t("battle-unit-tribe-name-" + battle.UNIT_TRIBE_DWARF)
        },
        {
          value: battle.UNIT_TRIBE_EGYPTIAN,
          label: this.$t("battle-unit-tribe-name-" + battle.UNIT_TRIBE_EGYPTIAN)
        },
        {
          value: battle.UNIT_TRIBE_GOBLIN,
          label: this.$t("battle-unit-tribe-name-" + battle.UNIT_TRIBE_GOBLIN)
        },
        {
          value: battle.UNIT_TRIBE_INSECT,
          label: this.$t("battle-unit-tribe-name-" + battle.UNIT_TRIBE_INSECT)
        },
        {
          value: battle.UNIT_TRIBE_ORC,
          label: this.$t("battle-unit-tribe-name-" + battle.UNIT_TRIBE_ORC)
        },
        {
          value: battle.UNIT_TRIBE_CLOCKWORK,
          label: this.$t(
            "battle-unit-tribe-name-" + battle.UNIT_TRIBE_CLOCKWORK
          )
        },
        {
          value: battle.UNIT_TRIBE_SKELETON,
          label: this.$t("battle-unit-tribe-name-" + battle.UNIT_TRIBE_SKELETON)
        },
        {
          value: battle.UNIT_TRIBE_ICE,
          label: this.$t("battle-unit-tribe-name-" + battle.UNIT_TRIBE_ICE)
        },
        {
          value: battle.UNIT_TRIBE_ELF,
          label: this.$t("battle-unit-tribe-name-" + battle.UNIT_TRIBE_ELF)
        },
        {
          value: battle.UNIT_TRIBE_ELDRITCH,
          label: this.$t("battle-unit-tribe-name-" + battle.UNIT_TRIBE_ELDRITCH)
        },
        {
          value: battle.UNIT_TRIBE_ASSEMBLING,
          label: this.$t(
            "battle-unit-tribe-name-" + battle.UNIT_TRIBE_ASSEMBLING
          )
        },
        {
          value: battle.UNIT_TRIBE_FALLEN_KING,
          label: this.$t(
            "battle-unit-tribe-name-" + battle.UNIT_TRIBE_FALLEN_KING
          )
        },
        {
          value: battle.UNIT_TRIBE_LEGENDARY,
          label: this.$t(
            "battle-unit-tribe-name-" + battle.UNIT_TRIBE_LEGENDARY
          )
        },
        {
          value: battle.UNIT_TRIBE_TITAN,
          label: this.$t("battle-unit-tribe-name-" + battle.UNIT_TRIBE_TITAN)
        }
      ];
    }
  },
  created() {},
  methods: {
    closeHandler(result) {
      this.$close(result);
    },
    tribeCheckHandler(option) {
      this.selectedTribe = option.value;
    }
  }
};
</script>

<style lang="less" scoped>
.checkbox {
  min-width: 40%;
  text-align: left;
  flex: 1;
}
</style>
