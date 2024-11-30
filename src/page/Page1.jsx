import React from "react";
import { Col, Row, Menu, Switch, Input, Button, InputNumber } from "antd";
import {
    HighlightOutlined, InfoCircleFilled, ArrowLeftOutlined,
    DesktopOutlined, MobileOutlined, FontSizeOutlined,
    DownCircleOutlined, SlidersOutlined, CheckSquareOutlined,
    CheckCircleOutlined, FormOutlined, EditOutlined, ControlOutlined,
    LinkOutlined, FontColorsOutlined, FileOutlined
} from "@ant-design/icons";
import './Page1.css';

const menuItems = [
    {
        key: 'sub1',
        label: 'Layout',
        children: [],
    },
    {
        key: 'sub2',
        label: 'Basic Field',
        children: [
            { key: '1', label: 'Input', icon: <FontSizeOutlined /> },
            { key: '2', label: 'Select', icon: <DownCircleOutlined /> },
            { key: '3', label: 'Switch', icon: <ControlOutlined /> },
            { key: '4', label: 'Check box', icon: <CheckSquareOutlined /> },
            { key: '5', label: 'Radio', icon: <CheckCircleOutlined /> },
            { key: '6', label: 'TextArea', icon: <EditOutlined /> },
            { key: '7', label: 'Input Number', icon: <FormOutlined /> },
            { key: '8', label: 'Slider', icon: <SlidersOutlined /> },
            { key: '9', label: 'Link', icon: <LinkOutlined /> },
            { key: '10', label: 'Text', icon: <FontColorsOutlined /> },
        ],
    },
    {
        key: 'sub4',
        label: 'Advance Field',
        children: [{ key: '11', label: 'File', icon: <FileOutlined /> }],
    },
];

const Header = () => (
    <Row className="WrapperHeader-1">
        <Col span={3} style={{ display: 'flex' }}>
            <ArrowLeftOutlined style={{ marginRight: '15px' }} /> Back
        </Col>
        <Col span={11} style={{ display: 'flex'}}>
            <Button color="default" variant="outlined" style={{ margin: '0px 10px' }}>
                <DesktopOutlined />
            </Button>
            <Button color="default" variant="outlined">
                <MobileOutlined />
            </Button>
        </Col>
        <Col span={10} className="header-actions">
            <Switch
                checkedChildren={<HighlightOutlined />}
                uncheckedChildren={<HighlightOutlined />}
                defaultChecked
            />
            <Button color="primary" variant="outlined">Clear</Button>
            <Button color="primary" variant="outlined">Preview</Button>
            <Button color="primary" variant="outlined">Save</Button>
            <Button color="primary" variant="solid">Publish</Button>
        </Col>
    </Row>
);

const Sidebar = () => (
    <div className="sidebar">
        <div className="sidebar-header">
            <h1>New App</h1>
            <Input placeholder="Search Element" />
        </div>
        <Menu
            mode="inline"
            defaultSelectedKeys={[]}
            style={{ width: "100%", backgroundColor: 'rgb(245,244,249)' }}
            items={menuItems}
        />
    </div>
);

const Content = () => (
    <div className="content">
        <div className="box">
            <Input placeholder="Text" variant="borderless" style={{ width: 690 }} />
        </div>
        <div className="box">
            <InputNumber
                placeholder="0"
                style={{ width: 670 }}
            />
        </div>
        <div className="box">
            <Input placeholder="" style={{ width: 670 }} />
        </div>
        <div className="box-title">
            <div className="title">
                <InfoCircleFilled style={{ margin: 'auto 10px', color: 'rgb(28,123,255)' }} /> Title
            </div>
        </div>
    </div>
);

const Page1 = () => (
    <>
        <Header />
        <div style={{ display: "flex" }}>
            <Sidebar />
            <Content />
        </div>
    </>
);

export default Page1;
