<script>
export default {
    data: () => ({
        isActive: false
    }),
    mounted() {
        this.isActive = true;
    },
    activated() {
        this.isActive = true;
    },
    deactivated() {
        this.isActive = false;
    }
}
</script>