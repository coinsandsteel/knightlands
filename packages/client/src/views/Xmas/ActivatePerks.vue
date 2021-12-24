<template>
  <UserDialog @close="$close(true)" title="Activate perk">
    <template v-slot:content>
      <div class="flex flex-column">
        <ActivatePerkElement
          v-for="p in perks"
          :key="p"
          :perk="p"
          @activate="handleActivate"
        />
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import {
  TOWER_PERK_AUTOCYCLES_COUNT,
  TOWER_PERK_BOOST,
  TOWER_PERK_SUPER_BOOST,
  TOWER_PERK_CYCLE_DURATION,
  TOWER_PERK_INCOME,
  TOWER_PERK_UPGRADE,
  TOWER_PERK_SPEED,
  TOWER_PERK_SUPER_SPEED
} from "@/../../knightlands-shared/xmas";
import ActivatePerkElement from "./ActivatePerkElement.vue";

const perks = [
  TOWER_PERK_CYCLE_DURATION,
  TOWER_PERK_INCOME,
  TOWER_PERK_UPGRADE,
  TOWER_PERK_AUTOCYCLES_COUNT,
  TOWER_PERK_BOOST,
  TOWER_PERK_SPEED,
  TOWER_PERK_SUPER_BOOST,
  TOWER_PERK_SUPER_SPEED
];

export default {
  components: {
    UserDialog,
    ActivatePerkElement
  },
  data: () => ({
    perks
  }),
  methods: {
    handleActivate(perkId) {
      console.log(perkId);
    }
  }
};
</script>
