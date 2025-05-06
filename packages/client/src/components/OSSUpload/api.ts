import { request } from "@/utils";

export const upload = (data: any): Promise<any> => {
    return request.post("/minio/upload", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
