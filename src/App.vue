<script setup>
import { RouterView, RouterLink } from "vue-router";
import { NLayout, NLayoutContent, NLayoutHeader, NSpace, NSpin } from 'naive-ui'
import { ref,h, onMounted } from 'vue'
import { loading } from './assets/aptos_util'

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
</style>