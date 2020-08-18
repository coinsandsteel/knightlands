<template>
  <div class="home">
    <Sidebar />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import Sidebar from "../components/Sidebar.vue";

export default Vue.extend({
  name: "Home",
  components: {
    HelloWorld,
    Sidebar
  }
});
</script>
