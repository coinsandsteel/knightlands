<template>
  <UserDialog :title="$t('congratulations!')" @close="close">
    <template v-slot:content>
      <div
        class="width-100 height-100 dummy-height flex flex-column flex-no-wrap"
      >
        <div class="flex-full flex flex-center font-size-22">
          <div class="text-center margin-top-1">
            <div class="flex flex-no-wrap flex-justify-center">
              <div class="margin-right-2">{{ $t("coins-earned") }}:</div>
              <MarchGold :value="balance ? balance.sessionGold : 0">
                {{ hasExtraGold ? ` + ${extraGold}(20%)` : "" }}
              </MarchGold>
            </div>
            <div class="flex flex-no-wrap flex-justify-center margin-top-2">
              <div class="margin-right-2">{{ $t("bosses-killed") }}:</div>
              <MarchBosses :value="stat ? stat.bossesKilled : 0" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CustomButton type="green" class="btn-start inline-block" @click="close">
        {{ $t("btn-ok") }}
      </CustomButton>
    </template>
  </UserDialog>
</template>
<script>
import { mapState } from "vuex";
import MarchGold from "@/views/March/MarchGold.vue";
import MarchBosses from "@/views/March/MarchBosses.vue";

export default {
  components: {
    MarchGold,
    MarchBosses
  },
  computed: {
    ...mapState("march", ["balance", "stat", "pet"]),
    hasExtraGold() {
      return this.pet && this.pet.petClass === 4 && this.pet.level > 1;
    },
    extraGold() {
      if (!this.hasExtraGold) {
        return 0;
      }

      return Math.floor(
        ((this.balance && this.balance.sessionGold
          ? this.balance.sessionGold
          : 0) *
          20) /
          100
      );
    }
  },
  methods: {
    close() {
      this.$close();
    }
  }
};
</script>
