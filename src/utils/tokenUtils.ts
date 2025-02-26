// 持久化实现
const DatabaseKey = "vue_blog_database";
const ExpiryKey = "vue_blog_database_expiry"; // 保存过期时间的 key
const CACHE_EXPIRY_TIME = 3600 * 1000; // 单位是毫秒

export function getDatabase() {
  const savedBase64 = localStorage.getItem(DatabaseKey);
  const expiryTime = localStorage.getItem(ExpiryKey);
  if (!savedBase64 || !expiryTime) return null;

  // 如果缓存已经过期，则清除缓存并返回 null
  const currentTime = new Date().getTime();
  if (currentTime > parseInt(expiryTime)) {
    removeDatabase();
    return null;
  }

  // 将字符转换为字节
  const binaryString = atob(savedBase64);
  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }

  return byteArray.buffer;
}

// 将数据库文件编码为 base64 并保存到 localStorage
export function setDatabase(dbFile: ArrayBuffer) {
  // 将 ArrayBuffer 转换为二进制字符串
  const byteArray = new Uint8Array(dbFile);
  let binaryString = "";
  for (let i = 0; i < byteArray.length; i++) {
    binaryString += String.fromCharCode(byteArray[i]);
  }
  const base64String = btoa(binaryString);

  // 记录过期时间
  const expiryTime = new Date().getTime() + CACHE_EXPIRY_TIME;

  localStorage.setItem(DatabaseKey, base64String);
  localStorage.setItem(ExpiryKey, expiryTime.toString());
}

// 删除数据库
export function removeDatabase() {
  localStorage.removeItem(DatabaseKey);
  localStorage.removeItem(ExpiryKey);
}
