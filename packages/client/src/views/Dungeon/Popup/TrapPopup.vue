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
          Oh no! You've got caught in <span class="rarity-mythical">a trap</span>!
        </div>
        <p class="description font-size-25">
          You can try to break the trap open for 
          <span class="energy-hallowen"></span>&nbsp;<span class="color-en">{{ trap.damage }}&nbsp;Energy</span> with certain chance of success.<br/> 
          Or you can use <span class="key-halloween"></span>&nbsp;<span class="rarity-epic">Trap&nbsp;Key</span> to release immideately.
        </p>
        <img :src="trapImage" alt="" class="popup-img" />
      </div>
    </template>

    <template v-slot:footer>
      <div class="flex width-100 flex-evenly-spaced margin-bottom-1">
        <div class="asset-lot font-size-20">
          <span class="key-halloween"></span>
          &nbsp;
          <span class="rarity-epic">1x Trap Key</span>
        </div>
        <div class="asset-lot font-size-20">
          <span class="energy-hallowen"></span>
          &nbsp;
          <span class="color-en">{{ trap.damage }}&nbsp;{{ $t('energy') }}</span>
        </div>
      </div>
      <div class="flex width-100 flex-evenly-spaced">
        <CustomButton width="30%" type="blue" @click="$close('open')">
          Release
        </CustomButton>
        <CustomButton width="30%" type="yellow" @click="$close('break')">
          Break Trap
        </CustomButton>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import CustomButton from "@/components/Button.vue";
import traps from "@/metadata/halloween/dungeon_traps.json";

export default {
  props: ["trapId"],
  components: { UserDialog, CustomButton },
  computed: {
    trap() {
      return traps[this.trapId];
    },
    trapImage() {
      return `/images/halloween_assets/${this.trap.image}.png`;
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
