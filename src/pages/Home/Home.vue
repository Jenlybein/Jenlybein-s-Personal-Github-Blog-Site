<template>
    <div>
        <InfoCard class="element" v-for="(info, index) in infos" :key="info.ID" :infos="info" />
        <Pagination v-model:currentPage="PaginationData.currentPage" v-model:totalPages="PaginationData.totalPages" />
        <Message/>
    </div>
</template>

<script setup lang="ts">
import InfoCard from './components/InfoCard.vue';
import Pagination from './components/Pagination.vue';
import Message from './components/Message.vue'
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { bloglist } from '@/utils/sqliteUtils';
const route = useRoute();

const pageItemNum = 9 | 1; // 设置为奇数，保持美观
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
        end: <number>pageItemNum-1 + (PaginationData.value.currentPage-1)*pageItemNum,
        begin: <number>(PaginationData.value.currentPage-1)*pageItemNum,
        tags: <string>route?.query?.tags,
    }
})

const getBlogList = async () => {
    // 初始博客列表信息
    const blogList = await bloglist(criteria.value);

    infos.value = blogList;
    infos.value.forEach((item: any) => {
        item.image = 'https://picsum.photos/260/161'
    });

    let blogcount = blogList.length;

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