<template>
    <div class="flex flex-space-between flex-center padding-1 margin-1 panel">
        <span class="font-size-20 title">{{$t(`l-type-${type}`)}}</span>
        <CustomButton type="grey" @click="$emit('view', type)">{{$t("btn-preview")}}</CustomButton>
    </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";

export default {
    props: ["type"],
    components: { CustomButton }
}
</script>