<template>
    <div>
        <div class="flex width-100 pixelated">
            <div class="title-tip margin-left-2"></div>
            <div class="title-body flex-full flex">
                <span class="title-icon" :class="`icon-unit-${element}`"></span>
            </div>
        </div>
    </div>
</template>

<script>
import UnitGetter from "./UnitGetterMixin.vue";

export default {
    props: ["unit"],
    mixins: [UnitGetter]
}
</script>

<style lang="less" scoped>

.title-tip {
    background: url("../../assets/ui/ribbon_tip_light.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    width: 2rem;
    height: 5rem;
}

.title-body {
    background: url("../../assets/ui/ribbon_body_light.png");
    background-size: 100% 100%;
    background-repeat: repeat;
}

.title-icon {
    height: 3.5rem;
    width: 3.5rem;
}
</style>
