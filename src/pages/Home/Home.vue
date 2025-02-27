<template>
    <div>
        <InfoCard class="element" v-for="(info, index) in infos" :key="info.ID" :infos="info" />
        <Pagination v-model:currentPage="PaginationData.currentPage" v-model:totalPages="PaginationData.totalPages" />
    </div>
</template>

<script setup lang="ts">
import InfoCard from './components/InfoCard.vue';
import Pagination from './components/Pagination.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { bloglist, blogCount } from '@/utils/sqliteUtils';
const route = useRoute();

const pageItemNum = 8
const PaginationData = ref({
    currentPage: 1,
    totalPages: 1,
})

const infos = ref();

// 发送 POST 请求
const criteria = computed(() => {
    return {
        blogname: <string>route?.query?.blogname,
        category: <string>route?.query?.category,
        end: <number>pageItemNum + (PaginationData.value.currentPage-1)*pageItemNum,
        begin: <number>(PaginationData.value.currentPage-1)*pageItemNum,
        tags: <string>route?.query?.tags,
    }
})

const getBlogList = async () => {
    // 初始博客列表信息
    const blogList = await bloglist(criteria.value);
    const blogcount = await blogCount(criteria.value) as number;

    infos.value = blogList;
    infos.value.forEach((item: any) => {
        item.image = 'https://picsum.photos/260/161?'+ Math.random()
    });

    PaginationData.value.totalPages = blogcount / pageItemNum + ((blogcount % pageItemNum)?1:0);
}

watch(criteria, ()=>{
    getBlogList()
}, {deep : true});

onMounted(async () => {
    await getBlogList();
})

</script>

<style scoped>
.element {
    margin-bottom: 15px;
}
</style>