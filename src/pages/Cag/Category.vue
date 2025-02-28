<template>
    <div>
        <CategoryItem v-if="categories" class="element" v-for="(category, index) in categories" :key="index" :category="category" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CategoryItem from './components/CategoryItem.vue';
import { get_categories, loadNetDb } from '@/utils/sqliteUtils';

const categories = ref();

onMounted(async () => {
    const data = await loadNetDb();
    categories.value = await get_categories(data);
})
</script>

<style scoped></style>