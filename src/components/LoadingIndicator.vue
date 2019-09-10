<template>
    <div class="flex flex-center">
        <slot></slot>
        <GridLoader v-if="type == 'grid'" class="margin-left-1 margin-right-1" color="#fde648" :size="15" margin="1px" />
        <ScaleLoader v-if="type == 'scale'" class="margin-left-1 margin-right-1" color="#fde648" :height="12" :width="5" :radius="4" ></ScaleLoader>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: "grid"
        }
    }
}
</script>