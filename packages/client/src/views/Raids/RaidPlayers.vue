<template>
  <UserDialog title="raid-pl">
    <template v-slot:content>
      <div class="flex flex-column">
        <div
          class="flex flex-item-center font-size-20 width-100 text-align-left pointer"
          :class="[
            { 'even-bg': (index + 1) % 2 == 0 },
            { 'yellow-title': you }
          ]"
          :style="{ height: `${height}px` }"
          @click="preview"
        >
          <span :class="rankIcon" class="flex-1"></span>
          <span class="flex-1">#{{ rank }}</span>
          <Avatar :preview="true" :avatar="avatar" :mini="true"></Avatar>
          <span class="flex-4">{{ id }}</span>
          <span class="flex-3">{{ score }}</span>
          <!-- <span @click="preview" class="icon-preview flex-1 pointer"></span> -->
        </div>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";

export default {
  components: { UserDialog },
  props: ["participants"]
};
</script>

<style lang="less" scoped>
.even-bg {
  background-color: #303048;
}
</style>
