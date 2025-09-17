import { FC } from "react";
import { useTranslation } from "react-i18next";

const Workplace: FC = () => {
    const { t } = useTranslation();

    return (
        <h1>
            工作台 页面: {t("welcome")}
            <button>{t("button.submit")}</button>
        </h1>
    );
};

export default Workplace;
