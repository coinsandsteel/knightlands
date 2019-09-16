<template>
    <div>
        AppSection
    </div>
</template>

<script>
import AppSection from "@/AppSection";

export default {
    mixins: [AppSection],
    created() {
        this.title = "window-choose-chest";
    }
}
</script>