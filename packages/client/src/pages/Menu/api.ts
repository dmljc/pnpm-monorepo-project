import { request } from "@/utils";
import { CreateMenu, UpdateMenu } from "./interface.ts";

// export const register = (data: any): Promise<any> => {
//     return request.post("/role/register", data);
// };

// export const list = (data: ListParams): Promise<any> => {
//     return request.get("/role/list", {
//         params: data,
//     });
// };

export const create = (data: CreateMenu): Promise<any> => {
    return request.post("/menu/create", data);
};

export const update = (data: UpdateMenu): Promise<any> => {
    return request.put("/menu/update", data);
};

// export const detail = (id: number): Promise<any> => {
//     return request.get(`/role/${id}`);
// };

// export const del = (id: number): Promise<any> => {
//     return request.delete(`/role/delete/${id}`);
// };
