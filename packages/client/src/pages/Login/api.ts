import { request } from "../../utils/request";

export const login = (data: any): Promise<any> => {
    // return request.post("/user/login", data);
    return request.post("/auth/login", data);
};

export const emailCaptcha = (data: any): Promise<any> => {
    return request.get("/email/captcha", {
        params: data,
    });
};
