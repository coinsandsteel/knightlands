<script>
import Prompt from "@/components/Prompt.vue"
import {create} from "vue-modal-dialogs";

const ShowPrompt = create(Prompt, ...Prompt.props);

export default {
    methods: {
        async showPrompt(title, content, buttons) {
            return await ShowPrompt(
                title,
                content,
                buttons
            );
        }
    }
}
</script>