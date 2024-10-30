import { SetStateAction, useEffect, useState } from 'react';
import { Button, Card, Avatar, Form, Input, message } from 'antd';
import CreateModal from './CreateModal.tsx';
import { UpdateBook } from './interface.ts';
import { list, detail, del } from './api';
import './index.css';

const { Meta } = Card;

const BookManage = () => {
    const [bookList, setBookList] = useState<Array<UpdateBook>>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [modalType, setModalType] = useState<string>('create');
    const [record, setRecord] = useState<UpdateBook>();

    const fetchList = async () => {
        try {
            const resp = await list({
                name
            });

            if (resp.success) {
                setBookList(resp.data);
            }
        } catch (e) {
            message.error((e as any).response.data.message);
        }
    };

    useEffect(() => {
        fetchList();
    }, [name]);

    const onSearch = (values: { name: SetStateAction<string> }) => {
        setName(values.name);
    };

    const fetchDetail = async (id: number) => {
        const resp = await detail(id);
        console.log('detail-data:', resp);
    };

    const onDelete = async (id: number) => {
        const resp = await del(id);
        console.log('resp', resp);
        fetchList();
    };

    return (
        <div id="bookManage">
            <h1>英雄管理系统</h1>
            <div className="content">
                <div className="book-search">
                    <Form
                        name="search"
                        layout="inline"
                        colon={false}
                        onFinish={onSearch}
                    >
                        <Form.Item label="英雄名称" name="name">
                            <Input />
                        </Form.Item>
                        <Form.Item label=" ">
                            <Button type="primary" htmlType="submit">
                                搜索英雄
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ background: 'green' }}
                                onClick={() => {
                                    setModalOpen(true);
                                    setModalType('create');
                                }}
                            >
                                添加英雄
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className="book-list">
                    {bookList?.map(item => {
                        return (
                            <Card
                                className="card"
                                hoverable
                                style={{ width: 300 }}
                                cover={
                                    <img
                                        alt="example"
                                        src={`http://localhost:3000/${item.avatar}`}
                                    />
                                }
                            >
                                <Meta
                                    avatar={
                                        <Avatar
                                            src={`http://localhost:3000/${item.avatar}`}
                                        />
                                    }
                                    title={item.name}
                                    description={item.description}
                                />
                                <div className="links">
                                    <a
                                        onClick={() => {
                                            setRecord(item);
                                            fetchDetail(item.id);
                                        }}
                                    >
                                        详情
                                    </a>
                                    <a
                                        onClick={() => {
                                            setModalOpen(true);
                                            setModalType('update');
                                            setRecord(item);
                                        }}
                                    >
                                        编辑
                                    </a>
                                    <a onClick={() => onDelete(item.id)}>
                                        删除
                                    </a>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* 使用非空断言操作符（!） */}
            {/* 如果你确定变量不会是 undefined，可以使用 ! 来告诉 TypeScript 编译器这个变量不会是 undefined。 */}
            <CreateModal
                isOpen={modalOpen}
                modalType={modalType}
                record={record!}
                handleClose={() => {
                    fetchList();
                    setModalOpen(false);
                }}
            />
        </div>
    );
};

export default BookManage;
