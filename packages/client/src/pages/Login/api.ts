import { request } from "../../utils/request";
import { useUserStore } from "@/store/userStore";

export const login = (data: any): Promise<any> => {
    return request.post("/auth/login", data);
};

export const emailCaptcha = (data: any): Promise<any> => {
    return request.get("/email/captcha", {
        params: data,
    });
};

export const userInfo = (): Promise<any> => {
    const token = useUserStore.getState().accessToken;
    return request.get("/user/info", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
