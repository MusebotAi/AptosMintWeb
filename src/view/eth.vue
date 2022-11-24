<script setup>
    import { NButton, NInput, NSpace } from 'naive-ui'
    import { ref } from 'vue'
    import { ethMintOne } from '../assets/aptos_util'

    const tokenUri = ref("https://stacktrace.top/imgs/1.json")

    const mintOne = async ()=>{
        await ethMintOne('abdce',tokenUri.value);
    }

</script>

<template>
    <NSpace justify="center" align="center" style="margin-top: 30px;">
        <NInput :value="tokenUri" style="width:500px;"></NInput>
        <NButton type="Primary" @click="mintOne" style="width:150px;">Mint One</NButton>
    </NSpace>
</template>