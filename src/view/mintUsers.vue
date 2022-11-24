<script setup>
    import { NButton, NInput, NSpace } from 'naive-ui'
    import { ref } from 'vue'
    import { mintOne } from '../assets/aptos_util'

    const tokenUri = ref("https://stacktrace.top/imgs/1.json")

    const mintOne1 = async ()=>{
        await mintOne('abcd',tokenUri.value);
    }

</script>

<template>
    <NSpace justify="center" align="center" style="margin-top: 30px;">
        <NInput :value="tokenUri" style="width:500px;"></NInput>
        <NButton type="Primary" @click="mintOne1" style="width:150px;">Mint One</NButton>
    </NSpace>
</template>