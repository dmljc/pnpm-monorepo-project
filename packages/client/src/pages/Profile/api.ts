import { request } from "@/utils";

export const info = (): Promise<any> => {
    return request.get("/user/info", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
};
