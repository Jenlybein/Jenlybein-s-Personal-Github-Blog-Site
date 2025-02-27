<template>
    <div class="modify">
        <div class="form">

            <el-tabs v-model="activeName" type="card" class="demo-tabs">
                <el-tab-pane label="上传" name="deploy"></el-tab-pane>
                <el-tab-pane label="删除" name="delete"></el-tab-pane>
            </el-tabs>

            <div v-show="activeName === 'deploy'" style="width: 100%; height: 100%;">
                <div class="inputf">
                    <textarea class="textarea" v-model="blogData.blog_name" type="text" placeholder="" maxlength="20" />
                    <span class="label">标题</span>
                </div>

                <div class="inputf">
                    <textarea class="textarea" v-model="blogData.category_name" type="text" placeholder=""
                        maxlength="20" />
                    <span class="label">分类</span>
                </div>

                <div class="inputf">
                    <textarea class="textarea" v-model="blogData.pull_address" type="text" placeholder=""
                        maxlength="60" />
                    <span class="label">Github 地址</span>
                </div>

                <div class="inputf tagsContent" v-for="(tag, index) in blogData.tag">
                    <textarea class="textarea tagsText" v-model="blogData.tag[index]" type="text" placeholder=""
                        maxlength="10" />
                    <span class="label">标签 {{ index + 1 }}</span>
                    <button class="button tagsDelete tags" @click="deleteTag(index)">-</button>
                </div>

                <div class="inputf" style="display: block;">
                    <button class="button tags tagsAdd" @click="AddTag">标签+</button>
                </div>

                <div class="inputf">
                    <button class="button" @click="confirmUpload">上传</button>
                </div>

                <div class="inputf">
                    <textarea class="textarea" style="height: 300px;" v-model="sqlCode" type="text" placeholder=""
                        readonly />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { get_blog_count, get_category_count, get_category_id, get_tag_count, get_tag_id } from '@/utils/sqliteUtils';
import { ElMessage } from 'element-plus';
import { ref, watch } from 'vue';

// 标签选择
const activeName = ref('deploy')

// 数据获取
const blogData = ref({
    blog_name: "",
    category_name: "",
    pull_address: "",
    tag: [""],
});

// 监视数据
watch(blogData, (newValue, oldValue) => {
    // 禁止换行和空格
    for (let i = 0; i < newValue.tag.length; i++)
        blogData.value.tag[i] = newValue.tag[i].replace("\n", "").replace(" ", "")
    blogData.value.blog_name = newValue.blog_name.replace("\n", "").replace(" ", "")
}, { deep: true })

// 标签
const deleteTag = (index: number) => {
    if (index !== 0) {
        blogData.value.tag.splice(index, 1); // 从索引位置2开始，删除1个元素
    }
    else {
        ElMessage.error("至少保留一个标签！");
    }
}
const AddTag = () => {
    if (blogData.value.tag.length < 5) {
        blogData.value.tag.push("");
    } else {
        ElMessage.error("最多五个标签！")
    }
}

// 确认修改
async function confirmUpload() {
    const confirmed = confirm("确认提交博文？")
    if (confirmed) {
        // 清除空标签
        for (let i = 0; i < blogData.value.tag.length; i++)
            if (!blogData.value.tag[i]) {
                ElMessage.error("存在空标签：第" + (i + 1) + "项")
                return;
            }
        await sqlGen();
    }
}

//语句输出
const sqlCode = ref('此处显示需输入的 SQLite 语句')

async function sqlGen() {
    let blogSQL = '';

    // 生成 category 插入语句
    let category_id = await get_category_id(blogData.value.category_name)
    if (!category_id) {
        blogSQL += `INSERT INTO category (category_name) 
      VALUES ('${blogData.value.category_name}'); \n`;
        category_id = await get_category_count() + 1;
    }

    // 生成 blog 插入语句
    blogSQL += `INSERT INTO blog (blog_name, category_id, pull_address) 
      VALUES ('${blogData.value.blog_name}', ${category_id}, '${blogData.value.pull_address}'); \n`;

    const blog_id = await get_blog_count() + 1;

    // 生成 tag 插入语句
    let tag_count = await get_tag_count();
    for (let i = 0; i < blogData.value.tag.length; i++) {
        let tag_id = await get_tag_id(blogData.value.tag[i])
        console.log(tag_id)
        if (!tag_id) {
            blogSQL += `INSERT INTO tag (tag_name) VALUES ('${blogData.value.tag[i]}'); \n`;
            tag_id = tag_count + 1;
            tag_count += 1;
        }
        blogSQL += `INSERT INTO blog_tag (blog_id, tag_id) VALUES (${blog_id}, ${tag_id}); \n`;
    }

    sqlCode.value = blogSQL;
}
</script>

<style src="./Deploy.css" scoped />