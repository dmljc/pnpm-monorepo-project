import { FC } from "react";
import { useUserStore } from "@/store";
import { useTranslation } from "react-i18next";

const Profile: FC = () => {
    const userInfo = useUserStore().userInfo;
    const { t } = useTranslation();

    return (
        <>
            <h1>{t("profile:title")}</h1>
            {userInfo && (
                <>
                    <p>
                        {t("profile:info.role")}: {userInfo.role}
                    </p>
                    <p>
                        {t("profile:info.username")}: {userInfo.username}
                    </p>
                    <p>
                        {t("profile:info.password")}: {userInfo.password}
                    </p>
                    <p>
                        {t("profile:info.name")}: {userInfo.name}
                    </p>
                    <p>
                        {t("profile:info.phone")}: {userInfo.phone}
                    </p>
                    <p>
                        {t("profile:info.status")}: {userInfo.status}
                    </p>
                    <p>
                        {t("profile:info.remark")}: {userInfo.remark}
                    </p>
                </>
            )}
        </>
    );
};

export default Profile;
