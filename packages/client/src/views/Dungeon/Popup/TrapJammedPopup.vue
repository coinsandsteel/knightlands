<template>
  <UserDialog :emitClose="true">
    <template v-slot:content>
      <div class="flex flex-column flex-center flex-start">
        <p class="description font-size-25">
          Trap jammed! It's not dangerous anymore.
        </p>
        <img :src="trapImage" alt="" class="popup-img" />
      </div>
    </template>

    <template v-slot:footer>
      <div class="flex flex-center">
        <CustomButton width="30%" type="yellow" @click="$close">
          {{ $t("btn-ok") }}
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
  props: ["trapId"],
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
