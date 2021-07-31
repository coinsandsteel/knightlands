<script>
import ConnectWallet from "@/views/Account/ConnectWallet.vue";
import { create } from "vue-modal-dialogs";

const ShowWallet = create(ConnectWallet, "chain");

export default {
  methods: {
    async showWallet(chain) {
      return ShowWallet(chain);
    }
  }
};
</script>
