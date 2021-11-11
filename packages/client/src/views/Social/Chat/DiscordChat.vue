<template>
  <div class="screen-content">
    <iframe
      src="https://emerald.widgetbot.io/channels/694928249167282176/699540977773183066"
      class="embed"
    ></iframe>
  </div>
</template>

<script>
import { Client } from "@widgetbot/embed-api";

export default {
  props: {
    server: {
      type: String,
      default: "299881420891881473"
    },
    shard: {
      type: String,
      default: "https://e.widgetbot.io"
    },
    channel: String,
    options: Object,
    defer: Boolean
  },
  mounted() {
    this.id = this.generateUUID();
    this.api = new Client({
      id: this.id,
      iframe: this.$refs.iframe
    });
  },
  computed: {
    url() {
      if (this.defer) return "";

      return `${this.shard}/channels/${this.server}${
        this.channel ? `/${this.channel}` : ""
      }/${this.searchParams({
        ...this.options,
        api: this.id
      })}`;
    }
  },
  methods: {
    searchParams(obj) {
      return (
        "?" +
        Object.keys(obj)
          .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
          .join("&")
      );
    },
    generateUUID() {
      let d = new Date().getTime();
      if (
        typeof performance !== "undefined" &&
        typeof performance.now === "function"
      ) {
        d += performance.now(); // use high-precision timer if available
      }
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.embed {
  width: 100%;
  height: 100%;
  border: none;
}

.root {
  display: inline-block;
  overflow: hidden;
  // background-color: rgb(54, 57, 62);
  vertical-align: top;
  height: 100%;
}
</style>
