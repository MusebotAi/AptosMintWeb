<script setup>
  import { NButton, NDataTable,  NSpace } from 'naive-ui'
  import { h } from 'vue';
  import { mint_nft,account,getAccountInfo,mint_users } from '../assets/aptos_util'
  import { useRoute } from 'vue-router'
  const props = defineProps(['type'])
  const route = useRoute()

  const cols = [
      {
          title: 'Name',
          key: 'name',
      },
      {
          title: 'Collection',
          key: 'collection_name',
      },
      {
          title: 'Image',
          key: 'image',
          render(row){
              return h(
                  'img',{ src:row.image,style:"width:40px;height:40px;"}
              )
          }
      },
      {
          title: 'Info',
          key: 'uri',
          render(row){
              return h(
                  'a',{ href:row.uri,target:'_blank'},["info"]
              )
          }
      },
      {
          title: 'Amount',
          key: 'amount',
      },
      {
          title: 'Time',
          key: 'transaction_timestamp',
      },
  ]
  const mint = async () => {
    if(route.params.address){
      await mint_users(route.params.address);
    }else{
      await mint_nft()
    }
    getAccountInfo()
  }
  const view = () => {
    window.open(`https://explorer.aptoslabs.com/account/${account.value.address}/tokens?network=testnet`,"_blank")
  }
</script>

<template>
  <NSpace style="margin-top:20px;" vertical>
    <NSpace align="center">
      <h3 class="f f0">Account address:</h3> <h3>{{account.address}}</h3>
    </NSpace>
    <div style="font-size:18px;font-weight: bolder;margin-top:20px;">ASSETS:</div>
    <NSpace align="center" style="margin-top:20px;" justify="space-between">
      <NSpace align="center" justify="start"><h3 class="f f0">Aptos Coin:</h3><h3 class="f1 f">{{account.coins}}</h3><h3 class="f2 f"> APT</h3></NSpace>
      <NSpace align="center" justify="start"><NButton size="large" style="width:200px;" @click="view">View on explorer</NButton></NSpace>
    </NSpace>
    <NSpace align="center" style="margin-top:20px;" justify="space-between">
      <h3 class="f f0">Tokens:</h3> <NButton size="large" style="width:200px;margin-top:10px;" type="primary" @click="mint">Mint One Now!</NButton>
    </NSpace>
    <NDataTable style="margin-top:20px;" :columns="cols" :data="account.tokens"></NDataTable>
  </NSpace>
</template>

<style scoped>
.f{
  line-height: 30px;
}
.f0 {
  font-size: 20px;
}
.f1{
  font-size: 30px;
  font-weight: bolder;
}

.f2{
  font-size: 30px;
}
</style>
