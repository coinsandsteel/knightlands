<template>
  <nav class="tabs flex flex-no-wrap" :class="wrapperClass">
    <template v-if="router">
      <router-link
        class="tabs__item white-space-no-wrap"
        v-for="tab in tabs"
        :ref="tab.value"
        :key="tab.value"
        :to="tab.to"
        :id="`t-${tab.title}`"
        tag="div"
        :disabled="tab.disabled"
        :append="append"
        :replace="replace"
        exact
        @click="handleClick(tab.value)"
      >
        <span v-if="tab.icon" :class="[tab.icon, 'big']"></span>
        <span v-else>{{ $t(tab.title) }}</span>
      </router-link>
    </template>
    <template v-else>
      <div
        class="tabs__item white-space-no-wrap"
        v-for="tab in tabs"
        :ref="tab.value"
        :key="tab.title"
        :id="`t-${tab.title}`"
        :class="[
          { tabs__item_active: tab.value === currentTab },
          tab.value === currentTab && tabActiveClass ? tabActiveClass : '',
          tabClass
        ]"
        :disabled="tab.disabled"
        @click="handleClick(tab.value)"
      >
        <span v-if="tab.icon" :class="[tab.icon, 'big']"></span>
        <span v-else>{{ $t(tab.title) }}</span>
      </div>
    </template>
  </nav>
</template>

<script>
export default {
  props: {
    currentTab: {
      type: String,
      required: true
    },
    tabs: {
      type: Array,
      required: true
    },
    router: Boolean,
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
    append: Boolean,
    replace: Boolean
  },
  data: () => ({
    newTab: ""
  }),
  mounted() {
    if (this.router) {
      if (this.currentTab) {
        this.$nextTick(() => {
          this.$refs[this.currentTab][0].$el.click();
        });
      }
    }
  },
  methods: {
    handleClick(value) {
      this.$emit("onClick", value);
      this.newTab = value;
    }
  }
};
</script>

<style lang="less">
.tabs {
  justify-content: flex-start;
  width: 100%;
  position: relative;
  padding: 0.5rem 1rem 0 1rem;
  background-color: #112c47;

  * > {
    margin: 0 2px 0 2px;
  }

  & .router-link-active {
    color: #fbffff;
    border-image: url("../assets/ui/tab_selected.png") round;
    .border();
  }
}

.border() {
  border-image-slice: 43 20 27 23 fill;
  border-image-width: 20px 10px 20px 10px;
  border-image-repeat: round stretch;
  border-style: solid;
}

.tabs__item {
  flex: 1;
  display: inline-block;
  color: #61a3b3;
  text-decoration: none;
  border: none;
  cursor: pointer;

  border-image: url("../assets/ui/tab.png");
  .border();

  padding: 1rem 1.5rem 1rem 1.5rem;
  text-transform: uppercase;

  & > span {
    font-size: 1.5rem;
    font-weight: 900;
  }
}

.tabs__item_active {
  color: #fbffff;
  border-image: url("../assets/ui/tab_selected.png") round;
  .border();
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
</style>
