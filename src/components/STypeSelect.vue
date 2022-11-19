<script setup>
    import { ref } from 'vue'
    import { NSelect } from 'naive-ui'
    const props = defineProps(['isEdit','typeValue'])
    const emit = defineEmits(['update-value'])
    const typeLabel = ['Reserved','White-list','Normal']
    const options = [
        {
          label: typeLabel[0],
          value: 0
        },
        {
          label: typeLabel[1],
          value: 1
        },
        {
          label: typeLabel[2],
          value: 2
        },
    ]
    
    const dataUpdate = (v) => {
        emit('update-value',v)
    }

</script>
<template>
    <NSelect v-if="isEdit" :default-value="typeValue" style="min-width:80px;" :options="options" @update-value="dataUpdate"></NSelect>
    <div v-else>
        {{typeLabel[typeValue]}}
    </div>    
</template>
