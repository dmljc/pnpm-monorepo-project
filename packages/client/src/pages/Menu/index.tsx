import { FC } from "react";
import TreeTable from "@/components/TreeTable";
import type { DataType } from "@/components/TreeTable/interface";
import { usePermission } from "@/utils";

const Menu: FC = () => {
    return (
        <TreeTable<DataType>
            editable={true}
            selecteable={usePermission("menu:create")}
        />
    );
};

export default Menu;
