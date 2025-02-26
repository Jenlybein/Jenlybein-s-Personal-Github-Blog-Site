<template>
    <div>
        <TagItem v-if="tags" class="element" v-for="(tag, index) in tags" :key="index" :tag="tag" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import TagItem from './components/TagItem.vue';
import { get_tags } from '@/utils/sqliteUtils';

const tags = ref();

onMounted(async () => {
    tags.value = await get_tags();
})
</script>

<style scoped></style>