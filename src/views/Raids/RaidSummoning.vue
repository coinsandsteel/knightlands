<template>
  <keep-alive exclude="raid-summon">
    <router-view></router-view>
  </keep-alive>
</template>

<script>
import AppSection from "@/AppSection";
import RaidsSummonListElement from "./RaidsSummonListElement.vue";

export default {
  name: "raid-summoning"
};
</script>
