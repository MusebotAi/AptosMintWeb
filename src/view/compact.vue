<script setup>
import showntfs from '../components/shownfts.vue'
import rules from '../components/rules.vue'
import personal from '../components/personal.vue'
import { NSpace } from 'naive-ui'
</script>

<template>
    <NSpace justify="space-evenly">
        <n-space vertical size="large">
            <rules style="min-width: 700px;"></rules>
        </n-space>
        <n-space vertical size="large">
            <showntfs :cols="7"></showntfs>
            <personal></personal>
        </n-space>
    </NSpace>
</template>