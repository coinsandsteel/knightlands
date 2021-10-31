<template>
  <UserDialog :emitClose="true" :hideCloseBtn="true">
    <template v-slot:content>
      <div class="flex flex-column flex-center flex-start">
        <div
          class="
            font-size-30
            enemy-title-font
            font-outline
            margin-bottom-1
          "
        >
          {{ $t('you-caught') }}
          <span class="rarity-mythical">{{ $t('trap') }}</span>!
        </div>
        <p class="description font-size-25">
          {{ $t('try-to-break') }}
          <span class="energy-hallowen"></span>&nbsp;<span class="color-en"
            >{{ energyCost }}&nbsp;{{ $t("energy") }}</span
          >
          {{ $t('certain-chance') }}.<br />
          {{ $t('you-can-use') }} <span class="key-halloween"></span>&nbsp;<span
            class="rarity-epic"
            >{{ $t('trap-key') }}</span
          >
          {{ $t('release-immediately') }}.
        </p>
        <img :src="trapImage" alt="" class="popup-img" />
      </div>
    </template>

    <template v-slot:footer>
      <div class="flex width-100 flex-evenly-spaced margin-bottom-1">
        <div class="asset-lot font-size-20">
          <span class="key-halloween"></span>
          &nbsp;
          <span class="rarity-epic">1x {{ $t('trap-key') }}</span>
        </div>
        <div class="asset-lot font-size-20">
          <span class="energy-hallowen"></span>
          &nbsp;
          <span class="color-en">{{ energyCost }}&nbsp;{{ $t("energy") }}</span>
        </div>
      </div>
      <div class="flex width-100 flex-evenly-spaced">
        <CustomButton
          width="30%"
          type="blue"
          @click="$close('open')"
          :disabled="user.key <= 0"
        >
          {{ $t("release") }}
        </CustomButton>
        <CustomButton width="30%" type="yellow" @click="$close('break')">
          {{ $t("break-trap") }}
        </CustomButton>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import CustomButton from "@/components/Button.vue";
import Meta from "@/metadata/halloween/dungeon_meta.json";
import traps from "@/metadata/halloween/dungeon_traps.json";
import { mapState } from "vuex";

export default {
  props: ["cell"],
  components: { UserDialog, CustomButton },
  computed: {
    ...mapState({
      user: state => state.dungeon.user
    }),
    energyCost() {
      return Meta.costs.trap;
    },
    trapImage() {
      return `/images/halloween_assets/${traps[this.trapId].image}.png`;
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
.color-en {
  color: rgb(165 230 118);
}
.energy-hallowen {
  .icon_nrg_halloween;
  .icon();
}
.key-halloween {
  background-image: url("/images/halloween_assets/items/key.png");
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 100%;
  .icon();
}
.asset-lot {
  width: 30%;
  text-align: center;
}
</style>
