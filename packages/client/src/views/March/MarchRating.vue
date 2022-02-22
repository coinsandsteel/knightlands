<template>
  <div class="screen-content">
    <div class="march-rating-rewards-wrapper padding-bottom-2">
      <div
        class="march-rating-rewards font-size-20 padding-bottom-2 padding-top-2 text-align-left"
      >
        <!-- 1st -->
        <div
          class="march-rating-reward flex-inline flex-no-wrap flex-items-center"
        >
          <div class="r icon-rank1"></div>
          <div class="margin-left-1">1st place:</div>
          <IconWithValue
            iconClass="icon-dkt"
            valueClass="margin-half"
            class="margin-left-1"
          >
            {{ 100500 }}
          </IconWithValue>
        </div>
        <br />
        <!-- 2nd -->
        <div
          class="march-rating-reward flex-inline flex-no-wrap flex-items-center"
        >
          <div class="r icon-rank2"></div>
          <div class="margin-left-1">2nd place:</div>
          <IconWithValue
            iconClass="icon-dkt"
            valueClass="margin-half"
            class="margin-left-1"
          >
            {{ 10050 }}
          </IconWithValue>
        </div>
        <br />
        <!-- 3rd -->
        <div
          class="march-rating-reward flex-inline flex-no-wrap flex-items-center"
        >
          <div class="r icon-rank3"></div>
          <div class="margin-left-1">3rd place:</div>
          <IconWithValue
            iconClass="icon-dkt"
            valueClass="margin-half"
            class="margin-left-1"
          >
            {{ 1005 }}
          </IconWithValue>
        </div>
        <br />
        <!-- 4-7 -->
        <div
          class="march-rating-reward flex-inline flex-no-wrap flex-items-center"
        >
          <div class="r icon-rank3 icon-rank3-4"></div>
          <div class="margin-left-1">4-7 place:</div>
          <IconWithValue
            iconClass="icon-dkt"
            valueClass="margin-half"
            class="margin-left-1"
          >
            {{ 100 }}
          </IconWithValue>
        </div>
        <br />
        <!-- 8-10 -->
        <div
          class="march-rating-reward flex-inline flex-no-wrap flex-items-center"
        >
          <div class="r icon-rank3 icon-rank3-5"></div>
          <div class="margin-left-1">8-10 place:</div>
          <IconWithValue
            iconClass="icon-dkt"
            valueClass="margin-half"
            class="margin-left-1"
          >
            {{ 10 }}
          </IconWithValue>
        </div>
      </div>
    </div>
    <Title class="common-title">Top Player???</Title>
    <div
      class="width-100 height-100 dummy-height flex flex-column flex-no-wrap"
    >
      <div class="flex-full width-100 dummy-height">
        <RecycleScroller
          ref="scroller"
          class="width-100 height-100"
          :items="records"
          :item-size="itemSize"
          key-field="id"
          v-slot="{ item, index }"
          :emitUpdate="records.length > 0"
          @update="scrollUpdated"
        >
          <MarchRatingElement
            :record="item"
            :index="index"
            :height="itemSize"
          />
        </RecycleScroller>
      </div>
    </div>
  </div>
</template>
<script>
import MarchRatingElement from "@/views/March/MarchRatingElement.vue";
export default {
  components: {
    MarchRatingElement
  },
  data() {
    return {
      itemSize: 40
    };
  },
  computed: {
    records() {
      return [
        { id: "1", name: "JVSM", avatar: 23, score: "6241377" },
        { id: "2", name: "JVSM", avatar: 23, score: "6241377" },
        { id: "3", name: "JVSM", avatar: 23, score: "6241377" },
        { id: "4", name: "JVSM", avatar: 23, score: "6241377" },
        { id: "5", name: "JVSM", avatar: 23, score: "6241377" },
        { id: "6", name: "JVSM", avatar: 23, score: "6241377" },
        { id: "7", name: "JVSM", avatar: 23, score: "6241377" },
        { id: "8", name: "JVSM", avatar: 23, score: "6241377" },
        { id: "9", name: "JVSM", avatar: 23, score: "6241377" },
        { id: "10", name: "JVSM", avatar: 23, score: "6241377" },
        { id: "11", name: "JVSM", avatar: 23, score: "6241377" }
      ];
    }
  },
  methods: {
    scrollUpdated() {}
  }
};
</script>
<style scoped lang="less">
.march-rating-rewards-wrapper {
  background: #2f7285;
}
.march-rating-rewards {
  width: 140px;
  margin-left: auto;
  margin-right: auto;
}
.common-title {
  margin-top: -2rem;
}
.icon-rank3-4 {
  filter: hue-rotate(240deg);
}
.icon-rank3-5 {
  filter: hue-rotate(90deg);
}
</style>
