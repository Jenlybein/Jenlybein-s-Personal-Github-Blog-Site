<template>
    <div>
        <TagItem v-if="tags" class="element" v-for="(tag, index) in tags" :key="index" :tag="tag" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import TagItem from './components/TagItem.vue';
import { get_tags, loadNetDb } from '@/utils/sqliteUtils';

const tags = ref();

onMounted(async () => {
    const data = await loadNetDb();
    tags.value = await get_tags(data);
})
</script>

<style scoped></style>