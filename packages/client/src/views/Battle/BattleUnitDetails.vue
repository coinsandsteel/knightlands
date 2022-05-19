<template>
  <div class="flex flex-column">
    <div class="screen-background"></div>
    <div
      class="flex dummy-height flex-no-wrap full-flex flex-column overflow-auto"
    >
      <div class="screen-content ">
        <div class="font-size-22 height-100">
          <div>
            <div>
              <BattleUnit />
            </div>
            <div>Level: 123456</div>
            <div class="flex">
              <div>Exp:</div>
              <ProgressBar
                v-model="expValue"
                :expand="false"
                height="2rem"
                class="full-flex"
                barType="green"
                :maxValue="10"
                :plusButton="'green'"
                @refill="refillHandler"
              ></ProgressBar>
            </div>
            <div>
              <div>Hp - 14</div>
              <div>Defense - 3</div>
              <div>Damage - 6</div>
            </div>
            <div>
              <div class="flex">
                <div>
                  Ability 1
                </div>
                <ProgressBar
                  v-model="expValue"
                  :expand="false"
                  height="2rem"
                  class="full-flex"
                  barType="green"
                  :maxValue="10"
                  :plusButton="'green'"
                  @refill="refillHandler"
                ></ProgressBar>
              </div>
              <div class="flex">
                <div>
                  Ability 2
                </div>
                <ProgressBar
                  v-model="expValue"
                  :expand="false"
                  height="2rem"
                  class="full-flex"
                  barType="green"
                  :maxValue="10"
                  :plusButton="'green'"
                  @refill="refillHandler"
                ></ProgressBar>
              </div>
              <div class="flex">
                <div>
                  Ability 3
                </div>
                <ProgressBar
                  v-model="expValue"
                  :expand="false"
                  height="2rem"
                  class="full-flex"
                  barType="green"
                  :maxValue="10"
                  :plusButton="'green'"
                  @refill="refillHandler"
                ></ProgressBar>
              </div>
            </div>
            <!-- <div class="battle-squad-unit-info font-size-22 text-align-left">
              <div>
                Ability 1
                <ProgressBar
                  v-model="expValue"
                  :expand="false"
                  height="2rem"
                  class="full-flex"
                  barType="green"
                  :maxValue="10"
                  :plusButton="'green'"
                  @refill="refillHandler"
                ></ProgressBar>
              </div>
              <div>
                Ability 2
                <ProgressBar
                  v-model="expValue"
                  :expand="false"
                  height="2rem"
                  class="full-flex"
                  barType="green"
                  :maxValue="10"
                  :plusButton="'green'"
                  @refill="refillHandler"
                ></ProgressBar>
              </div>
              <div>Defense - 3</div>
              <div>
                Ability 3
                <ProgressBar
                  v-model="expValue"
                  :expand="false"
                  height="2rem"
                  class="full-flex"
                  barType="green"
                  :maxValue="10"
                  :plusButton="'green'"
                  @refill="refillHandler"
                ></ProgressBar>
              </div>
              <div>Speed - 14</div>
              <div></div>
              <div>Initiative - 14</div>
              <div></div>
              <div class="col-span-2">
                Exp:
                <ProgressBar
                  v-model="expValue"
                  :expand="false"
                  height="2rem"
                  class="full-flex"
                  barType="green"
                  :maxValue="10"
                  :plusButton="'green'"
                  @refill="refillHandler"
                ></ProgressBar>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>

    <portal to="footer" :slim="true" v-if="false && isActive">
      <CustomButton type="grey">{{ $t("btn-filter") }}</CustomButton>
    </portal>
  </div>
</template>
<script>
// import { mapGetters } from "vuex";

import { create } from "vue-modal-dialogs";
import BattleUnit from "@/views/Battle/BattleUnit.vue";
import BattleLevelUpConfirm from "@/views/Battle/BattleLevelUpConfirm.vue";
import AppSection from "@/AppSection.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
// import BattleUnitList from "@/views/Battle/BattleUnitList.vue";

export default {
  mixins: [AppSection, NetworkRequestErrorMixin, ActivityMixin],
  components: {
    BattleUnit
  },
  data() {
    return {
      expValue: 0,
      unit: { id: 123 }
    };
  },
  computed: {},
  created() {
    this.title = this.$t("battle-unit");
  },
  methods: {
    handleBackButton() {
      console.log("handleBackButton 123");
      this.$router.replace({ name: "battle-units" });
      return true;
    },
    async refillHandler() {
      const show = create(BattleLevelUpConfirm);
      await show();
    }
  }
};
</script>
<style scoped lang="less">
.battle-unit {
  width: 100px;
  margin: 0 auto;
}
.battle-squad-unit-info {
  display: grid;
  grid-template-columns: repeat(2, 50%);
}
.col-span-2 {
  grid-column: span 2 / span 2;
}
</style>
