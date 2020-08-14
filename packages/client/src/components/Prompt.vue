<template>
  <user-dialog :title="$t(title)" @close="$close(false)">
    <template v-slot:content>
      <div class="font-size-20 margin-top-2" v-html="$t(message)"></div>
    </template>
    <template v-slot:footer>
      <div class="flex flex-center button-container">
        <custom-button
          v-for="(btn, index) in buttons"
          :key="index"
          :class="btn.type"
          @click="$close(btn.response)"
        >{{$t(btn.title)}}</custom-button>
      </div>
    </template>
  </user-dialog>
</template>

<script>
import UserDialog from "./UserDialog.vue";
import CustomButton from "./Button.vue";

export default {
  components: {
    UserDialog,
    CustomButton
  },
  props: ["title", "message", "buttons"]
};
</script>

<style lang="less" scoped>
.button-container {
  width: 100%;
  justify-content: space-evenly;
}
</style>

