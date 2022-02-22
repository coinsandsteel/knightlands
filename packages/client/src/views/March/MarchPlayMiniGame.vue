<template>
  <UserDialog title="Mini game???" emitClose hideCloseBtn>
    <template v-slot:content>
      <div class="text-center padding-bottom-2 font-size-20">
        Select 1 chest???
      </div>
      <div class="flex flex-row flex-no-wrap flex-space-around">
        <div
          class="march-lock font-size-20 pointer"
          v-for="(lock, lockIndex) in locks"
          :key="lockIndex"
          @click="lockSelectHandler(lockIndex)"
        ></div>
      </div>
    </template>
    <!-- <template v-slot:footer>
      <CustomButton type="green" @click="close"
        >{{ $t("close???") }}
      </CustomButton>
    </template> -->
  </UserDialog>
</template>
<script>
import { mapState } from "vuex";
export default {
  // data() {
  //   return {};
  // },
  computed: {
    ...mapState("march", ["miniGameResult"]),
    locks() {
      const result = [];
      result.push({ isMatched: false });
      result.push({ isMatched: false });
      result.push({ isMatched: true });

      return result;
    }
  },
  watch: {
    miniGameResult(value) {
      this.close(value ? !!value.isSuccess : false);
    }
  },
  methods: {
    close(result) {
      this.$close(result);
    },
    async testMiniGameResult(isSuccess) {
      this.$store.commit("march/updateState", {
        miniGameResult: { isSuccess }
      });
    },
    lockSelectHandler(index) {
      // this.close();
      this.$store.dispatch("march/openChest", index);
      // this.testMiniGameResult(index === 2);
    }
  }
};
</script>
<style scoped lang="less">
.march-lock {
  width: 40px;
  height: 40px;
  background: url("/images/march/icon_chest.png") center / 100% no-repeat;
  color: #222;
  margin-left: 8px;
  margin-right: 8px;
}
</style>
