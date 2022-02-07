<template>
  <UserDialog @close="$close(true)">
    <template v-slot:content>
      <div class="flex flex-column flex-center flex-start">
        <div
          class="
            font-size-30
            rarity-rare
            font-outline
            margin-bottom-2
            capitalize
          "
        >
          {{ $t('you-found') }} <span class="rarity-rare">{{ $t('altar') }}</span>!
        </div>
        <div class="description font-size-22 flex flex-center">
          {{ $t('you-receive') }}
          <IconWithValue class="margin-left-1" :iconClass="icon">{{
            altar.restoreValue
          }}</IconWithValue>
          <!-- <span
            :class="[
              {
                [types.Energy]: 'h-energy',
                [types.Health]: 'icon-health'
              }[altar.type]
            ]"
          ></span
          >&nbsp;
          <span
            :class="[
              { [types.Energy]: 'color-energy', [types.Health]: 'color-hp' }[
                altar.type
              ]
            ]"
          >
            {{ altar.restoreValue }}&nbsp;{{
              $t(
                { [types.Energy]: "energy", [types.Health]: "health" }[
                  altar.type
                ]
              )
            }} </span
          >. -->
        </div>
        <img :src="altarImage" alt="" class="popup-img" />
      </div>
    </template>

    <template v-slot:footer>
      <div class="flex width-100 flex-evenly-spaced">
        <CustomButton width="30%" type="green" @click="$close(true)">
          {{ $t("btn-use") }}
          <IconWithValue class="margin-left-1" iconClass="h-energy">{{
            energy
          }}</IconWithValue>
        </CustomButton>

        <CustomButton width="30%" type="red" @click="$close(false)">
          {{ $t("btn-cancel") }}
        </CustomButton>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import CustomButton from "@/components/Button.vue";
import altars from "@/metadata/halloween/dungeon_altars.json";
import meta from "@/metadata/halloween/dungeon_meta";
import { AltarType } from "@/../../knightlands-shared/dungeon_types";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  props: ["altarId"],
  components: { UserDialog, CustomButton, IconWithValue },
  data: () => ({
    types: AltarType
  }),
  computed: {
    energy() {
      return meta.costs.altar;
    },
    altar() {
      return altars[this.altarId];
    },
    altarImage() {
      return `/images/halloween_assets/${this.altar.image}.png`;
    },
    icon() {
      if (this.altar.type == AltarType.Energy) {
        return "h-energy";
      } else {
        return "icon-health";
      }
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
  color: rgb(165, 230, 118);
}
.color-hp {
  color: #f44a64;
}
.energy-hallowen {
  .icon_nrg_halloween;
  .icon();
}
</style>
