import { request } from "../../utils/request";

export const register = (data: any): Promise<any> => {
    return request.post("/user/register", data);
};

import { CreateBook, UpdateBook, ListParams } from "./interface";

export const list = (data: ListParams): Promise<any> => {
    return request.get("/book/list", {
        params: data,
    });
};

export const create = (data: CreateBook): Promise<any> => {
    return request.post("/book/create", data);
};

export const update = (data: UpdateBook): Promise<any> => {
    return request.put("/book/update", data);
};

export const detail = (id: number): Promise<any> => {
    return request.get(`/book/${id}`);
};

export const del = (id: number): Promise<any> => {
    return request.delete(`/book/delete/${id}`);
};
