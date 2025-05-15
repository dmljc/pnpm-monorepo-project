import { useState, useEffect } from "react";
import { Upload, Image, message } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { upload } from "./api";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface CoverUploadProps {
    value?: string;
    maxCount?: number;
    // 'editable' | 'disabled' | 'readOnly' | 'readPretty' //Field interaction
    pattern?: "editable" | "readOnly";
    onSuccess?: (url: string) => void;
    onError?: (error: Error) => void;
}

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const OSSUpload = (props: CoverUploadProps) => {
    const { value = "", maxCount = 1, pattern = "editable" } = props;

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [uploading, setUploading] = useState(false);

    const defaultFile = value
        ? {
              uid: Math.random().toString(),
              name: `${new Date().toLocaleString()}.png`, // 使用时间戳作为文件名,
              status: "done",
              url: value,
          }
        : null;

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (defaultFile && value) {
            setFileList([defaultFile]);
        } else {
            setFileList([]);
        }
    }, [value, defaultFile?.url]);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const beforeUpload = async (file: File) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await upload(formData);
            console.log("Upload success:", response.data);

            const url = response?.data?.url;
            // 添加成功回调
            props.onSuccess?.(url);
            return url; // 返回文件访问地址
        } catch (error) {
            console.error("Upload failed:", error);
            message.error("上传失败，请重试");
            props.onError?.(error as Error);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleChange: UploadProps["onChange"] = ({
        fileList: newFileList,
    }) => {
        const file = newFileList?.[0];
        setFileList(file ? [file] : []);
    };

    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <>
            <Upload
                listType="picture-circle"
                maxCount={maxCount}
                fileList={fileList}
                onPreview={handlePreview}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                showUploadList={{
                    showRemoveIcon: pattern === "editable" ? true : false,
                }}
                disabled={uploading || pattern === "readOnly"}
                action="" // 注意：添加空的action属性以防止默认提交行为
                // 通过覆盖默认的上传行为，可以自定义自己的上传实现
                customRequest={({ file, onSuccess }) => {
                    onSuccess?.("ok");
                }}
            >
                {pattern === "readOnly" || fileList.length >= maxCount
                    ? null
                    : uploadButton}
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
        </>
    );
};

export default OSSUpload;
