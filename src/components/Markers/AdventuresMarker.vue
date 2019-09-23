<script>
import Marker from "./Marker.vue";

export default {
    extends: Marker,
    activated() {
        this.fetchStatus();
    },
    methods: {
        async fetchStatus() {
            let adventures = (await this.$game.fetchAdventuresStatus()).adventures;
            
            let i = 0;
            const l = adventures.length;
            this.active = false;
            for (i ; i < l; ++i) {
                let adventure = adventures[i];
                if (adventure.startTime > 0 && adventure.duration - (this.$game.now - adventure.startTime) / 1000 <= 0) {
                    this.active = true;
                    break;
                }
            }
        }
    }
}
</script>