import request from "@/api/requestUtil";
import { getDatabase, removeDatabase, setDatabase } from "@/utils/tokenUtils";
export const getDb = async () => {
  return await request.get(
    "https://raw.githubusercontent.com/Jenlybein/jenlybein.github.io/ac/ac.db?2231",
    {
      responseType: "arraybuffer",
    }
  );
};

export const getBlog = async (address: string) => {
  const mdFile = await request.get(address);
  return mdFile.data;
};
