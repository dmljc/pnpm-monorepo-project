import { request } from "@/utils";

export const register = (data: any): Promise<any> => {
    return request.post("/user/register", data);
};

import { CreateUser, UpdateUser, ListParams } from "./interface";

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
