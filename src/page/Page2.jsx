import React, { useState } from "react";
import { Col, Row, Menu, Switch, Input, Button } from "antd";
import {
    HighlightOutlined, OpenAIOutlined, MailOutlined, ApiOutlined, CheckSquareOutlined, WifiOutlined, SettingTwoTone, DeleteOutlined, FileOutlined, StopOutlined,
    CaretRightOutlined, AppstoreOutlined, HomeOutlined, PictureOutlined, ArrowLeftOutlined, FullscreenOutlined, EditOutlined, FontSizeOutlined, ReloadOutlined,
    GlobalOutlined
} from "@ant-design/icons";
import "./Page2.css";
import menubar from "../asset/menu-bar.png";
import menu from "../asset/menu.png";
import DnDFlow from '../component/DnDFlow';
import Icon from '@ant-design/icons';
import {
    stopSvg, table, cmd, database_backup, mobile_info, tfa, bracket, pause, question_circle, coding, loop, comment,
    gui_random, table_header, variable, SpreadSheet, dice, write_file, read_file,
    installApp, attribute, cube, swap, mobile_vibrate, mobile_action, clipboard, keyboard, mobile_property,
    image_search
} from '../asset/index';
import ReactDOM from 'react-dom/client';

const menuItems = [
    {
        key: "sub1", label: "NAVIGATION", children: [
            { key: "press back", label: "Press back", icon: <ArrowLeftOutlined style={{ fontSize: '20px' }} /> },
            { key: "press home", label: "Press home", icon: <HomeOutlined style={{ fontSize: '20px' }} /> },
            { key: "press menu", label: "Press menu", icon: <AppstoreOutlined style={{ fontSize: '20px' }} /> },
        ],
    },
    {
        key: "sub2", label: "System", children: [
            { key: "start app", label: "Start App", icon: <CaretRightOutlined style={{ fontSize: '25px', marginLeft: '-2px' }} /> },
            { key: "stop app", label: "Stop App", icon: <Icon component={stopSvg} style={{ fontSize: '15px' }} /> },
            { key: "install app", label: "Install App", icon: <Icon component={installApp} style={{ fontSize: '20px' }} /> },
            { key: "uninstall app", label: "Uninstall App", icon: <DeleteOutlined style={{ fontSize: '20px' }} /> },
            { key: "is installed app", label: "Is installed App", icon: <Icon component={cube} style={{ fontSize: '20px' }} /> },
            { key: "transfer file", label: "Transfer File", icon: <Icon component={swap} style={{ fontSize: '20px' }} /> },
            { key: "device actions", label: "Device actions", icon: <Icon component={mobile_vibrate} style={{ fontSize: '20px' }} /> },
            { key: "toggle service", label: "Toggle service", icon: <WifiOutlined style={{ fontSize: '20px' }} /> },
            { key: "check activity", label: "Device actions", icon: <Icon component={mobile_action} style={{ fontSize: '20px' }} /> },
            { key: "clipboard", label: "Clipboard", icon: <Icon component={clipboard} style={{ fontSize: '20px' }} /> },
        ],
    },
    {
        key: "sub3", label: "TOUCH", children: [
            { key: "touch", label: "Touch", icon: <FullscreenOutlined style={{ fontSize: '20px' }} /> },
            { key: "swipe/scroll", label: "Swipe/Scroll", icon: <FullscreenOutlined style={{ fontSize: '20px' }} /> },
        ],
    },
    {
        key: "sub4", label: "SCREEN", children: [
            { key: "screen shot", label: "Screen shot", icon: <PictureOutlined style={{ fontSize: '20px' }} /> },
        ],
    },
    {
        key: "sub5", label: "KEYBOARD", children: [
            { key: "press key", label: "Press key", icon: <Icon component={keyboard} style={{ fontSize: '20px' }} /> },
            { key: "type text", label: "Type text", icon: <FontSizeOutlined style={{ fontSize: '20px' }} /> },
        ],
    },
    {
        key: "sub6", label: "DATA", children: [
            { key: "update field", label: "Update field", icon: <EditOutlined style={{ fontSize: '20px' }} /> },
            { key: "get property", label: "Get property", icon: <Icon component={mobile_property} style={{ fontSize: '20px' }} /> },
            { key: "element exists", label: "Element exists", icon: <CheckSquareOutlined style={{ fontSize: '20px' }} /> },
            { key: "get attribute", label: "Get attribute", icon: <Icon component={attribute} style={{ fontSize: '25px', marginLeft: '-2px' }} /> },
            { key: "random", label: "Random", icon: <Icon component={dice} style={{ fontSize: '23px', marginLeft: '-2px' }} /> },
            { key: "http", label: "HTTP", icon: <ApiOutlined style={{ fontSize: '20px' }} /> },
            { key: "read file/variable", label: "Read file/variable", icon: <Icon component={read_file} style={{ fontSize: '23px', marginLeft: '-2px' }} /> },
            { key: "write file", label: "Write file", icon: <Icon component={write_file} style={{ fontSize: '23px', marginLeft: '-5px' }} /> },
            { key: "set variable", label: "Set variable", icon: <Icon component={variable} style={{ fontSize: '23px', marginLeft: '-2px' }} /> },
            { key: "spreadsheet", label: "Spreadsheet", icon: <Icon component={SpreadSheet} style={{ fontSize: '23px', marginLeft: '-2px' }} /> },
            { key: "insert table", label: "Insert table", icon: <Icon component={table} style={{ fontSize: '20px', marginLeft: '-2px' }} /> },
            { key: "open ai", label: "Open AI", icon: <OpenAIOutlined style={{ fontSize: '20px' }} /> },
            { key: "case path", label: "Case Path", icon: <Icon component={gui_random} style={{ fontSize: '20px', marginLeft: '-2px' }} /> },
            { key: "regexp", label: "RegExp (Data extraction)", icon: <Icon component={bracket} style={{ fontSize: '20px', marginLeft: '-2px' }} /> },
            { key: "imap", label: "IMAP (Read mail)", icon: <MailOutlined /> },
            { key: "generate 2fa", label: "Generate 2FA", icon: <Icon component={tfa} style={{ fontSize: '20px', marginLeft: '-2px' }} /> },
        ],
    },
    {
        key: "sub7", label: "OTHER", children: [
            { key: "cmd", label: "Cmd", icon: <Icon component={cmd} style={{ fontSize: '20px', marginLeft: '-2px' }} /> },
            { key: "change info", label: "Change info", icon: <Icon component={mobile_info} style={{ fontSize: '20px', marginLeft: '-2px' }} /> },
            { key: "backup/restore", label: "Backup/Restore", icon: <Icon component={database_backup} style={{ fontSize: '20px', marginLeft: '-2px' }} /> },
            { key: "check network", label: "Check network", icon: <GlobalOutlined style={{ fontSize: '20px', marginLeft: '-2px' }} /> },
            { key: "adb shell command", label: "ADB shell command", icon: <Icon component={cmd} style={{ fontSize: '20px', marginLeft: '-2px' }} /> },
            { key: "image search", label: "Image search", icon: <Icon component={image_search} style={{ fontSize: '20px', marginLeft: '-2px' }} /> },
            { key: "sleep", label: "Sleep", icon: <Icon component={pause} style={{ fontSize: '20px', marginLeft: '-2px' }} /> },
            { key: "if", label: "If", icon: <Icon component={question_circle} style={{ fontSize: '20px', marginLeft: '-2px' }} /> },
            { key: "javascript", label: "Javascript", icon: <Icon component={coding} style={{ fontSize: '20px', marginLeft: '-2px' }} /> },
            { key: "loop", label: "Loop", icon: <Icon component={loop} style={{ fontSize: '20px', marginLeft: '-2px' }} /> },
            { key: "loop v2", label: "Loop V2", icon: <Icon component={loop} style={{ fontSize: '20px', marginLeft: '-2px' }} /> },
            { key: "break", label: "Break", icon: <ApiOutlined style={{ fontSize: '20px' }} /> },
            { key: "comment", label: "Comment", icon: <Icon component={comment} style={{ fontSize: '20px', marginLeft: '-2px' }} /> },
            { key: "file", label: "File", icon: <FileOutlined style={{ fontSize: '20px', marginLeft: '-2px' }} /> },
            { key: "stop", label: "Stop", type: "stop", icon: <StopOutlined style={{ fontSize: '20px', marginLeft: '-2px' }} /> },
            { key: "reconnect", label: "Reconnect", icon: <ReloadOutlined style={{ fontSize: '20px', marginLeft: '-2px' }} /> },
        ],
    },
];

