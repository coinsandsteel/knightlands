<template>
  <UserDialog title="Pet details???" emitClose @close="close">
    <template v-slot:content>
      <div class="flex flex-row flex-no-wrap">
        <div>
          <img class="pet-image" src="/images/march/pet1.png" />
        </div>
        <div class="flex flex-center font-size-22 text-align-left">
          <div>
            <div>Name</div>
            <div class="flex flex-row flex-nowrap">
              <div>Ability:</div>
              <div>description</div>
            </div>
            <div class="flex flex-row flex-nowrap">
              <div>Ability:</div>
              <div>description</div>
            </div>
            <div class="flex flex-row flex-nowrap">
              <div>Ability:</div>
              <div>description</div>
            </div>
          </div>
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
  methods: {
    close() {
      this.$close("dialog result 123");
    }
  }
};
</script>
<style scoped lang="less">
.pet-image {
  max-width: 100%;
  max-height: 40vh;
}
</style>
