import { request } from "@/utils";
import { CreateUser, UpdateUser, ListParams } from "./interface";

export const register = (data: any): Promise<any> => {
    return request.post("/user/register", data);
};

export const list = (data: ListParams): Promise<any> => {
    return request.get("/user/list", {
        params: data,
    });
};

export const create = (data: CreateUser): Promise<any> => {
    return request.post("/user/create", data);
};

export const update = (data: UpdateUser): Promise<any> => {
    return request.put("/user/update", data);
};

export const detail = (id: number): Promise<any> => {
    return request.get(`/user/${id}`);
};

export const del = (id: number): Promise<any> => {
    return request.delete(`/user/delete/${id}`);
};

export const freeze = (id: number, status: number): Promise<any> => {
    return request.get(`/user/freeze?id=${id}&status=${status}`);
};

export const importExcel = (data: FormData): Promise<any> => {
    return request.post("/excel/import", data, {
        responseType: "blob",
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
export const exportExcel = (): Promise<any> => {
    return request.post("/excel/export", null, {
        responseType: "blob",
        headers: {
            Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
    });
};
