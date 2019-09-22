<template>
    <div class="flex flex-center">
        <slot></slot>
        <GridLoader v-if="type == 'grid'" class="margin-left-1 margin-right-1" :color="color" :size="12" margin="1px" />
        <ScaleLoader v-if="type == 'scale'" class="margin-left-1 margin-right-1" :color="color" :height="10" :width="5" :radius="4" ></ScaleLoader>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: "grid"
        },
        color: {
            type: String,
            default: "#fde648"
        }
    }
}
</script>