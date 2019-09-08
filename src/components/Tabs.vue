<template>
  <nav class="tabs flex flex-no-wrap" :class="wrapperClass">
    <div
      class="tabs__item font-size-20"
      v-for="tab in tabs"
      :ref="tab.value"
      :key="tab.title"
      :class="[
        { 'tabs__item_active' : tab.value === currentTab },
        tab.value === currentTab && tabActiveClass ? tabActiveClass: '',
        tabClass,
      ]"
      :disabled="tab.disabled || false"
      @click="handleClick(tab.value)"
    >{{$t(tab.title)}}</div>

    <!-- <div
      class="tabs__active-line"
      :class="lineClass"
      :style="{ width: `${activeLineWidth}px`, transform: `translateX(${activeLineOffset}px)` }"
    />-->
  </nav>
</template>

<script>
export default {
  name: "vue-tabs-with-active-line",
  props: {
    currentTab: {
      type: String,
      required: true
    },
    tabs: {
      type: Array,
      required: true
    },
    updated: {
      type: [Boolean, String, Array],
      default: undefined
    },
    wrapperClass: {
      type: String,
      required: false,
      default: "disabled-tabs"
    },
    tabClass: {
      type: String,
      required: false,
      default: "disabled-tabs__item"
    },
    tabActiveClass: {
      type: String,
      required: false,
      default: "disabled-tabs__item_active"
    },
    lineClass: {
      type: String,
      required: false,
      default: "disabled-tabs__active-line"
    }
  },
  watch: {
    currentTab(newCurrentTab) {
      if (this.newTab === newCurrentTab) return;
      this.moveActiveLine(newCurrentTab);
    },
    updated() {
      this.moveActiveLine(this.currentTab);
    }
  },
  data: () => ({
    activeLineWidth: 0,
    activeLineOffset: 0,
    newTab: ""
  }),
  methods: {
    handleClick(value) {
      this.$emit("onClick", value);
      this.moveActiveLine(value);
      this.newTab = value;
    },
    moveActiveLine(newValue) {
      // if (!this.currentTab) return;
      // const element = this.$refs[newValue][0];
      // if (!element) return;
      // this.activeLineWidth = element.clientWidth;
      // this.activeLineOffset = element.offsetLeft;
    }
  },
  mounted() {
    this.moveActiveLine(this.currentTab);
  }
};
</script>

<style lang="less">
.tabs {
  justify-content: flex-start;
  width: 100%;
  position: relative;
  padding: 0 2rem 0 2rem;
  border-bottom: 1px solid #515e6f;

  * > {
    margin: 0 2px 0 2px;
  }
}

.border() {
  border-image-slice: 22 7 fill;
  border-image-width: 4px;
  border-style: solid;
}

.tabs__item {
  display: inline-block;
  color: #8c9093;
  text-decoration: none;
  border: none;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.25s;
  border-width: 1px;

  border-image: url("../assets/ui/tab.png") round;
  background-color: #323c4f;
  .border();
  padding: 0.4rem 2rem 0.4rem 2rem;
  text-transform: uppercase;
}

.tabs__item_active {
  color: #fbffff;
  border-image: url("../assets/ui/tab_selected.png") round;
  .border();
  background-color: #585f73;
}

.tabs__item:hover {
  color: #ffffff;
}

.tabs__item:focus {
  outline: none;
  color: #ffffff;
}

.tabs__item:first-child {
  margin-left: 0;
}

.tabs__item:last-child {
  margin-right: 0;
}

// .tabs__active-line {
//   position: absolute;
//   bottom: 0;
//   left: 0;
//   height: 2px;
//   background-color: #b8cbc9;
//   transition: transform 0.4s ease, width 0.4s ease;
// }
</style>


