import { FC } from "react";
import type { DataType } from "@/components/TreeTable/interface";
import TreeTable from "@/components/TreeTable";

const Menu: FC = () => {
    return <TreeTable<DataType> editable={true} />;
};

export default Menu;
