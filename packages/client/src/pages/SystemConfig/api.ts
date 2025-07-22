import { request } from "@/utils";
import { CreateSystemConfig, UpdateSystemConfig } from "./interface.ts";

export const create = (data: CreateSystemConfig): Promise<any> => {
    return request.post("/system/config/create", data);
};

export const update = (data: UpdateSystemConfig): Promise<any> => {
    return request.put("/system/config/update", data);
};

export const configDetail = (): Promise<any> => {
    return request.get(`/system/config`);
};

export const del = (id: number): Promise<any> => {
    return request.delete(`/system/config/delete/${id}`);
};
