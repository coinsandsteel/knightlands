<template>
    <div class="toggle-container flex flex-center flex-column" @click="toggle">
        <span class="font-size-15">
            {{$t(caption)}}
        </span>

        <div class="switch-container margin-top-half" :class="{activated: activated}">
            <div class="switch"></div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        cb:Function,
        caption:String,
        startValue: Boolean
    },
    data: ()=>({
        activated: true
    }),
    mounted() {
        this.activated = this.startValue;
    },
    methods: {
        toggle() {
            this.activated = !this.activated;
            if (this.cb) {
                this.cb(this.activated);
            }
        }
    }
}
</script>

<style lang="less" scoped>
.toggle-container {
    margin-right: auto;
}

.switch-container {
    background: no-repeat url("./../assets/ui/switcher_bg.png");
    background-size: contain;
    background-position: center;
    width: 5rem;
    height: 2rem;
    padding: 0 0.5rem 0 0.5rem;
    position: relative;
    transition: 0.2s all ease-in-out;  

    & .switch {
        position: relative;
        background: no-repeat url("./../assets/ui/switcher.png");
        background-size: contain;
        background-position: left;
        height: 100%;
        width: 100%;
        transition: 0.2s all ease-in-out;  
        z-index: 1;      
    }

    &.activated {
        background: no-repeat url("./../assets/ui/switcher_on.png");
        background-size: contain;
        background-position: center;
        transition-delay: 0.15s;

        & .switch {
            background-position: right;
        }
    }
}


</style>