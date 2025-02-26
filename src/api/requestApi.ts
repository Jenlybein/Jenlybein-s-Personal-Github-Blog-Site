import request from "@/api/requestUtil";
import { getDatabase, removeDatabase, setDatabase } from "@/utils/tokenUtils";
export const getDb = async () => {
  let db = getDatabase();
  // let db = null;
  if (db === null) {
    const dbFile = await request.get(
      "https://raw.githubusercontent.com/Jenlybein/jenlybein.github.io/ac/ac.db",
      {
        responseType: "arraybuffer",
      }
    );
    db = dbFile.data
    setDatabase(db as ArrayBuffer);
  }
  return db;
};

export const getBlog = async (address:string) => {
  const mdFile = await request.get(
    "https://raw.githubusercontent.com/Jenlybein/Notes-Markdown/main/"+address);
  return mdFile.data
};