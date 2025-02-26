import { getDb } from "@/api/requestApi";
import initSqlJs from "sql.js";

const SQL = await initSqlJs({
  locateFile: (file) => `/public/${file}`,
});
export async function loadDb() {
  const dbFile = await getDb();
  if (dbFile) {
    return new SQL.Database(new Uint8Array(dbFile));
  }
  return new SQL.Database();
}

// 搜索博客信息
export async function bloglist(criteria: {
  blogname: string;
  category: string;
  begin: number;
  end: number;
  tags: string;
}) {
  const db = await loadDb();

  // 构建动态 SQL 查询
  let sqlQuery = `
    SELECT 
      blog.blog_id,
      blog.blog_name,
      category.category_name,
      GROUP_CONCAT(tag.tag_name) AS tags,
      blog.pull_address
    FROM blog
    JOIN category ON blog.category_id = category.category_id
    LEFT JOIN blog_tag ON blog.blog_id = blog_tag.blog_id
    LEFT JOIN tag ON blog_tag.tag_id = tag.tag_id
  `;

  const conditions: string[] = [];
  const params: any[] = [];

  // 动态构建查询条件
  if (criteria.blogname) {
    conditions.push("blog.blog_name LIKE ?");
    params.push(`%${criteria.blogname}%`);
  }
  if (criteria.category) {
    conditions.push("category.category_name LIKE ?");
    params.push(`%${criteria.category}%`);
  }
  if (criteria.tags) {
    conditions.push("tag.tag_name LIKE ?");
    params.push(`%${criteria.tags}%`);
  }

  // 拼接 WHERE 子句
  if (conditions.length) {
    sqlQuery += " WHERE " + conditions.join(" AND ");
  }

  // 添加分页和限制
  sqlQuery += " GROUP BY blog.blog_id LIMIT ? OFFSET ?";
  params.push(criteria.end - criteria.begin, criteria.begin);

  // 执行查询
  const result = db.exec(sqlQuery, params);

  // 转换查询结果为 JSON 格式
  const columns = result[0].columns;
  const values = result[0].values;
  return values.map((row) => {
    return row.reduce((obj: { [key: string]: any }, value, index) => {
      obj[columns[index]] = columns[index] === "tags" && value ? (value as string).split(",") : value;
      return obj;
    }, {});
  });
}


// 根据 blog_id 获取博客信息
export async function blog_detail(blog_id: string) {
  const db = await loadDb();

  const sqlQuery = `
        SELECT 
          blog.blog_id,
          blog.blog_name,
          category.category_name,
          GROUP_CONCAT(tag.tag_name) AS tags,
          blog.pull_address
        FROM blog
        JOIN category ON blog.category_id = category.category_id
        LEFT JOIN blog_tag ON blog.blog_id = blog_tag.blog_id
        LEFT JOIN tag ON blog_tag.tag_id = tag.tag_id
        WHERE blog.blog_id = ?
        GROUP BY blog.blog_id
      `;

  // 执行查询并返回结果
  const result = db.exec(sqlQuery, [blog_id]);

  // 将查询结果转换为对象，直接返回第一行数据
  const row = result[0]?.values[0];

  if (row) {
    return {
      blog_id: String(row[0]), // 确保是字符串
      blog_name: String(row[1]), // 确保是字符串
      category_name: String(row[2]), // 确保是字符串
      tags: row[3] ? String(row[3]).split(",") : [], // 转换为数组
      pull_address: String(row[4]), // 确保是字符串
    };
  } else {
    return null; // 如果没有找到该 blog_id，返回 null
  }
}

// 获取所有 tags 
export async function get_tags() {
  const db = await loadDb();

  const sqlQuery = `SELECT tag_id, tag_name FROM tag;`;
  const result = db.exec(sqlQuery);

  // 转换查询结果为 JSON 格式
  const columns = result[0].columns;
  const values = result[0].values;
  return values.map((row) => {
    return row.reduce((obj: { [key: string]: any }, value, index) => {
      obj[columns[index]] = value;
      return obj;
    }, {});
  });
}

// 获取所有 category 
export async function get_categories() {
  const db = await loadDb();

  const sqlQuery = `SELECT category_id, category_name FROM category;`;
  const result = db.exec(sqlQuery);

  // 转换查询结果为 JSON 格式
  const columns = result[0].columns;
  const values = result[0].values;
  return values.map((row) => {
    return row.reduce((obj: { [key: string]: any }, value, index) => {
      obj[columns[index]] = value;
      return obj;
    }, {});
  });
}