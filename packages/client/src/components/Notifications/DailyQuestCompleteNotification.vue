<template>
  <notifications group="daily" position="top" width="inherit">
    <template v-slot:body="props">
      <div
        class="flex flex-column flex-center color-panel-2"
        @click="props.close"
      >
        <template>
          <div
            class="title font-size-25 font-weight-900 font-outline margin-bottom-2"
          >
            {{ $t("task-complete", { task: $t(props.item.data.type) }) }}
          </div>

          <custom-button @click="openDailyTasks">{{
            $t("btn-open")
          }}</custom-button>
        </template>
      </div>
    </template>
  </notifications>
</template>

<script>
import CustomButton from "@/components/Button.vue";
export default {
  components: { CustomButton },
  methods: {
    openDailyTasks() {
      this.$router.push({
        name: "daily-tasks"
      });
    }
  }
};
</script>

<style lang="less" scoped>
.close-btn {
  position: absolute;
  right: 1rem;
  top: 1rem;
  cursor: pointer;
}
</style>
