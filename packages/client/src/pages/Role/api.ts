import { request } from "@/utils";
import { CreateRole, UpdateRole, ListParams } from "./interface.ts";

export const register = (data: any): Promise<any> => {
    return request.post("/role/register", data);
};

export const list = (data: ListParams): Promise<any> => {
    return request.get("/role/list", {
        params: data,
    });
};

export const create = (data: CreateRole): Promise<any> => {
    return request.post("/role/create", data);
};

export const update = (data: UpdateRole): Promise<any> => {
    return request.put("/role/update", data);
};

export const detail = (id: number): Promise<any> => {
    return request.get(`/role/${id}`);
};

export const del = (id: number): Promise<any> => {
    return request.delete(`/role/delete/${id}`);
};
