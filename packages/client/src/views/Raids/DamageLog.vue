<template>
  <div
    class="flex flex-column flex-items-end flex-end width-100 height-100 flex-start"
  >
    <div
      class="mask width-100 height-100 flex flex-column flex-no-wrap flex-items-center flex-end"
    >
      <div class="close-btn" @click="$emit('close')"></div>

      <div class="width-100" v-bar>
        <div>
          <div
            class="font-size-18 margin-top-1 font-weight-700 flex flex-start flex-items-center width-100"
            v-for="record in log"
            :key="record.id"
            :class="{ 'new-line': record.new }"
          >
            <span class="damage trim-text width-50">{{ record.name }}</span>
            <IconWithValue iconClass="icon-attack small">
              <span class="margin-right-1"
                >{{ record.damage }} x{{ record.hits }}</span
              >
            </IconWithValue>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  props: ["log"],
  components: { IconWithValue },
  created() {
    this.lastLogId = -1;
    this.newLogs = [];
    this.newTimeout = null;
  },
  watch: {
    log() {
      // animate last added lines
      let i = 0;
      const length = this.log.length;

      for (; i < length; ++i) {
        let log = this.log[i];
        if (log.id > this.lastLogId) {
          this.lastLogId = log.id;
          this.$set(log, "new", true);
          this.newLogs.push(log);
        }
      }

      clearTimeout(this.newTimeout);
      this.newTimeout = setTimeout(() => {
        let i = 0;
        const length = this.newLogs.length;
        for (; i < length; ++i) {
          this.newLogs[i].new = false;
        }
      }, 100);
    }
  }
};
</script>

<style lang="less" scoped>
.mask {
  background-color: #000000c9;
  overflow: hidden;
  z-index: 1;
}

.damage {
  margin-right: 2rem;
  transition: all 1s ease;
}

.new-line {
  color: red;
  transition: none;
}
</style>
