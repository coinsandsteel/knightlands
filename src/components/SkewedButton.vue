<template>
    <CustomButton v-bind="props" :skewed="true" btnClass="skewed-btn">
        <div class="flex flex-center flex-start flex-no-wrap">
            <span :class="props.icon" class="huge icon-skewed"></span>
            <span><slot></slot></span>
        </div>
    </CustomButton>
</template>

<script>
import CustomButton from "@/components/Button.vue"

export default {
    props: ["props"],
    components: {CustomButton}
}
</script>

<style lang="less" scoped>

.skewed-btn {
    padding-left: 0;
}

.icon-skewed {
    padding-right: 1rem;
    transform: translateY(-0.4rem);
}

</style>