const onDragStart = (event, nodeType, label) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
    console.log(`Dragging: ${label}`);
};

const menuItemsWithDrag = menuItems.map(item => ({
    ...item,
    children: item.children ? item.children.map(child => ({
        ...child,
        label: (
            <div
                draggable
                onDragStart={(event) => onDragStart(event, child.key, child.label)}
                style={{ padding: '8px', cursor: 'move' }}
            >
                {child.label}
            </div>
        )
    })) : [],
}));

const Header = ({ isPanelVisible, togglePanel, isDebugVisible, toggleDebug, isProcessing, toggleProcessing }) => (
    <Row className="WrapperHeader-2">
        <Col span={3} style={{ display: "flex" }}>
            <ArrowLeftOutlined style={{ marginRight: "15px" }} /> Back
        </Col>
        <Col span={11} style={{ display: "flex", padding: "10px 23px" }}>
            <Input placeholder="Search node..." style={{ width: "300px" }} />
        </Col>
        <Col span={10} style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px" }}>
            <Switch checkedChildren={<HighlightOutlined />} unCheckedChildren={<HighlightOutlined />} defaultChecked />
            <Button type="default">Device view</Button>
            <Button type="default" onClick={toggleDebug}>
                {isDebugVisible ? "Tắt Debug" : "Bật Debug"}
            </Button>
            <Button type="default" onClick={togglePanel}>
                {isPanelVisible ? "Ẩn Log" : "Hiện Log"}
            </Button>
            <SettingTwoTone style={{ fontSize: "22px" }} />
            <img alt="iconMenuBar" src={menubar} className="icon" />
            <Icon component={table_header} src={menubar} className="icon" style={{fontSize: '30px'}}/>
            <Button type="primary">Save</Button>
            <Button style={{width: '60px'}}
                type={isProcessing ? "primary" : "primary"} // Loại nút (default hoặc primary)
                danger={isProcessing} // Đặt màu đỏ khi đang xử lý
                onClick={toggleProcessing} // Gọi hàm bắt đầu hoặc dừng xử lý
            >
                {isProcessing ? "Stop" : "Run"} {/* Hiển thị tên nút */}
            </Button>


            <img alt="iconMenu" src={menu} className="icon" />
        </Col>
    </Row>
);


