<template>
    <div>
        <CategoryItem v-if="categories" class="element" v-for="(category, index) in categories" :key="index" :category="category" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CategoryItem from './components/CategoryItem.vue';
import { get_categories } from '@/utils/sqliteUtils';

const categories = ref();

onMounted(async () => {
    categories.value = await get_categories();
})
</script>

<style scoped></style>