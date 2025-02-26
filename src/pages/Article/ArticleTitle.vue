<template>
    <div class="title">
        <br><br>
        <h1 class="titleText"><strong>{{ title }}</strong></h1>
        <h5 class="detail">分类：{{ category_name }}</h5>
        <h5 class="detail">
            分类标签：
            <span v-for="(tag, index) in tags">
                <span v-if="index != 0"> | </span>
                {{ tag }}
            </span>

        </h5>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import emitter from '@/utils/mittUtils';

const title = ref();
const category_name = ref();
const updatedTime = ref();
const tags = ref();

emitter.on('TitleLoaded', (blogDetail: any) => {
    title.value = blogDetail.blog_name;
    category_name.value = blogDetail.category_name;
    tags.value = blogDetail.tags;
});

</script>

<style scoped>
* {
    margin: 0;
}

.title {
    display: flex;
    flex-direction: column;
    height: 30vh;
    margin: 0;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    caret-color: transparent;
}

.titleText {
    text-shadow: 0px 0px 8px rgba(255, 255, 255, 0.6);
    color: aliceblue;
    margin: 0;
    font-size: 40px;
}

.detail {
    margin-top: 5px;
    color: aliceblue;
    text-shadow: 0px 0px 2px rgba(255, 255, 255, 0.6);
}
</style>