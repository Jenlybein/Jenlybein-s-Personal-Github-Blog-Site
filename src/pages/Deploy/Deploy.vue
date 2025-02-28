<template>
    <div class="modify">
        <div class="form">

            <el-tabs v-model="activeName" type="card" class="demo-tabs">
                <el-tab-pane label="上传" name="deploy"></el-tab-pane>
                <el-tab-pane label="删除" name="delete"></el-tab-pane>
            </el-tabs>

            <div class="inputf" style="flex-direction: column;">
                <strong>选择被修改的数据库文件(.db后缀)</strong>
                <span style="color: #6f6f6f; font-size: 13px; margin-bottom: 10px;">
                    注意：对所修改后的数据库文件，需手动上传到github。
                </span>
                <input type="file" ref="filePicker" @change="getFileData" />
            </div>

            <div v-show="activeName === 'deploy'" style="width: 100%; height: 100%;">

                <div class="inputf">
                    <textarea class="textarea" v-model="blogData.blog_name" type="text" placeholder=""
                        maxlength="150" />
                    <span class="label">标题</span>
                </div>

                <div class="inputf">
                    <textarea class="textarea" v-model="blogData.category_name" type="text" placeholder=""
                        maxlength="150" />
                    <span class="label">分类</span>
                </div>

                <div class="inputf">
                    <textarea class="textarea" v-model="blogData.pull_address" type="text" placeholder="" />
                    <span class="label">Github 地址</span>
                </div>

                <div class="inputf tagsContent" v-for="(tag, index) in blogData.tag">
                    <textarea class="textarea tagsText" v-model="blogData.tag[index]" type="text" placeholder=""
                        maxlength="100" />
                    <span class="label">标签 {{ index + 1 }}</span>
                    <button class="button tagsDelete tags" @click="deleteTag(index)">-</button>
                </div>

                <div class="inputf" style="display: block;">
                    <button class="button tags tagsAdd" @click="AddTag">标签+</button>
                </div>

                <div class="inputf">
                    <button class="button" @click="confirmUpload">上传</button>
                </div>
                <div class="inputf" v-show="downloadUrl">
                    <a class="button a" :href="downloadUrl" download='ac.db'>保存</a>
                </div>

                <div class="inputf">
                    <textarea class="textarea" style="height: 300px;" v-model="sqlCode" type="text" placeholder=""
                        readonly />
                </div>
            </div>

            <div v-show="activeName === 'delete'" style="width: 100%; height: 100%;">
                <div class="inputf">
                    <textarea class="textarea" v-model="blogData.blog_name" type="text" placeholder="" maxlength="50" />
                    <span class="label">请输入完整标题</span>
                </div>

                <div class="inputf">
                    <button class="button" @click="confirmDelete">删除</button>
                </div>

                <div class="inputf" v-show="downloadUrl">
                    <a class="button a" :href="downloadUrl" download='ac.db'>保存</a>
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
import { makeLocalDb, get_category_id, get_tag_id, update_db, get_blog_id, bloglist } from '@/utils/sqliteUtils';
import { ElMessage } from 'element-plus';
import { ref, watch } from 'vue';

// 数据库获取
const dbFile: any = ref(null);
const getFileData = async (event: any) => {
    const item = event.target.files[0];
    if (item.name.split('.').pop() === 'db') {
        ElMessage.success("成功获取：" + item.name);
        dbFile.value = await makeLocalDb(await item.arrayBuffer());
    }
}

// 标签选择
const activeName = ref('deploy')

// 数据获取
const blogData = ref({
    blog_name: "",
    category_name: "",
    pull_address: "",
    tag: [""],
});

// 监视数据，禁止换行和空格
watch(blogData, (newValue, oldValue) => {
    for (let i = 0; i < newValue.tag.length; i++)
        blogData.value.tag[i] = newValue.tag[i].replace("\n", "").replace(" ", "")
    blogData.value.blog_name = newValue.blog_name.replace("\n", "")
    blogData.value.pull_address = newValue.pull_address.replace("\n", "")
    blogData.value.category_name = newValue.category_name.replace("\n", "")
}, { deep: true })

