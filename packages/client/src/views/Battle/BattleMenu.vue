<template>
  <div class="screen-content ">
    <div
      class="width-100 flex flex-center padding-top-1 padding-bottom-1 relative"
    >
      <BattleCoin class="margin-left-2" :hasMargin="true" />
      <BattleCrystal class="margin-left-2" />
    </div>
    <div class="font-size-22 height-100 flex flex-center">
      <div>
        <div>
          <CustomButton
            type="green"
            class="inline-block margin-right-2 margin-top-2"
            @click="goToAdventure"
          >
            Adventure
          </CustomButton>
        </div>
        <div>
          <CustomButton
            type="green"
            class="inline-block margin-right-2 margin-top-2"
            @click="goToDuels"
          >
            Duels
          </CustomButton>
        </div>
        <div>
          <CustomButton
            type="green"
            class="inline-block margin-right-2 margin-top-2"
            @click="goToSquad"
          >
            Squad
          </CustomButton>
        </div>
        <div>
          <CustomButton
            type="green"
            class="inline-block margin-right-2 margin-top-2"
            @click="goToUnitsList"
          >
            Units
          </CustomButton>
        </div>
        <div>
          <CustomButton
            type="green"
            class="inline-block margin-right-2 margin-top-2"
            @click="goToMerger"
          >
            Merger
          </CustomButton>
        </div>
        <div>
          <CustomButton
            type="green"
            class="inline-block margin-right-2 margin-top-2"
            @click="goToShop"
          >
            Shop
          </CustomButton>
        </div>
        <!--div>
          <CustomButton
            type="blue"
            class="inline-block margin-right-2 margin-top-1"
            @click="testAbilities"
          >
            Test abilities
          </CustomButton>
        </div-->
      </div>
    </div>
  </div>
</template>
<script>
// import { create } from "vue-modal-dialogs";
import AppSection from "@/AppSection.vue";
import BattleCoin from "@/views/Battle/BattleCoin.vue";
import BattleCrystal from "@/views/Battle/BattleCrystal.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
// import ItemsReceived from "@/components/ItemsReceived.vue";

export default {
  mixins: [AppSection, ActivityMixin],
  components: {
    BattleCoin,
    BattleCrystal
  },
  data() {
    return {};
  },
  activated() {
    this.title = "battle event";
    // const show = create(ItemsReceived, "items", "battleNft");
    // show([], 3);
  },
  methods: {
    goToAdventure() {
      this.$router.push({ name: "battle-adventure" });
    },
    goToDuels() {
      this.$router.push({ name: "battle-duels" });
    },
    goToSquad() {
      this.$router.push({ name: "battle-squad-home" });
    },
    goToUnitsList() {
      this.$router.push({ name: "battle-units" });
    },
    goToMerger() {
      this.$router.push({ name: "battle-merger" });
    },
    goToShop() {
      this.$router.push({ name: "battle-shop" });
    },
    goToShop2() {
      this.$router.push({ name: "battle-shop2" });
    },
    goToChestShop() {
      this.$router.push({ name: "battle-chest-shop" });
    },
    testAbilities() {
      this.$store.dispatch("battle/testAction", {
        action: "testAbilities"
      });
    }
  }
};
</script>
<style scoped lang="less">
.btn {
  width: 30rem;
}
</style>
