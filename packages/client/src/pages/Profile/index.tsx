import { FC } from "react";
import { useUserStore } from "@/store";

const Profile: FC = () => {
    const userInfo = useUserStore().userInfo;

    return (
        <>
            <h1>Profile:用户信息，取自 system store</h1>
            {userInfo && (
                <>
                    <p>role: {userInfo.role}</p>
                    <p>username: {userInfo.username}</p>
                    <p>password: {userInfo.password}</p>
                    <p>name: {userInfo.name}</p>
                    <p>phone: {userInfo.phone}</p>
                    <p>status: {userInfo.status}</p>
                    <p>remark: {userInfo.remark}</p>
                </>
            )}
        </>
    );
};

export default Profile;
