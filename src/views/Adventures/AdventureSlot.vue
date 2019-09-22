<template>
    <div class="panel adventure-slot">
        <div v-if="mission">
            <span class="title" :class="[`rarity-${rarity}`]">{{$t("adventure-title", {rarity: $t(rarity)})}}</span>
        </div>
        <div v-else>
            <CustomButton type="yellow">{{$t("adventure-start")}}</CustomButton>
        </div>
    </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";

export default {
    props: ["mission"],
    components: {CustomButton}
}
</script>

<style lang="less" scoped>
.adventure-slot {
    min-height: 15rem;
}
</style>