<template>
  <notifications group="levelLock" position="bottom center">
    <!-- <template v-slot:body="props">
      <div class="flex flex-center n-lock-s" @click="props.close">
        <div class="font-size-22 font-weight-900">
          {{ $t("s-locked", { lvl: props.item.data.level }) }}
        </div>
      </div>
    </template> -->
  </notifications>
</template>

<style lang="less" scoped>
.close-btn {
  position: absolute;
  right: 1rem;
  top: 1rem;
  cursor: pointer;
}

.n-lock-s {
  padding: 10px;
  margin: 0 5px 5px;

  font-size: 12px;
  color: #ff002c;

  background: #193f5f;
  border-left: 5px solid #2e7285;
  width: 50%;
}
</style>
