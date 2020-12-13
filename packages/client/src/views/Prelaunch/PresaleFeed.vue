<template>
  <div
    class="center margin-top-1 margin-bottom-1 flex width-100 flex-center flex-space-around"
  >
    <PresaleFeedLine
      ref="preview"
      @hint="showHint"
      v-if="prevewItem"
      :feedRecord="prevewItem"
    ></PresaleFeedLine>
    <div class="flex flex-center font-size-18" v-else>
      There is no Epic or Legendary loot obtained yet.
    </div>
    <CustomButton type="yellow" @click="showAll">Show All</CustomButton>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import PresaleFeedLine from "./PresaleFeedLine.vue";
import PresaleFeedExpanded from "./PresaleFeedExpanded.vue";
import Config from "@/config";
import HintHandler from "@/components/HintHandler.vue";
import { create as CreateDialog } from "vue-modal-dialogs";
import anime from "animejs/lib/anime.es.js";

const ExpandPresaleFeed = CreateDialog(
  PresaleFeedExpanded,
  ...PresaleFeedExpanded.props
);

export default {
  mixins: [HintHandler],
  components: { CustomButton, PresaleFeedLine },
  data: () => ({
    items: [],
    prevewItem: null
  }),
  mounted() {
    this.initPresaleFeed();
  },
  destroyed() {
    if (this.channel) {
      this.channel.destroy();
    }
  },
  methods: {
    async initPresaleFeed() {
      try {
        let response = await this.$http.get(
          `${Config.httpEndpoint}/get/presaleFeed`
        );

        this.channel = this.$game.createChannel("presale", false); // do not wait for authentication
        this.channel.watch(this.updateFeed.bind(this));

        await this.updateFeed(response.body);
      } catch (exc) {
        console.error(exc);
      }
    },
    async showAll() {
      await ExpandPresaleFeed(this.items);
    },
    async updateFeed(items) {
      {
        let i = 0;
        const length = items.length;
        for (; i < length; ++i) {
          this.items.push(items[i]);
        }
      }

      if (this.items.length == 0) {
        return;
      }

      if (this.items.length > 20) {
        // this.items.splice(0, this.items.length - 20);
      }

      // hide current
      if (this.$refs.preview) {
        await anime({
          targets: this.$refs.preview.$refs.root,
          opacity: 0,
          duration: 300,
          easing: "easeInCubic"
        }).finished;

        // swap and show
        this.prevewItem = this.items[this.items.length - 1];

        await anime({
          targets: this.$refs.preview.$refs.root,
          opacity: 1,
          duration: 300,
          easing: "easeOutCubic"
        }).finished;
      } else {
        // swap and show
        this.prevewItem = this.items[this.items.length - 1];
      }
    }
  }
};
</script>

<style lang="less" scoped></style>
