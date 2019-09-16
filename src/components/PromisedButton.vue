<template>
  <CustomButton v-bind="props" :disabled="disabled" :locked="locked" @click="$emit('click')">
    <keep-alive>
      <template v-if="showLoading">
        <LoadingIndicator color="#4e3948" type="scale"></LoadingIndicator>
      </template>
      <template v-else>
        <slot></slot>
      </template>
    </keep-alive>
  </CustomButton>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";

export default {
  props: ["promise", "props", "loadingAsDefault", "disabled", "locked"],
  components: { CustomButton, LoadingIndicator },
  data: () => ({
    showLoading: false
  }),
  mounted() {
    this._await();
  },
  watch: {
    promise() {
      this._await();
    }
  },
  methods: {
    async _await() {
      this.showLoading = true;

      try {
        await this.promise;
      } finally {
        this.showLoading = false;
      }
    }
  }
};
</script>