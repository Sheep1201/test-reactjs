import React from "react";
import { Col, Row, Menu, Switch, Input, Button } from "antd";
import {
    HighlightOutlined,
    SettingTwoTone,
    PictureOutlined,
    ArrowLeftOutlined,
    FullscreenOutlined,
    LaptopOutlined,
    EditOutlined,
    FontSizeOutlined,
} from "@ant-design/icons";
import "./Page2.css";
import menubar from "../asset/menu-bar.png";
import grid from "../asset/grid.png";
import menu from "../asset/menu.png";
import FlowChart from './FlowChart';


// Define menu items
const menuItems = [
    {
        key: "sub1",
        label: "NAVIGATION",
        children: [],
    },
    { type: "divider" },
    {
        key: "sub2",
        label: "System",
        children: [],
    },
    { type: "divider" },
    {
        key: "sub3",
        label: "TOUCH",
        children: [
            {
                key: "1",
                label: "Touch",
                icon: <FullscreenOutlined />,
            },
            {
                key: "2",
                label: "Swipe/Scroll",
                icon: <FullscreenOutlined />,
            },
        ],
    },
    { type: "divider" },
    {
        key: "sub4",
        label: "SCREEN",
        children: [
            {
                key: "11",
                label: "Screenshot",
                icon: <PictureOutlined />,
            },
        ],
    },
    { type: "divider" },
    {
        key: "sub5",
        label: "KEYBOARD",
        children: [
            {
                key: "12",
                label: "Press key",
                icon: <LaptopOutlined />,
            },
            {
                key: "13",
                label: "Type text",
                icon: <FontSizeOutlined />,
            },
        ],
    },
    { type: "divider" },
    {
        key: "sub6",
        label: "DATA",
        children: [
            {
                key: "14",
                label: "Update field",
                icon: <EditOutlined />,
            },
        ],
    },
];

// Header Component
const Header = () => (
    <Row className="WrapperHeader-2">
        <Col span={3} style={{ display: "flex" }}>
            <ArrowLeftOutlined style={{ marginRight: "15px" }} /> Back
        </Col>
        <Col span={11} style={{ display: "flex", padding: "10px 10px" }}>
            <Input placeholder="Search node..." style={{ width: "300px" }} />
        </Col>
        <Col
            span={10}
            style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px" }}
        >
            <Switch
                checkedChildren={<HighlightOutlined />}
                unCheckedChildren={<HighlightOutlined />}
                defaultChecked
            />
            <Button type="default">Device view</Button>
            <SettingTwoTone style={{ fontSize: "22px" }} />
            <img alt="iconMenuBar" src={menubar} className="icon" />
            <img alt="iconGrid" src={grid} className="icon" />
            <Button type="primary">Save</Button>
            <Button type="primary">Run</Button>
            <img alt="iconMenu" src={menu} className="icon" />
        </Col>
    </Row>
);

// Sidebar Component
const Sidebar = () => (
    <div style={{ width: "256px", height: "100vh", padding: "10px" }}>
        <div style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center" }}>
            <h1>New App</h1>
            <EditOutlined />
            <div className="version">v1.0.2</div>
        </div>
        <Input placeholder="Search" />
        <hr className="custom-hr" />
        <Input placeholder="Search (ctrl+f)" />
        <Menu
            mode="inline"
            defaultSelectedKeys={[]}
            style={{ width: "100%", fontWeight: "500", padding: "20px" }}
            items={menuItems}
        />
    </div>
);

// Main Page Component
const Page2 = () => {
    return (
        <>
            <Header />
            <div style={{ display: "flex" }}>
                <Sidebar />
                <div style={{ flex: 1, padding: "20px", height: "100%", overflow: "auto" }}>
                    {/* Flowchart Component */}
                    <FlowChart />
                </div>
            </div>
        </>
    );
};

export default Page2;
