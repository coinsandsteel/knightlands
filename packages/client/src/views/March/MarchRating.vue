<template>
  <div class="screen-content">
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
      <div class="font-size-20 padding-bottom-2 padding-top-2">
        First place reward: <br />
        Second place reward: <br />
        Third place reward: <br />
        4-7 place reward: <br />
        8-10 place reward: <br />
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
<style scoped lang="less"></style>
