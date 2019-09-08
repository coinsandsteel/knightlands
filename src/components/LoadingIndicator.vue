<template>
    <div class="flex flex-center">
        <slot></slot>
        <GridLoader class="margin-left-1 margin-right-1" color="#fde648" :size="15" margin="1px" />
    </div>
</template>