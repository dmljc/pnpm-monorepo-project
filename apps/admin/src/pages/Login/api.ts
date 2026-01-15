import { request } from "../../utils/request";

export const emailCaptcha = (data: any): Promise<any> => {
    return request.get("/email/captcha", {
        params: data,
    });
};
