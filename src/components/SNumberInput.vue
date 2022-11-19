<script setup>
    import { ref } from 'vue'
    import { NInputNumber } from 'naive-ui'
    const props = defineProps(['isEdit','inputValue'])
    const emit = defineEmits(['update-value'])
    const dataUpdate = (v) => {
        emit('update-value',v)
    }

</script>
<template>
    <NInputNumber style="max-width: 90px;" v-if="isEdit" :value="inputValue" :show-button="false" @update:value="dataUpdate"></NInputNumber>
    <div v-else>
        {{inputValue}}
    </div>    
</template>
