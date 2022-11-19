<script setup>
    import { ref, h, onMounted } from 'vue'
    import { NSpace,NForm,NFormItem,NInput,NSwitch,NDatePicker,NCard, NDataTable, NButton } from 'naive-ui'
    import STypeSelect from './STypeSelect.vue';
    import SNumberInput from './SNumberInput.vue';
    import { model,setModule,getModuleConfig } from '../assets/aptos_util';
    const emit = defineEmits(['save-params'])
    const updateEnabled = ref(false);
    
    const calcTotal = ()=>{
        model.value.total_supply = model.value.strategys.map(v=>v.supply).reduce((p,c)=>{return Number(p)+Number(c)})
    }
    const strategy_cols = ref([
        {
            title: 'Type',
            key: 'type',
            render(row){
                return h(
                    STypeSelect,{ isEdit:updateEnabled.value,typeValue:row.type,onUpdateValue:(v)=>{
                        row.type = v
                    }}
                )
            }
        },
        {
            title: 'Supply',
            key: 'supply',
            render(row){
                return h(
                    SNumberInput,{ isEdit:updateEnabled.value,inputValue:row.supply,onUpdateValue:(v)=>{
                        row.supply = Number(v)
                        calcTotal()
                    }}
                )
            }
        },
        {
            title: 'Minted',
            key: 'used',
        },
        {
            title: 'Fee',
            key: 'fee',
            render(row){
                return h(
                    SNumberInput,{ isEdit:updateEnabled.value,inputValue:row.fee,onUpdateValue:(v)=>{
                        row.fee = v
                    }}
                )
            }
        },
    ])

    const subbmit = async () =>{
        if(await setModule()){
            updateEnabled.value = false
        }
    }

    onMounted(()=>{
        getModuleConfig()
    })

</script>
<template>
    <NCard embedded>
        <n-space vertical>
            <NSpace justify="space-between">
                <h4>Smart Contracts info: </h4>
                <n-form-item label="Configuration Enabled" label-placement="left">
                    <n-switch v-model:value="updateEnabled" />
                </n-form-item>
            </NSpace>
            
            <n-form
                ref="formRef"
                :model="model"
                label-placement="left"
                :label-width="100"
                :disabled="!updateEnabled"
            >
                <n-form-item label="Token Prefix" path="token_pre">
                    <n-input v-model:value="model.token_pre" placeholder="token name prefix" />
                </n-form-item>
                <n-form-item label="Uri of NFTs" path="pre_uri">
                    <n-input v-model:value="model.pre_uri" placeholder="https://" />
                </n-form-item>
                <n-form-item label="Pre sale date" path="presale_timestamp">
                    <n-date-picker v-model:value="model.presale_timestamp" type="datetime" clearable />
                </n-form-item>
                <n-form-item label="Sale date" path="sale_timestamp">
                    <n-date-picker v-model:value="model.sale_timestamp" type="datetime" clearable />
                </n-form-item>
                <n-form-item label="Random Mint" path="mint_random">
                    <n-switch v-model:value="model.mint_random" />
                </n-form-item>
                <n-form-item label="Mint Enable" path="minting_enabled">
                    <n-switch v-model:value="model.minting_enabled" />
                </n-form-item>
                <n-form-item label="Whitelist" path="Whitelist">
                    <n-input
                    v-model:value="model.Whitelist"
                    type="textarea"
                    placeholder="Use commas to separate each address, ex: 0x123,0xcafe,..."
                    />
                </n-form-item>
                <n-form-item label="Total supply">
                    <NSpace justify="space-between">
                        <h3>{{model.total_supply}}</h3> 
                        <NSpace align="center"><h4>Total Minted: </h4><h3>{{model.used}}</h3></NSpace>
                    </NSpace>
                </n-form-item>
                <NDataTable :columns="strategy_cols" :data="model.strategys">

                </NDataTable>
                
            </n-form>
            <NSpace justify="center" v-if="updateEnabled">
                <NButton size="large" style="width:200px;margin-top:10px;" type="primary" @click="subbmit">subbmit</NButton>
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