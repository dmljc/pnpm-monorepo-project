import { request } from "@/utils";

export const info = (): Promise<any> => {
    return request.get("/user/info");
};

export const redis = (): Promise<any> => {
    return request.get("/redis");
};
