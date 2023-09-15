import OSS from "ali-oss";

const client = new OSS({
  accessKeyId: "LTAI5tLveXNCdrzuCnREhasF",
  accessKeySecret: "MJomZT1py3R9uh4Q9aCBTjJIt0fhjB",
  region: "oss-cn-shenzhen",
  bucket: "sonarmeta",
  secure: true,
});

export const uploadFile = async (root: string, file: File | Blob) => {
  try {
    return await client.put(`v4/${root}`, file); // 所有声呐元v4的oss文件夹
  } catch (error: any) {
    throw new Error(`Failed to upload file to ali oss. ${error.message}`);
  }
};

export const deleteMulti = async (keys: string[]) => {
  try {
    return await client.deleteMulti(keys, { quiet: true });
  } catch (error: any) {
    throw new Error(`Failed to delete files in ali oss. ${error.message}`);
  }
};
