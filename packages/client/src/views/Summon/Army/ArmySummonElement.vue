<template>
  <div class="flex flex-column flex-end padding-bottom-2">
    <FreeSummon :info="info" @summon="summon(1)">
      <CustomButton
        type="yellow"
        v-if="summonType == ArmySummonType.Normal"
        @click="showPopup"
      >{{$t("basic-summon")}}</CustomButton>
      <CustomButton type="yellow" v-else @click="showPopup">{{$t("advanced-summon")}}</CustomButton>
    </FreeSummon>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import ArmySummonType from "@/../../knightlands-shared/army_summon_type";
import FreeSummon from "./FreeSummon.vue";

import ArmySummonPopup from "./ArmySummonPopup.vue";
import { create } from "vue-modal-dialogs";
const SummonPopup = create(
  ArmySummonPopup,
  "info",
  "summonType",
  "fetchRequest",
  "summonCb",
  "purchaseSummonCb",
  "continuePurchaseCb"
);

export default {
  props: ["info", "summonType", "fetchRequest"],
  components: { CustomButton, FreeSummon },
  data: () => ({
    ArmySummonType
  }),
  watch: {
    fetchRequest() {
      if (this.popup) {
        this.popup.fetchRequest = this.fetchRequest;
      }
    }
  },
  methods: {
    async showPopup() {
      let popup = SummonPopup(
        this.info,
        this.summonType,
        this.fetchRequest,
        this.summon,
        this.purchaseSummon,
        this.continuePurchase
      );
      
      this.popup = await popup.getInstance();
    },
    summon(count) {
      this.$emit("summon", this.summonType, count);
    },
    purchaseSummon(iap) {
      console.log(iap);
      this.$emit("purchaseSummon", this.summonType, iap);
    },
    continuePurchase(payload) {
      this.$emit("continuePurchase", payload);
    }
  }
};
</script>
