import { FC, useEffect, useState } from "react";
import { UserInfo } from "./interface";
import { info } from "./api";

const Profile: FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        const res = await info();
        setUserInfo(res?.data);
    };

    return (
        <>
            <h1>Profile</h1>
            {userInfo && (
                <>
                    <p>role: {userInfo.role}</p>
                    <p>username: {userInfo.username}</p>
                    <p>password: {userInfo.password}</p>
                    <p>name: {userInfo.name}</p>
                    <p>sex: {userInfo.sex}</p>
                    <p>phone: {userInfo.phone}</p>
                    <p>status: {userInfo.status}</p>
                    <p>remark: {userInfo.remark}</p>
                    {userInfo?.roles?.[0] && (
                        <>
                            {/* <p>roles: {userInfo.roles[0].id}</p> */}
                            <p>roles: {userInfo.roles[0].name}</p>
                            <p>roles: {userInfo.roles[0].code}</p>
                            <p>roles: {userInfo.roles[0].remark}</p>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default Profile;
