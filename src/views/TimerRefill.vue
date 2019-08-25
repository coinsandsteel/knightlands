<template>
  <user-dialog :title="$t(title)" @close="$close(false)">
    <template v-slot:content>
      <div class="flex flex-column">
        <div class="font-size-20">{{$t("refill-message")}}</div>

        <button-bar class="margin-top-2 margin-bottom-2" :sections="methods" v-model="methodChosen"></button-bar>

        <div class="flex refill-method-content">
          <div class="flex flex-basis-100 flex-column flex-item-center" v-show="methodChosen == 0">
            <!-- Native Currency -->
            <div class="flex flex-column flex-center flex-1">
              <div class="flex flex-center margin-bottom-2 font-size-20">
                <div>Price to restore 100% of {{stat}}:</div>
                <div class="digit-font">9999 TRX</div>
              </div>

              <div class="flex flex-center font-size-15">Refills today: {{refillsToday}}</div>
            </div>

            <custom-button width="16rem" type="green" @click="confirm">CONFIRM</custom-button>
          </div>

          <div v-show="methodChosen == 1">
            <!-- Shinies -->
            <custom-button width="16rem" type="green" @click="confirm">CONFIRM</custom-button>
          </div>

          <div v-show="methodChosen == 2">
            <!--Items -->
            <custom-button width="16rem" type="green" @click="confirm">CONFIRM</custom-button>
          </div>
        </div>
      </div>
    </template>
  </user-dialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import CustomButton from "@/components/Button.vue";
import ButtonBar from "@/components/ButtonBar.vue";
import CharacterStats from "@/../knightlands-shared/character_stat";

export default {
  props: ["stat"],
  components: { UserDialog, CustomButton, ButtonBar },
  data() {
    return {
      methodChosen: 0,
      methods: ["trx", "shinies", "items"],
      refillsToday: 8
    };
  },
  computed: {
    title() {
      switch (this.stat) {
        case CharacterStats.Health:
          return "health-refill-title";

        case CharacterStats.Stamina:
          return "stamina-refill-title";

        case CharacterStats.Energy:
          return "energy-refill-title";
      }
    }
  },
  methods: {
    async confirm() {
      await this.$game.refillTimer(this.stat, this.methodChosen);

      this.$close();
    }
  }
};
</script>

<style lang="less" scoped>
.refill-method-content {
  height: 50vh;
}
</style>


