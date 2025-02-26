<template>
  <Transition name="default" mode="out-in" appear>
    <div class="info-card">

      <RouterLink :to="'/article/' + infos.blog_id" class="info-card-image">
        <img style="height: 100%;" :src="infos.image" />
      </RouterLink>

      <div class="info-card-content">
        <h2>
          <RouterLink :to="'/article/' + infos.blog_id" class="link">{{ infos.blog_name }}</RouterLink>
        </h2>
        <div class="info-card-meta">
          <span>分类： -{{ infos.category_name }}</span>
        </div>
        <div class="info-card-meta">
          <span>标签：</span>
          <span v-for="tag in infos.tags" :key="tag" class="tag">&nbsp;-{{ tag }}</span>
        </div>
        <p class="info-card-summary">{{ infos.pull_address }}</p>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

interface InfoImpl {
  blog_id: Number
  blog_name: string;    // 标题
  category_name: string;  // 分类
  pull_address: string; // 拉取地址
  tags: string[];       // 标签
  image: string;
}

const router = useRouter();
const props = defineProps<{ infos: InfoImpl }>();
</script>

<style src="./InfoCard.css" scoped></style>
