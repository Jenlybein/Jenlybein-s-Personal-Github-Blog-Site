import { getDb } from "@/api/requestApi";
import { getDatabase, removeDatabase, setDatabase } from "@/utils/tokenUtils";
import initSqlJs from "sql.js";

export async function makeDb(db: ArrayBuffer | null) {
  const SQL = await initSqlJs({
    locateFile: (file) => `/${file}`,
  });
  if (!db) return new SQL.Database();
  return new SQL.Database(new Uint8Array(db));
}
async function loadDb(db: ArrayBuffer | null = null) {
  if (!db) {
    let dbFile = getDatabase();
    if (dbFile === null) {
      let dbFile = (await getDb()).data;
      setDatabase(dbFile as ArrayBuffer);
    }
    return makeDb(dbFile as ArrayBuffer);
  } else {
    return makeDb(db as ArrayBuffer);
  }
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
  sqlQuery +=
    "GROUP BY blog.blog_id ORDER BY blog.blog_id DESC LIMIT ? OFFSET ? ";
  params.push(criteria.end - criteria.begin, criteria.begin);

  // 执行查询
  const result = db.exec(sqlQuery, params);

  // 转换查询结果为 JSON 格式
  const columns = result[0].columns;
  const values = result[0].values;
  return values.map((row) => {
    return row.reduce((obj: { [key: string]: any }, value, index) => {
      obj[columns[index]] =
        columns[index] === "tags" && value
          ? (value as string).split(",")
          : value;
      return obj;
    }, {});
  });
}

// 查找 blog 库中的数据量
export async function blogCount(criteria: {
  blogname: string;
  category: string;
  tags: string;
}) {
  const db = await loadDb();
  // 构建动态 SQL 查询
  let sqlQuery = `
    SELECT COUNT(DISTINCT blog.blog_id) AS blog_count
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

  // 执行查询
  const result = db.exec(sqlQuery, params);

  // 获取查询结果
  const count = result[0].values[0][0];
  return count;
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
      blog_id: String(row[0]),
      blog_name: String(row[1]),
      category_name: String(row[2]),
      tags: row[3] ? String(row[3]).split(",") : [],
      pull_address: String(row[4]),
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

// 按 category 名称 寻找对应 id
export async function get_category_id(category: string, dbFile: any = null) {
  const db = !dbFile ? await loadDb() : dbFile;

  const sqlQuery = `SELECT category_id FROM category where category_name = ?;`;
  const result = db.exec(sqlQuery, [category]);

  const row = result[0]?.values[0];
  if (row) {
    return row[0] as number;
  } else {
    return null;
  }
}

// 查找 category 库中的数据量
export async function get_category_count(dbFile: any = null) {
  const db = !dbFile ? await loadDb() : dbFile;

  const sqlQuery = `SELECT COUNT(*) FROM category;`;
  const result = db.exec(sqlQuery);

  const row = result[0]?.values[0];
  if (row) {
    return row[0] as number;
  } else {
    return 0;
  }
}

// 按 tag 名称 寻找对应 id
export async function get_tag_id(tag: string, dbFile: any = null) {
  const db = !dbFile ? await loadDb() : dbFile;

  const sqlQuery = `SELECT tag_id FROM tag where tag_name = ?;`;
  const result = db.exec(sqlQuery, [tag]);

  const row = result[0]?.values[0];
  if (row) {
    return row[0] as number;
  } else {
    return null;
  }
}

// 查找 tag 库中的数据量
export async function get_tag_count(dbFile: any = null) {
  const db = !dbFile ? await loadDb() : dbFile;

  const sqlQuery = `SELECT COUNT(*) FROM tag;`;
  const result = db.exec(sqlQuery);

  const row = result[0]?.values[0];
  if (row) {
    return row[0] as number;
  } else {
    return 0;
  }
}

// 查找 blog 库中的数据量
export async function get_blog_count(dbFile: any = null) {
  const db = !dbFile ? await loadDb() : dbFile;

  const sqlQuery = `SELECT COUNT(*) FROM blog;`;
  const result = db.exec(sqlQuery);

  const row = result[0]?.values[0];
  if (row) {
    return row[0] as number;
  } else {
    return 0;
  }
}

// 对本地数据库执行修改
export async function update_db(sql: string, dbFile: any) {
  dbFile.exec(sql);
  return dbFile;
}

// 按 blog 名称 寻找对应 id
export async function get_blog_id(blog: string, dbFile: any = null) {
  const db = !dbFile ? await loadDb() : dbFile;

  const sqlQuery = `SELECT blog_id FROM blog where blog_name = ?;`;
  const result = db.exec(sqlQuery, [blog]);

  const row = result[0]?.values[0];
  if (row) {
    return row[0] as number;
  } else {
    return null;
  }
}