const Sidebar = () => (
    <div style={{ width: "256px", height: "90vh", padding: "10px" }}>
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
            style={{
                width: "100%",
                fontWeight: "500",
                padding: "20px",
                height: "calc(88vh - 150px)", // Chiều cao cố định cho menu
                overflowY: "auto", // Hiển thị thanh cuộn dọc
                overflowX: "hidden", // Ẩn thanh cuộn ngang
                scrollbarWidth: 'thin'
            }}
            items={menuItemsWithDrag}
        />
    </div>
);




const Page2 = () => {
    const [isPanelVisible, setIsPanelVisible] = useState(false); // Trạng thái hiển thị panel log
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDebugVisible, setIsDebugVisible] = useState(false); // Trạng thái bật chế độ debug
    const [flowResult, setFlowResult] = useState(null);

    const handleProcessEnd = (result) => {
        console.log('Kết quả nhận được từ DnDFlow:', result);
        setFlowResult(result); // Lưu kết quả vào state
    };

    React.useEffect(() => {
        if (flowResult !== null) {
            setIsProcessing(false); // Đổi trạng thái isProcessing về false khi có kết quả
        }
    }, [flowResult]);
    return (
        <>
            <Header
                isPanelVisible={isPanelVisible}
                togglePanel={() => setIsPanelVisible(!isPanelVisible)}
                isDebugVisible={isDebugVisible}
                toggleDebug={() => setIsDebugVisible(!isDebugVisible)}
                isProcessing={isProcessing}
                toggleProcessing={() => setIsProcessing(!isProcessing)}
            />
            <div style={{ display: "flex" }}>
                <Sidebar />
                <div style={{ flex: 1, padding: "0px", height: "100%" }}>
                    <div style={{ width: '100%', height: '93vh' }}>
                        <DnDFlow isPanelVisible={isPanelVisible} setIsPanelVisible={setIsPanelVisible} isDebugVisible={isDebugVisible} isProcessing={isProcessing} onProcessEnd={handleProcessEnd} />
                    </div>
                </div>
            </div>

        </>
    );
};

const mountNode = document.getElementById('root');
ReactDOM.createRoot(mountNode).render(<Page2 />);
export default Page2;