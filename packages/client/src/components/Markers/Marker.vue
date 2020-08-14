<template>
    <div v-if="active" class="icon-marker marker"></div>
</template>

<script>
export default {
    data: ()=>({
        active: false
    })
}
</script>

<style lang="less" scoped>
.marker {
    position: absolute;
    top: 0;
    right: 0rem;
}
</style>