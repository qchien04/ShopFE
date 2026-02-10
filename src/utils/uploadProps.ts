import type { UploadProps } from "antd";
import axios from "axios";
import { BASE_URL } from "../app/const";
import { antdMessage } from "./antdMessage";

export const uploadProps = (form: any,fieldName: string): UploadProps => ({
  name: "file",
  multiple: fieldName === "images",
  showUploadList: true,

  customRequest: async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append("file", file as File);

      const res = await axios.post(
        `${BASE_URL}/upload/image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const picture = res.data; 

      const uploadFile = {
        uid: picture.id?.toString() ?? Date.now().toString(),
        name: (file as File).name,
        status: "done",
        url: picture.imageUrl,
        response: picture,
      };

      const fileList = form.getFieldValue(fieldName) || [];

      if (fieldName === "mainPicture") {
        form.setFieldsValue({ mainPicture: [uploadFile] }); // chỉ 1 ảnh
      } else {
        form.setFieldsValue({ [fieldName]: [...fileList, uploadFile] });
      }

      onSuccess?.(picture);
      
      antdMessage.success("Upload ảnh thành công");
    } catch (err) {
      console.log(err)
      antdMessage.error("Upload ảnh thất bại");
      onError?.(err as any);
    }
  },

  onRemove: (file) => {
    const files = form.getFieldValue(fieldName) || [];
    form.setFieldsValue({
      [fieldName]: files.filter((f: any) => f.uid !== file.uid),
    });
  },
  
});
