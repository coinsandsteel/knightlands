<template>
  <nav class="tabs flex" :class="wrapperClass">
    <div
      class="tabs__item margin-left-2 margin-right-2"
      v-for="tab in tabs"
      :key="tab.title"
      :ref="tab.value"
      :class="[
        tab.value === currentTab && tabActiveClass ? tabActiveClass: '',
        tabClass,
      ]"
      :style="tab.value === currentTab ? getIconSelected(tab.icon) : getIcon(tab.icon)"
      :disabled="tab.disabled || false"
      @click="handleClick(tab.value)"
    ></div>
    <div
      class="tabs__active-line"
      :class="[lineClass, {animated: ready}]"
      :style="{ width: `${activeLineWidth}px`, transform: `translateX(${activeLineOffset}px)` }"
    />
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
  data: () => ({
    activeLineWidth: 0,
    activeLineOffset: 0,
    newTab: "",
    ready: false
  }),
  watch: {
    currentTab(newCurrentTab) {
      if (this.newTab === newCurrentTab) return;
      this.moveActiveLine(newCurrentTab);
    }
  },
  mounted() {
    this.moveActiveLine(this.currentTab);
    this.$nextTick(()=>{
      this.ready = true;
    });
  },
  methods: {
    handleClick(value) {
      this.$emit("onClick", value);
      this.moveActiveLine(value);
      this.newTab = value;
    },
    getIcon(icon) {
      return {
        "background-image": `url(/images/ui/${icon}.png)`
      };
    },
    getIconSelected(icon) {
      return {
        "background-image": `url(/images/ui/${icon}_selected.png)`
      };
    },
    moveActiveLine(newValue) {
      if (!this.currentTab) return;

      const element = this.$refs[newValue][0];
      if (!element) return;

      this.activeLineWidth = element.clientWidth;
      this.activeLineOffset = element.offsetLeft;
    }
  }
};
</script>

<style lang="less" scoped>
.tabs {
  justify-content: flex-start;
  width: 100%;
  position: relative;
  padding: 1rem 3rem 1.4rem 3rem;
  background-image: url("./../../../assets/ui/tab_menu_bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: 5rem;
  width: 100%;
  border: 0;

  * > {
    margin: 0 2rem 0 2rem;
  }
}

.border() {
  border-image-slice: 22 7 fill;
  border-image-width: 4px;
  border-style: solid;
}

.tabs__item {
  display: inline-block;
  text-decoration: none;
  border: none;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.25s;
  padding: 0.4rem 2rem 0.4rem 2rem;
  text-transform: uppercase;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.tabs__item_active {
}

.tabs__item:first-child {
  margin-left: 0;
}

.tabs__item:last-child {
  margin-right: 0;
}

.tabs__active-line {
  position: absolute;
  padding: 0;
  margin: 0;
  bottom: 0;
  left: 0;
  height: 1rem;
  background-image: url("./../../../assets/ui/tab_menu_pointer.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.animated {
  transition: transform 0.4s ease, width 0.4s ease;
}
</style>


