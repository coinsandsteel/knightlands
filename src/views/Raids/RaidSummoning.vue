<template>
  <keep-alive exclude="raid-summon">
    <router-view :parent="this"></router-view>
  </keep-alive>
</template>

<script>
import AppSection from "@/AppSection";
import RaidsSummonListElement from "./RaidsSummonListElement.vue";

export default {
  name: "raid-summoning"
};
</script>
