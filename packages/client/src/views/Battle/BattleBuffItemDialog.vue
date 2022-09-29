<template>
  <UserDialog :title="title" :hideCloseBtn="false" @close="closeHandler">
    <template v-slot:content>
      <div class="flex flex-center font-size-22 text-align-left">
        <div>
          <BattleUnitBuff :buff="buff" @click.native="showBuffItem(buffItem)" />
        </div>
        <div class="flex-grow margin-left-2">
          {{ description }}
        </div>
      </div>
      <div class="text-align-center margin-top-4">
        <CustomButton
          type="yellow"
          class="inline-block"
          width="15rem"
          @click="closeHandler"
        >
          Close
        </CustomButton>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import { mapState } from "vuex";
import BattleUnitBuff from "@/views/Battle/BattleUnitBuff.vue";
import * as battle from "@/../../knightlands-shared/battle";

export default {
  components: {
    BattleUnitBuff
  },
  props: {
    buff: Object
  },
  computed: {
    ...mapState("battle", ["game", "user"]),
    title() {
      if (!this.buff) {
        return "";
      }

      const titles = {
        terrain: "Terrain",
        buff: "Buff",
        "self-buff": "Self buff",
        "de-buff": "De-buff"
      };

      return titles[this.buff.source] || "";
    },
    description() {
      if (!(this.buff && "caseId" in this.buff)) {
        return "";
      }

      return battle.BUFFS[this.buff.sourceId].cases[this.buff.caseId];
    }
  },
  methods: {
    closeHandler() {
      if (this.$close) {
        this.$close();
      }
    }
  }
};
</script>
<style scoped lang="less"></style>
