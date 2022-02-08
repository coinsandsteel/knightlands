<template>
  <UserDialog title="Mini game???" emitClose hideCloseBtn>
    <template v-slot:content>
      <div class="text-center padding-top-2 padding-bottom-2 font-size-20">Keys: 1</div>
      <div class="flex flex-row flex-no-wrap flex-space-around">
        <div
          class="march-lock font-size-20"
          v-for="(lock, lockIndex) in locks"
          :key="lockIndex"
          @click="lockSelectHandler"
        >
          Lock
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CustomButton type="green" @click="close"
        >{{ $t("close???") }}
      </CustomButton>
    </template>
  </UserDialog>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    locks() {
      const result = [];
      result.push({ isMatched: false });
      result.push({ isMatched: false });
      result.push({ isMatched: true });

      return result;
    }
  },
  methods: {
    close() {
      this.$close("dialog result 123");
    },
    lockSelectHandler() {
      this.close();
    }
  }
};
</script>
<style scoped lang="less">
.march-lock {
  width: 40px;
  height: 40px;
  background: #ccc;
  color: #222;
  margin-left: 8px;
  margin-right: 8px;
}
</style>
