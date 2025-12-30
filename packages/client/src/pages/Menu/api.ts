import { request } from "@/utils";
import { CreateMenu, UpdateMenu } from "./interface.ts";

export const create = (data: CreateMenu): Promise<any> => {
    return request.post("/menu/create", data);
};

export const update = (data: UpdateMenu): Promise<any> => {
    return request.put("/menu/update", data);
};

export const del = (id: number): Promise<any> => {
    return request.delete(`/menu/delete/${id}`);
};
