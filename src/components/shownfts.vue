<script setup>
    import { NGrid,NGi, NCard } from 'naive-ui'
import { computed } from '@vue/reactivity';
    const props = defineProps({
        cols: {
            type: Number,
            default: 5,
        }
    })
    const images = computed(()=>{
        let imgs = []
        for(let i=0;i<10;i++) {
            imgs.push(`https://stacktrace.top/imgs/${i}.png`)
        }
        return imgs
    })

</script>
<template>
    <NCard>
        <n-grid
        :cols="cols"
        :collapsed="true"
        :collapsed-rows="1"
        >
            <n-gi v-for="img in images">
                <img
                class="carousel-img"
                :src="img"
                >
            </n-gi>
    </n-grid>
    </NCard>
    
</template>
  
<style scoped>
  .carousel-img {
    margin: 0 auto;
    width: 100px;
    height: 100px;
    object-fit: cover;
  }
</style>