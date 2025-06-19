import { request } from "@/utils";
import { useUserStore } from "@/store/userStore";

export const info = (): Promise<any> => {
    const token = useUserStore.getState().accessToken;
    return request.get("/user/info", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
