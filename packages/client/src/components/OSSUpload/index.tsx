import { useState } from "react";
import { Upload, Image } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { upload } from "./api";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const OSSUpload = () => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleUpload = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await upload(formData);
            console.log("Upload success:", response.data);
            return response.data.url; // 返回文件访问地址
        } catch (error) {
            console.error("Upload failed:", error);
            return null;
        }
    };

    const handleChange: UploadProps["onChange"] = ({
        fileList: newFileList,
    }) => {
        const file = newFileList?.[0];
        if (file) {
            file.status = "done";
            setFileList([file]);
        } else {
            setFileList([]);
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <span style={{ minHeight: 102 }}>
            <Upload
                listType="picture-circle"
                fileList={fileList}
                onPreview={handlePreview}
                beforeUpload={handleUpload}
                onChange={handleChange}
            >
                {fileList.length === 1 ? null : uploadButton}
            </Upload>
            {previewImage && (
                <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) =>
                            !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                />
            )}
        </span>
    );
};

export default OSSUpload;
