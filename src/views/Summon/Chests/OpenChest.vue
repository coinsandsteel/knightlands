<template>
    <div>
        coming soon
    </div>
</template>

<script>
import AppSection from "@/AppSection";

export default {
    mixins: [AppSection],
    created() {
        this.title = "window-open-chest";
        this.$options.useRouterBack = true;
    }
}
</script>