import { request } from "@/utils/request";

export const authLogin = (data: any): Promise<any> => {
    return request.post("/auth/login", data);
};

export const userInfoApi = (accessToken: string): Promise<any> => {
    return request.get("/user/info", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};
