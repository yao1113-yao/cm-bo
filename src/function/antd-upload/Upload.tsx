import { GetProp, Upload, UploadProps } from "antd";
import Swal from "sweetalert2";

export const normFile = (e: any) => {
  if (Array.isArray(e)) return e;
  return e?.fileList;
};
export const checkMedia = (file: any) => {
  if (file.size > 100000000 || !["jpg", "jpeg", "png"].includes(file.type.split("/")[1])) {
    Swal.fire({ html: ``, icon: "warning" });
    return Upload.LIST_IGNORE;
  }
  return false;
};

export const checkImage = (file: any) => {
  const isValidSize = file.size < 2000000000;
  if (!isValidSize) {
    return Upload.LIST_IGNORE;
  }
  return false;
};

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const previewMedia = async (file: any) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  return file.url || file.preview;
};
