<template>
  <div class="screen-content">
    <div class="screen-background army-bg panel-input"></div>

    <div class="flex flex-items-end flex-space-between margin-bottom-half panel-input padding-1">
      <span class="font-size-20">{{$t("legion-n", {n: 1})}}</span>
      <div class="flex flex-center">
        <span class="margin-right-1 font-size-15">{{$t("damage")}}</span>
        <span class="font-size-20 font-weight-900">999999</span>
      </div>
    </div>

    <div class="dummy-height flex-full">
      <div class="width-100 height-100 dummy-height" v-bar>
        <div class="flex flex-column padding-1">
          <div class="flex flex-column">
            <span class="font-size-18 margin-bottom-1 title">{{$t("generals")}}</span>
            <div class="flex flex-center width-100">
              <UnitSlot />
              <UnitSlot :empty="true" />
              <UnitSlot :empty="true" />
            </div>

            <span class="font-size-18 margin-bottom-1 margin-top-1 title">{{$t("troops")}}</span>
            <div class="flex flex-center width-100">
              <UnitSlot />
              <UnitSlot />
              <UnitSlot />
              <UnitSlot />
              <UnitSlot />
              <UnitSlot />
            </div>
          </div>
        </div>
      </div>
    </div>

    <portal to="footer">
      <CustomButton type="grey" @click="editGenerals">{{$t("edit-generals")}}</CustomButton>
      <CustomButton type="grey" @click="editTroops">{{$t("edit-troops")}}</CustomButton>
    </portal>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import CustomButton from "@/components/Button.vue";
import Loot from "@/components/Loot.vue";
import Unit from "./Unit.vue";
import UnitSlot from "./UnitSlot.vue";

export default {
  mixins: [AppSection],
  data: () => ({}),
  components: {
    CustomButton,
    Unit,
    UnitSlot,
    Loot
  },
  created() {
    this.title = this.$t("window-title-army-compose");
  },
  methods: {
    editGenerals() {
      this.$router.push({ name: "legion", params: { type: "generals" } });
    },
    editTroops() {
      this.$router.push({ name: "legion", params: { type: "troops" } });
    }
  }
};
</script>

<style lang="less" scoped>
.army-bg {
  background-image: url("../../assets/backgrounds/castle_blur.png");
}
</style>
