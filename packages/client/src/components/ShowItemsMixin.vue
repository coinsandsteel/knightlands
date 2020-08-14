<script>
import { create as CreateDialog } from "vue-modal-dialogs";
import ItemsReceived from "@/components/ItemsReceived.vue";
const ShowItems = CreateDialog(ItemsReceived, "items");

export default {
    methods: {
        async showItems(items) {
            return await ShowItems(items);
        }
    }
}
</script>