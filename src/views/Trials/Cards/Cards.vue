<template>
    <div class="flex flex-space-evenly">
        <CardModifier v-for="mod in cardModifiers" :key="mod.effect" :modifier="mod"></CardModifier>
    </div>
</template>

<script>
import TrialsMeta from "@/trials_meta";
import CardModifier from "./CardModifier.vue";

export default {
    props: ["cardModifiers"],
    components: { CardModifier },
    data: ()=>({
        upgradeCost: TrialsMeta.upgradeCost
    })
}
</script>