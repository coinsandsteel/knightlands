<template>
  <UserDialog title="Mini game???" emitClose hideCloseBtn>
    <template v-slot:content>
      <div
        class="text-center padding-bottom-2 font-size-20"
        :class="{ 'opacity-0': isResultVisible }"
      >
        Select a chest???
      </div>
      <div class="flex flex-row flex-no-wrap flex-space-around">
        <div
          class="march-lock font-size-20 pointer relative"
          v-for="(lock, lockIndex) in locks"
          :key="lockIndex"
          @click="lockSelectHandler(lockIndex)"
        >
          <transition name="result-fade">
            <div
              v-if="selectedIndex === lockIndex && isResultVisible"
              class="mini-game-result absolute"
              :class="{ 'mini-game-result--success': isSuccess }"
            >
              {{ isSuccess ? "Success???" : "Fail???" }}
            </div>
          </transition>
        </div>
      </div>
    </template>
  </UserDialog>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      selectedIndex: null,
      isSuccess: false,
      isResultVisible: false
    };
  },
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
      this.isSuccess = !!value.isSuccess;
      this.isResultVisible = true;

      setTimeout(() => {
        this.close(value ? !!value.isSuccess : false);
      }, 1000);
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
      if (this.selectedIndex !== null) {
        return;
      }
      this.selectedIndex = index;
      this.$store.dispatch("march/openChest", index);
      // this.testMiniGameResult(index === 2);

      // @todo: remove
      // setTimeout(() => {
      //   this.testMiniGameResult(false);
      // }, 500);
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
.mini-game-result {
  color: #fff;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -300%);
  text-shadow: 1px 1px 2px #000;
}
.mini-game-result--success {
  color: #ffd766;
}
.result-fade-enter-active,
.result-fade-leave-active {
  transition: all 0.4s;
}
.result-fade-enter,
.result-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 0);
}
</style>