// 标签的添加与删除
const deleteTag = (index: number) => {
    if (index !== 0)
        blogData.value.tag.splice(index, 1); // 从索引位置2开始，删除1个元素
    else
        ElMessage.error("至少保留一个标签！");
}
const AddTag = () => {
    if (blogData.value.tag.length < 5)
        blogData.value.tag.push("");
    else
        ElMessage.error("最多五个标签！");
}

const downloadUrl = ref('');
const sqlCode = ref('此处显示修改后的信息');
// 确认修改
async function confirmUpload() {
    if (!confirm("确认提交博文？")) return;

    // 清除空标签
    for (let i = 0; i < blogData.value.tag.length; i++)
        if (!blogData.value.tag[i]) {
            ElMessage.error("存在空标签：第" + (i + 1) + "项")
            return;
        }

    let blogSQL: string[] = [];

    // 生成 category 插入语句
    let category_id = await get_category_id(blogData.value.category_name, dbFile.value);
    if (!category_id) {
        blogSQL.push(`INSERT INTO category (category_name) VALUES ('${blogData.value.category_name}');`);
        category_id = `(SELECT LAST_INSERT_ROWID())`;
    }

    // 对 github 地址进行修改
    let pull_address = decodeURIComponent(blogData.value.pull_address.replace('https://github.com', 'https://raw.githubusercontent.com')).replace('blob/', '');

    // 生成 blog 插入语句
    blogSQL.push(`INSERT INTO blog (blog_name, category_id, pull_address) 
  VALUES ('${blogData.value.blog_name}', ${category_id}, '${pull_address}');`);

    // 记录 blog_id 使用数据库自动分配的ID
    blogSQL.push(`CREATE TEMP TABLE temp_vars (blog_id INTEGER); 
INSERT INTO temp_vars (blog_id) SELECT LAST_INSERT_ROWID();`);

    // 生成 tag 插入语句
    for (let i = 0; i < blogData.value.tag.length; i++) {
        let tag_id = await get_tag_id(blogData.value.tag[i], dbFile.value);
        if (!tag_id) {
            blogSQL.push(`INSERT INTO tag (tag_name) VALUES ('${blogData.value.tag[i]}');`);
            tag_id = `(SELECT LAST_INSERT_ROWID())`;
        }
        blogSQL.push(`INSERT INTO blog_tag (blog_id, tag_id) VALUES ((SELECT blog_id FROM temp_vars), ${tag_id});`);
    }

    // 删除临时表方便下一次操作
    blogSQL.push(`DROP TABLE IF EXISTS temp_vars;`);

    await exportDB(blogSQL);
}

// 确认删除
async function confirmDelete() {
    if (!confirm("确认删除博文？")) return;

    let blog_id = await get_blog_id(blogData.value.blog_name, dbFile.value)

    if (!blog_id) {
        ElMessage.error("不存在对应名称的博客！")
        return null
    }

    // 生成 删除语句
    let blogSQL: string[] = [];

    blogSQL.push(`DELETE FROM blog WHERE blog_id=${blog_id};`);
    blogSQL.push(`DELETE FROM blog_tag WHERE blog_id=${blog_id};`);

    await exportDB(blogSQL);
}

// 数据导出
async function exportDB(blogSQL: string[]) {
    await update_db(blogSQL, dbFile.value);

    sqlCode.value = (await bloglist(dbFile.value, { begin: 0, end: 5 }))
        .map(item => JSON.stringify(item))  // 将每个对象转为 JSON 字符串
        .join("\n\n")  // 用换行符连接所有字符串
        .replace(/"/g, "");  // 替换掉所有的双引号

    const binaryData = dbFile.value.export(); // 导出数据库为二进制数据
    const blob = new Blob([binaryData], { type: 'application/x-sqlite3' });
    downloadUrl.value = URL.createObjectURL(blob);
}
</script>

<style src="./Deploy.css" scoped />