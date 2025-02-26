<template>
    <div class="message">
        <div class="main">
            <div class="title">留言板</div>

            <div class="infos">
                <div class="msgContent">
                    <div v-if="messData" class="msgDetail" v-for="(msg, index) in messData.Msgs">
                        <div class="leftSpace msgText">{{ msg.message }}</div>
                        <div class="rightSpace msgTime">{{ msg.createdtime.slice(0, 10) }}</div>
                    </div>
                </div>

                <div class="pageButtonContent">
                    <button class="buttonPage leftSpace" @click="pagePrev">←</button>
                    <button class="buttonPage rightSpace" @click="pageNext">→</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { computed, onMounted, ref } from 'vue';

let pageNum = 1;
const messNums = 4;
const messData = ref();
const range = computed(() => {
    return {
        start: messNums * (pageNum - 1),
        end: messNums * pageNum,
    }
})

// 换页
async function pagePrev() {
    if (pageNum - 1 < 1) {
        ElMessage.error("留言板第一页")
    }
    else {
        pageNum -= 1;
        // messData.value = await getMessage(range.value);
    }
}
async function pageNext() {
    let maxPage = messData.value.Count / messNums + ((messData.value.Count % messNums) ? 1 : 0);
    if (pageNum + 1 > maxPage) {
        ElMessage.error("留言板最后一页")
    }
    else {
        pageNum += 1;
        console.log(messData.value.Count);
        console.log(maxPage);
        console.log(range.value);
        // messData.value = await getMessage(range.value);
    }
}
</script>

<style src="./Message.css" scoped />