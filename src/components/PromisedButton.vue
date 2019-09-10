<template>
    <CustomButton v-bind="props" @click="$emit('click')">
        <template v-if="showLoading">
            <LoadingIndicator type="scale"></LoadingIndicator>
        </template>
        <template v-else>
            <slot></slot>
        </template>
    </CustomButton>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";

export default {
    props: ["promise", "props"],
    components: { CustomButton, LoadingIndicator },
    data: ()=>({
        showLoading: false
    }),
    mounted() {
        this._await();
    },
    watch: {
        promise() {
            this._await();
        }
    },
    methods: {
        async _await() {
            this.showLoading = true;

            try {
                await this.promise;
            } 
            finally {
                this.showLoading = false;
            }
        }
    }
}
</script>