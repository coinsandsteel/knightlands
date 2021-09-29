<template>
  <div class="locales-list flex flex-space-evenly flex-items-center width-50 margin-top-5">
    <a
      class="locale-item"
      :class="{ active: code === activeLocale }"
      v-for="code in locales"
      :key="code"
      @click="setLocale(code)"
    >
      <img :src="`/images/flags/${code}.svg`"/>
    </a>
  </div>
</template>

<script>
export default {
  data: () => ({
    locales: ['en', 'es', 'ru', 'vi']
  }),
  methods: {
    setLocale(locale){
      this.$i18n.set(locale);
    }
  },
  computed: {
    activeLocale(){
      return this.$i18n.locale();
    }
  }
};
</script>

<style lang="less" scoped>
.locales-list {
  .locale-item {
    display: block;
    width: 30px;
    height: 30px;
    border: 2px solid #5889b5;
    max-width: 100%;
    border-radius: 100%;
    opacity: 0.8;

    img {
      max-width: 100%;
    }
  }
  .locale-item.active {
    border-color: #4fce4f;
    opacity: 1;
  }
}
</style>
