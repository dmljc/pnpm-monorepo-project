import { FC, useEffect, useState } from "react";
import { Divider, Col, Row, Descriptions, Spin, Table } from "antd";
import type { TableProps } from "antd";
import { info } from "./api";

interface CpuInfo {
    cpuNum: number;
    free: string;
    sys: string;
    used: string;
}
interface MemInfo {
    free: string;
    total: string;
    usage: string;
    used: string;
}
interface DistInfo {
    dirName: string;
    free: string;
    total: string;
    typeName: string;
    usage: string;
    used: string;
}
interface SysInfo {
    computerIp: string;
    computerName: string;
    osArch: string;
    osName: string;
}

interface ServerInfoData {
    cpu?: CpuInfo;
    mem?: MemInfo;
    dist?: DistInfo[];
    sys?: SysInfo;
}

// ==================== 表格列配置 ====================
const createSysColumns = (): TableProps<SysInfo>["columns"] => [
    {
        title: "服务器名称",
        dataIndex: "osName",
        key: "osName",
    },
    {
        title: "ip地址",
        dataIndex: "computerIp",
        key: "computerIp",
    },
    {
        title: "操作系统",
        dataIndex: "computerName",
        key: "computerName",
    },
    {
        title: "系统架构",
        dataIndex: "osArch",
        key: "osArch",
    },
];

const createDiskColumns = (): TableProps<DistInfo>["columns"] => [
    {
        title: "盘符路径",
        dataIndex: "dirName",
        key: "dirName",
    },
    {
        title: "文件系统",
        dataIndex: "typeName",
        key: "typeName",
    },
    {
        title: "总大小",
        dataIndex: "total",
        key: "total",
    },
    {
        title: "已用大小",
        dataIndex: "used",
        key: "used",
    },
    {
        title: "可用大小",
        dataIndex: "free",
        key: "free",
    },
    {
        title: "已用百分比",
        dataIndex: "usage",
        key: "usage",
        render: (text) => <span>{text}%</span>,
    },
];

const ServerInfo: FC = () => {
    // ==================== 状态管理 ====================
    const [data, setData] = useState<ServerInfoData | null>(null);
    const [loading, setLoading] = useState(false);

    // ==================== 副作用钩子 ====================
    useEffect(() => {
        getServerInfo();
    }, []);

    // ==================== API 调用函数 ====================
    const getServerInfo = async () => {
        setLoading(true);
        try {
            const res = await info();
            setData(res.data);
        } catch (error) {
            console.error("获取服务器信息失败:", error);
        } finally {
            setLoading(false);
        }
    };

    // ==================== 渲染函数 ====================
    const renderCpuInfo = () => (
        <Descriptions title="CPU" bordered column={1}>
            <Descriptions.Item label="核心数">
                {data?.cpu?.cpuNum}
            </Descriptions.Item>
            <Descriptions.Item label="用户使用率">
                {data?.cpu?.used}%
            </Descriptions.Item>
            <Descriptions.Item label="系统使用率">
                {data?.cpu?.sys}%
            </Descriptions.Item>
            <Descriptions.Item label="当前闲置率">
                {data?.cpu?.free}%
            </Descriptions.Item>
        </Descriptions>
    );

    const renderMemInfo = () => (
        <Descriptions title="内存" bordered column={1}>
            <Descriptions.Item label="总内存">
                {data?.mem?.total}G
            </Descriptions.Item>
            <Descriptions.Item label="已用内存">
                {data?.mem?.used}G
            </Descriptions.Item>
            <Descriptions.Item label="剩余内存">
                {data?.mem?.free}G
            </Descriptions.Item>
            <Descriptions.Item label="使用率">
                {data?.mem?.usage}%
            </Descriptions.Item>
        </Descriptions>
    );

    // ==================== 表格配置 ====================
    const sysColumns = createSysColumns();
    const diskColumns = createDiskColumns();

    return (
        <Spin spinning={loading}>
            <Row gutter={16}>
                <Col span={12}>{renderCpuInfo()}</Col>
                <Col span={12}>{renderMemInfo()}</Col>
            </Row>
            <Divider />
            <Table<SysInfo>
                title={() => <h3>服务器信息</h3>}
                columns={sysColumns}
                dataSource={data?.sys ? [data.sys] : []}
                pagination={false}
                rowKey="computerIp"
            />
            <Divider />
            <Table<DistInfo>
                title={() => <h3>磁盘信息</h3>}
                columns={diskColumns}
                dataSource={data?.dist || []}
                pagination={false}
                rowKey="dirName"
            />
        </Spin>
    );
};

export default ServerInfo;
