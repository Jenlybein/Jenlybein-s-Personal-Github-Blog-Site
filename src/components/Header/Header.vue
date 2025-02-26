<template>
    <Transition name="fade">
        <div class="header" v-show="!isHidden" @mouseover="isOver = true" @mouseleave="isOver = false">
            <!-- 主图标 -->
            <div class="text"><strong>{{ headerName }}</strong></div>

            <!-- 搜索框 -->
            <div class="search">
                <input v-model="searchContent" class="searchInput" @keydown.enter="searchClick">
                <button class="searchButton" @click="searchClick">搜索</button>
            </div>

            <!-- 页面跳转选项 -->
            <div class="nav" ref="nav" @mouseleave="handleMouseLeave" @mouseenter="handleMouseIn">
                <div class="slide" ref="slide"></div>
                <RouterLink v-for="(item, index) in items" :key="index" :to="item.route" class="nav-item"
                    @mouseover="handleMouseOver(index)">
                    <strong>
                        <i :class="['nav-tab-item_icon', 'iconfont', item.icon]"></i>
                        <span class="nav-item-label">{{ item.label }}</span>
                    </strong>
                </RouterLink>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { items, headerName } = defineProps<{
    items: { icon: string, label: string, route: string }[],
    headerName: string,
}>();

// 搜索功能
const searchContent = ref();
const searchClick = () => {
    router.push({ name: "search", query: { blogname: searchContent.value } })
}

// 导航栏滑块动效
const nav = ref<HTMLElement | null>(null);
const slide = ref<HTMLElement | null>(null);
const setPosition = (index: number, element: HTMLElement | null) => {
    if (!element || !nav.value) return;
    const li = nav.value.children[index + 1] as HTMLElement; // Skip the first two slides
    const position = li.getBoundingClientRect();
    const width = li.offsetWidth;

    element.style.left = `${position.left}px`;
    element.style.width = `${width}px`;
};

function handleMouseOver(index: number) {
    if (slide.value) {
        setPosition(index, slide.value);
    }
};

function handleMouseLeave() {
    if (slide.value) {
        slide.value.style.opacity = '0';
        slide.value.classList.remove('squeeze');
    }
};

function handleMouseIn() {
    if (slide.value) {
        slide.value.style.opacity = '1';
        slide.value.classList.add('squeeze');
    }
};

// 导航栏根据鼠标滚动显示
let timerID : any;
const isOver = ref(false);
const isHidden = ref(true);
let lastScrollY = window.scrollY;

function checkOver() {
    timerID = setTimeout(() => {
        if (!isOver.value && window.scrollY != 0)
            isHidden.value = true;
        else
            checkOver()
    }, 3000)
}
const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
        isHidden.value = true;
        clearTimeout(timerID);
    } else if (window.scrollY < lastScrollY) {
        isHidden.value = false;
        clearTimeout(timerID);
        checkOver();
    }

    lastScrollY = window.scrollY;
};

// 挂载后操作
onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    nextTick(() => {
        isHidden.value = false;
    })
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

</script>

<style src="./Header.css" scoped></style>