<template>
  <UserDialog @close="$close(true)">
    <template v-slot:content>
      <div class="flex flex-column flex-center flex-start">
        <div
          class="
            font-size-30
            rarity-rare
            font-outline
            margin-bottom-1
            capitalize
          "
        >
          You've found <span class="rarity-rare">an altar</span>!
        </div>
        <p class="description font-size-22">
          Nice! You recieved
          <span :class="[{[types.Energy]: 'energy-hallowen', [types.Health]: 'icon-health'}[altar.type]]"></span>&nbsp;
          <span :class="[{[types.Energy]: 'color-energy', [types.Health]: 'color-hp'}[altar.type]]">
            {{ altar.restoreValue }}&nbsp;{{ $t({[types.Energy]: 'energy', [types.Health]: 'health'}[altar.type]) }}
          </span>.
        </p>
        <img :src="altarImage" alt="" class="popup-img" />
      </div>
    </template>

    <template v-slot:footer>
      <div class="flex width-100 flex-evenly-spaced">
        <CustomButton width="30%" type="green" @click="$close(true)">
          {{ $t('btn-continue') }}
        </CustomButton>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import CustomButton from "@/components/Button.vue";
import altars from "@/metadata/halloween/dungeon_altars.json";
import { AltarType } from "@/../../knightlands-shared/dungeon_types";

export default {
  props: ["altarId"],
  components: { UserDialog, CustomButton },
  data: () => ({
    types: AltarType
  }),
  computed: {
    altar() {
      return altars[this.altarId];
    },
    altarImage() {
      return `/images/halloween_assets/${this.altar.image}.png`;
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "../../../style/common.less";

.description {
  padding: 0 5%;
}
.popup-img {
  max-height: 20vh;
}
.flex-evenly-spaced {
  justify-content: space-evenly;
}
.color-energy {
  color: rgb(165 230 118);
}
.color-hp {
  color: #f44a64;
}
.energy-hallowen {
  .icon_nrg_halloween;
  .icon();
}
</style>
