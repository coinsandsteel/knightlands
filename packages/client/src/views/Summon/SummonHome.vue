<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <div
      class="flex flex-column width-100 flex-center flex-space-evenly margin-bottom-5"
    >
      <!-- <MenuIconRow>
        <MenuIcon icon="icon-chests" to="chests" :append="true">
          {{$t("btn-chests")}}
          <template v-slot:marker>
            <FreeChestsMarker></FreeChestsMarker>
          </template>
        </MenuIcon>

        <MenuIcon icon="icon-shop" to="shop" :append="true">{{$t("btn-shop")}}</MenuIcon>
      </MenuIconRow>

      <CustomButton type="green" @click="goTo('army-summon-menu')">Summon Gates</CustomButton> -->

      <div class="army-summon flex flex-center" @click="goTo('army-summon-menu')">
        <img src="../../assets/ui/01_summon.png" />
        <span>{{ $t("shop-summon") }}</span>
      </div>

      <div class="shop flex flex-center" @click="goTo('shop')">
        <img src="../../assets/ui/02_MARKET.png" />
        <span>{{ $t("shop-shop") }}</span>
      </div>

      <div class="chests flex flex-center" @click="goTo('chests')">
        <img src="../../assets/ui/03_chests.png" />
        <span>{{ $t("shop-chests") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import CustomButton from "@/components/Button.vue";
import FreeChestsMarker from "@/components/Markers/FreeChestsMarker.vue";
import MenuIcon from "@/components/MenuIcon.vue";
import MenuIconRow from "@/components/MenuIconRow.vue";

export default {
  mixins: [AppSection],
  components: { FreeChestsMarker, MenuIcon, MenuIconRow, CustomButton },
  created() {
    this.title = this.$t("window-title-summon");
  },
  methods: {
    goTo(route) {
      this.$router.push({ name: route });
    }
  }
};
</script>

<style lang="less" scoped>
.shop-btn() {
  position: relative;
  width: 100%;

  & img {
    max-width: 100%;
  }

  & span {
    position: absolute;
    font-size: 4rem;
    text-transform: uppercase;
    font-weight: 900;
    text-shadow: 1px 1px #210028, -1px 1px #210028, 1px -1px #210028,
      -1px -1px #210028;
  }
}

.army-summon {
  .shop-btn();

  & span {
    top: 55%;
  }
}

.shop {
  .shop-btn();

  & span {
    top: 60%;
    left: 52%;
  }
}

.chests {
  .shop-btn();

  & span {
    top: 60%;
    left: 30%;
  }
}
</style>
