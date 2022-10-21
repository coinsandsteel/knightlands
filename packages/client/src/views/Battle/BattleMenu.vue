<template>
  <div class="screen-content">
    <div class="screen-background art"></div>

    <div class="flex flex-column flex-full overflow-auto" v-bar>
    <div>
      <div class="height-100 flex flex-column flex-no-wrap">
        <BattleUserBalance
          class="width-100 flex flex-center padding-top-1 padding-bottom-1 relative"
        >
        </BattleUserBalance>

        <img
            class="battle-of-heroes"
            src="/images/battle/battle-of-heroes2.png"
          />
          
        <div class="font-size-22 height-100_ flex-full flex flex-center">
          <div>
            <div>
              <CustomButton
                type="blue"
                class="inline-block margin-right-2 margin-top-2"
                @click="goToAdventure"
              >
                Adventure
              </CustomButton>
            </div>
            <div>
              <CustomButton
                type="blue"
                class="inline-block margin-right-2 margin-top-2"
                @click="goToDuels"
              >
                Duels
              </CustomButton>
            </div>
            <div>
              <CustomButton
                type="blue"
                class="inline-block margin-right-2 margin-top-2"
                @click="goToSquad"
              >
                Squad
              </CustomButton>
            </div>
            <div>
              <CustomButton
                type="blue"
                class="inline-block margin-right-2 margin-top-2"
                @click="goToUnitsList"
              >
                Inventory
              </CustomButton>
            </div>
            <div>
              <CustomButton
                type="blue"
                class="inline-block margin-right-2 margin-top-2"
                @click="goToMerger"
              >
                Merger
              </CustomButton>
            </div>
            <div>
              <CustomButton
                type="blue"
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
    </div>
  </div>
  </div>
  
</template>
<script>
import { mapState } from "vuex";
// import { create } from "vue-modal-dialogs";
import * as battle from "@/../../knightlands-shared/battle";
import AppSection from "@/AppSection.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
import BattleUserBalance from "@/views/Battle/BattleUserBalance.vue";
// import ItemsReceived from "@/components/ItemsReceived.vue";

export default {
  mixins: [AppSection, ActivityMixin],
  components: {
    BattleUserBalance
  },
  data() {
    return {
      BATTLE_MAX_ENERGY: battle.BATTLE_MAX_ENERGY
    };
  },
  computed: {
    ...mapState("battle", ["user"]),
    energy() {
      return this.user.balance.energy;
    }
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
      this.$router.push({ name: "battle-squad" });
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
.battle-of-heroes {
  position: relative;
  padding-top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-height: unset;
}

.art {
  background-image: url("../../assets/backgrounds/heroes-bg1.jpg");
  background-size: contain;
  background-position: bottom;
  background-repeat: no-repeat;
}

</style>
