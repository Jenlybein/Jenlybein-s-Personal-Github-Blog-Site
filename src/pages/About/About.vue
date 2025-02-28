<template>
    <div class="about">
        <div v-html="AboutHtml"></div>
    </div>
</template>

<script setup lang="ts">
import { AboutContent } from '@/config'
import { MdRender } from '@/utils/mditUtils';
import { ref } from 'vue';
const AboutHtml = ref('');
AboutHtml.value = MdRender(AboutContent, "markdown");
</script>

<style scoped>
.about {
    display: flex;
    flex-direction: column;
}
</style>