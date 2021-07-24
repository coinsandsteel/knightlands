<template>
  <CustomButton v-bind="$attrs" @click="handleClick">
    <keep-alive>
      <template v-if="showLoading || forceLoading">
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
  props: ["promise", "props", "loadingAsDefault", "forceLoading"],
  components: { CustomButton, LoadingIndicator },
  data: () => ({
    showLoading: false,
    loading: false
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
    handleClick() {
      if (!this.loading) {
        this.$emit("click");
      }
    },
    async _await() {
      if (!this.promise) {
        return;
      }

      this.loading = true;

      this._timeout = setTimeout(() => {
        this.showLoading = true;
        this._timeout = null;
      }, 200);

      try {
        await this.promise;
      } finally {
        clearTimeout(this._timeout);
        this._timeout = null;

        this.loading = false;
        this.showLoading = false;

        this.$emit("promiseFinished");
      }
    }
  }
};
</script>
