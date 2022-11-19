<script setup>
import { RouterView, RouterLink } from "vue-router";
import { NButton, NLayout, NLayoutContent, NLayoutHeader, NMenu, NModal, NSpace, NSpin } from 'naive-ui'
import { ref,h, onMounted } from 'vue'
import { getAccountInfo, loading, getUserConfig } from './assets/aptos_util'
import { getList, connect } from './assets/wallet'

const connected = ref(false)
const walletInfo = ref({})
const menuOptions = [
  {
    label: () => h(
        RouterLink,
        {
          to: {
            name: 'userset'
          }
        },
        { default: () => 'Create User Contract' }
      ),
    key: "Create User Contract"
  },
  {
    label: () => h(
        RouterLink,
        {
          to: {
            name: 'compact'
          }
        },
        { default: () => 'Moudle Config' }
      ),
    key: "Moudle Config"
  },
]

const gotoWallet = async (item) => {
  if(item.detected){
    let wallet = await connect(item.index)
    getAccountInfo()
    getUserConfig()
    wallet.onAccountChange(()=>{
      getAccountInfo()
      getUserConfig()
    })
    connected.value = true
  }else{
    window.open(item.url,'_blank')
  }
}

onMounted(async ()=>{
  walletInfo.value = getList()
})


</script>

<template>
  <n-space vertical size="large">
    <n-layout>
      <n-layout-header>
        <h2>Aptos NFT mint module</h2>
      </n-layout-header>
      <n-layout-content>
        <NSpin :show="loading">
          <RouterView />
          <NModal style="width:500px;" preset="card" :closable="false" :show="!connected">
            <NSpace class="wallets" vertical justify="center" :size="30" align="stretch">
              <NSpace class="wallet" justify="start" align="center" v-for="item in walletInfo" @click="gotoWallet(item)">
                <img :src="item.img" />
                <NSpace style="margin-left: 10px;width: 350px;" justify="space-between" align="center">
                  <span class="name">{{item.name}}</span>
                  <NButton size="medium" ghost type="success">{{item.detected?'Connect':'Install'}}</NButton>
                </NSpace>
              </NSpace>
            </NSpace>
          </NModal>
      </NSpin>
      </n-layout-content>
    </n-layout>
  </n-space>
  
</template>

<style>
  h2 {
    width: 100%;
    margin: 5px,10px;
    text-align: center;
    font-weight: bolder;
    background-color: darkgrey;
    height: 40px;
    line-height: 40px;
  }
  .n-space {
    width: 100%;
  }
  .n-layout-scroll-container {
    padding: 5px !important;
  }
  .wallets{
    width: 100%;
    min-height: 200px;
  }
  .wallet{
    width: 450px;
    padding: 5px 5px 0px 10px;
    border-radius: 5px;
    box-shadow: 1px 1px 1px #888888;
    border:solid 1px #888888;
  }
  .wallet img{
    width: 60px;
    height: 60px;
  }
  .wallet .name{
    font-size: 28px;
    font-weight: bolder;
  }
</style>