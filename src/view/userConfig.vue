<script setup>
    import { onMounted } from 'vue'
    import { NSpace,NForm,NFormItem,NInput,NSwitch,NCard, NButton, NInputNumber } from 'naive-ui'
    import { getUserConfig,userConfig,publishPackage } from '../assets/aptos_util';
    import { Wallet } from '../assets/wallet';

    const subbmit = async () =>{
        await publishPackage()
    }

    onMounted(()=>{
        getUserConfig()
    })

</script>
<template>
    <NCard embedded>
        <n-space vertical>
            <NSpace justify="space-between">
                <h4>Smart Contracts info: </h4>
            </NSpace>
            
            <n-form
                ref="formRef"
                :model="model"
                label-placement="left"
                :label-width="100"
            >
                <n-form-item label="Uri of NFTs" path="pre_uri">
                    <n-input v-model:value="userConfig.pre_uri" placeholder="https://" />
                </n-form-item>
                <n-form-item label="Supply" path="total_supply">
                    <NInputNumber v-model:value="userConfig.total_supply"></NInputNumber>
                </n-form-item>
                <n-form-item label="Price(APT)" path="price">
                    <n-input v-model:value="userConfig.price"></n-input>
                </n-form-item>
                <n-form-item label="Used" path="used">
                    <h3>{{userConfig.used}}</h3>
                </n-form-item>
            </n-form>
            <NSpace justify="center" v-if="userConfig.isInit && userConfig.total_supply > 0" >
                <RouterLink :to="'/personal/'+Wallet.getWallet().getAddress()" target="_blank">goto mint url</RouterLink>
            </NSpace>
            <NSpace justify="center" >
                <NButton size="large" style="width:200px;margin-top:10px;" type="primary" @click="subbmit">{{userConfig.isInit?'updateConfig':'publishContract'}}</NButton>
            </NSpace>
            
        </n-space>
    </NCard>
    
  </template>
  
<style scoped>
  .carousel-img {
    margin: 0 auto;
    width: 200px;
    height: 200px;
    object-fit: cover;
  }
</style>