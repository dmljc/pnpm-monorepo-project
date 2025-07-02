import { FC } from "react";
import { Drawer } from "antd";

interface Props {
    open: boolean;
    onClose: () => void;
}

const CreateMenu: FC<Props> = (props) => {
    const { open, onClose } = props;

    return (
        <Drawer title="新增菜单" onClose={onClose} open={open} size="large">
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Drawer>
    );
};

export default CreateMenu;
