<template>
    <div class="width-100 height-100 flex flex-center">
        <span class="font-size-22">Coming soon. Like really soon.</span>
    </div>
</template>


<script>
import AppSection from "@/AppSection";

export default {
    mixins: [AppSection],
    created() {
        this.title = "window-shop";
    }
}
</script>