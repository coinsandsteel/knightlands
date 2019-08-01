<template>
  <div>
    <!-- <router-link to="/settings"></router-link>
    <a v-if="$game.authenticated" href="javascript:void(0)" @click="logout">
      <span>Sign out</span>
    </a>-->

    <router-link class="test" tag="div" to="/home/quest" :append="true">QUESTS</router-link>
    <router-link class="test" tag="div" to="/home/raids" :append="true">Raids</router-link>
  </div>
</template>

<script>
import AppSection from "@/AppSection";

export default {
  mixins: [AppSection],
  created() {
    this.title = "Home";
  },
  methods: {
    logout() {
      this.$game.logout();
    }
  }
};
</script>

<style lang="less" scoped>
.test {
  border-image: url("../assets/ui/border.png") repeat;
  border-image-slice: 40 fill;
  border-image-width: 10px;
  width: 100px;
  height: 100px;
  border-style: solid;
  border-width: 2rem;
  //   border-image-source: url("../assets/ui/border.png");
  //   border-image-slice: 100% 0%;
  //   border-image-repeat: repeat;
}
</style>

