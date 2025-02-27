<template>
  <div class="article">
    <div class="markdown-body" v-html="renderedText"></div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { MdRender } from '@/utils/mditUtils';
import { blog_detail } from '@/utils/sqliteUtils';
import emitter from '@/utils/mittUtils';
import 'highlight.js/styles/atom-one-dark.css'
import '@/assets/markdown.css'  // markdown样式设置
import 'katex/dist/katex.min.css';
import { getBlog } from '@/api/requestApi';

const route = useRoute();
const renderedText = ref();

onMounted(async () => {
  const blog_infos = await blog_detail(route.params.id as string)
  const blog_content = await getBlog(blog_infos?.pull_address as string)

  // markdown图片地址转化
  const mdRegex = /!\[.*?\]\((\.\.\/.*?|\.\/.*?)\)/g;
  const htmlRegex = /<img[^>]+src="(\.\.\/.*?|\.\/.*?)"[^>]*>/g;

  let updatedAddress = blog_infos?.pull_address.replace(/\/[^\/]+$/, '/');

  let updatedMdText = blog_content.replace(mdRegex, (match: any, relativePath: any) => {
    const absolutePath = relativePath.replace(/^(\.\/|\.\.\/)/, updatedAddress);
    return match.replace(relativePath, absolutePath);
  });

  updatedMdText = updatedMdText.replace(htmlRegex, (match: any, relativePath: any) => {
    const absolutePath = relativePath.replace(/^(\.\/|\.\.\/)/, updatedAddress);
    return match.replace(relativePath, absolutePath);
  });

  // markdown文本渲染成html
  renderedText.value = MdRender(updatedMdText, "markdown");

  nextTick(() => {
    emitter.emit('ArticleLoaded'); // 通知ArticleOutline
    emitter.emit('TitleLoaded', blog_infos); // 通知ArticleTitle
  })
})
</script>

<style scoped>
.article {
  background-color: #ffffff;
  padding: 10px;
  margin: 0;
  border: 1px solid #0c00002a;
  border-radius: 1em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>