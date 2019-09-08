<template>
    <UserDialog :title="$t('item-crafted-title')" @close="$close">
        <template v-slot:content>
            <ItemInfo :item="item"></ItemInfo>
        </template>

        <template v-slot:footer>
            <CustomButton type="grey" @click="$close">{{$t("btn-continue")}}</CustomButton>
        </template>
    </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue"
import ItemInfo from "@/components/ItemInfo.vue"
import CustomButton from "@/components/Button.vue"

export default {
    props: ["item"],
    components: { UserDialog, ItemInfo, CustomButton }
}
</script>

<style lang="less" scoped>

</style>