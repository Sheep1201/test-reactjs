import React, { useState, useRef, useCallback, useMemo } from 'react';
import ReactFlow, {
    Edge,
    Handle,
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    Background
} from 'reactflow';
import 'reactflow/dist/style.css';
import './style.css';
import {
    OpenAIOutlined, MailOutlined, ApiOutlined, CheckSquareOutlined, WifiOutlined, DeleteOutlined, FileOutlined, StopOutlined,
    CaretRightOutlined, AppstoreOutlined, HomeOutlined, PictureOutlined, ArrowLeftOutlined, FullscreenOutlined, EditOutlined, FontSizeOutlined, ReloadOutlined,
    GlobalOutlined
} from "@ant-design/icons";
import Icon from '@ant-design/icons';
import {
    stopSvg, table, cmd, database_backup, mobile_info, tfa, bracket, pause, question_circle, coding, loop, comment,
    gui_random, variable, SpreadSheet, dice, write_file, read_file,
    installApp, attribute, cube, swap, mobile_vibrate, mobile_action, clipboard, keyboard, mobile_property,
    image_search
} from '../asset/index';
import ReactDOM from 'react-dom/client';
import { Switch, Modal, Tabs, Input, Radio } from "antd";



const labelIconMapping = {
    'press back': <ArrowLeftOutlined />,
    'press home': <HomeOutlined />,
    'press menu': <AppstoreOutlined />,
    'start app': <CaretRightOutlined />,
    'stop app': <Icon component={stopSvg} />,
    'install app': <Icon component={installApp} style={{ fill: 'white' }} />,
    'uninstall app': <DeleteOutlined />,
    'is installed app': <Icon component={cube} />,
    'transfer file': <Icon component={swap} />,
    'device actions': <Icon component={mobile_vibrate} />,
    'toggle service': <WifiOutlined />,
    'check activity': <Icon component={mobile_action} />,
    'clipboard': <Icon component={clipboard} />,
    'touch': <FullscreenOutlined />,
    'swipe/scroll': <FullscreenOutlined />,
    'screen shot': <PictureOutlined />,
    'press key': <Icon component={keyboard} />,
    'type text': <FontSizeOutlined />,
    'update field': <EditOutlined />,
    'get property': <Icon component={mobile_property} />,
    'element exists': <CheckSquareOutlined />,
    'get attribute': <Icon component={attribute} />,
    'random': <Icon component={dice} />,
    'http': <ApiOutlined />,
    'read file/variable': <Icon component={read_file} />,
    'write file': <Icon component={write_file} />,
    'set variable': <Icon component={variable} />,
    'spreadsheet': <Icon component={SpreadSheet} />,
    'insert table': <Icon component={table} style={{ color: 'white' }} />,
    'open ai': <OpenAIOutlined />,
    'case path': <Icon component={gui_random} />,
    'regexp': <Icon component={bracket} />,
    'imap': <MailOutlined />,
    'generate 2fa': <Icon component={tfa} />,
    'cmd': <Icon component={cmd} />,
    'change info': <Icon component={mobile_info} />,
    'backup/restore': <Icon component={database_backup} />,
    'check network': <GlobalOutlined />,
    'adb shell command': <Icon component={image_search} />,
    'image search': <Icon component={cmd} />,
    'sleep': <Icon component={pause} />,
    'if': <Icon component={question_circle} />,
    'javascript': <Icon component={coding} />,
    'loop': <Icon component={loop} />,
    'loop V2': <Icon component={loop} />,
    'break': <ApiOutlined />,
    'comment': <Icon component={comment} />,
    'file': <FileOutlined />,
    'stop': <StopOutlined />,
    'reconnect': <ReloadOutlined />,
};

const initialNodes = [
];

function getId() {
    return 'id-' + Math.random().toString(36).substr(2, 9);  // Tạo ID ngẫu nhiên
}


const DnDFlow = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    // background
    const [variant, setVariant] = useState('Lines');

    // update Node
    const [id, setId] = useState();

    // Hàm để lấy icon phù hợp với tên label
    const getIconForLabel = (label) => {
        return labelIconMapping[label.toLowerCase()] || labelIconMapping.default;
    };

    // Delete node
    const handleDelete = (id) => {
        setNodes((prevNodes) => {
            const filteredNodes = prevNodes.filter((nodes) => nodes.id !== id);
            return filteredNodes;
        });
        setId(null);
    };

    // Toggle Switch: Chuyển đổi trạng thái của node (active/inactive)
    const handleOffNode = (id, checked) => {
        setNodes((prevNodes) => {
            return prevNodes.map((node) => {
                if (node.id === id) {
                    // Chỉ đổi màu và trạng thái khi switch tắt
                    const updatedNode = {
                        ...node,
                        data: {
                            ...node.data,
                            isActive: checked, // Cập nhật trạng thái của Switch (checked là true khi bật, false khi tắt)
                        },
                        style: {
                            ...node.style,
                            background: checked ? 'rgb(92,175,225)' : 'rgb(192,192,192)', // Đổi màu thành xám khi switch tắt
                        },
                    };
                    return updatedNode;
                }
                return node;
            });
        });
    };

    const onConnect = useCallback((params) => {
        setEdges((eds) => addEdge({
            ...params,
            style: {
                stroke: 'rgb(62,255,192)', // Màu đường nối
                strokeWidth: 2, // Độ dày của đường nối
                strokeDasharray: '5,5', // Nét đứt
            },
            markerEnd: { type: 'arrowclosed' },
        }, eds));
    }, []);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const CustomPressHomeNode = ({ data, id }) => (
        <div style={{ ...data.style }}>
            {data.label}
            <>
                <Handle
                    type="source"
                    position="right"
                    id={`${data.id}-success2`}
                    style={{
                        background: 'rgb(62,255,192)',
                        top: '33%',
                        width: '5px',
                        height: '5px',
                    }}
                />
                <Handle
                    type="target"
                    position="right"
                    id={`${data.id}-error`}
                    style={{
                        background: 'red',
                        top: '66%',
                        width: '5px',
                        height: '5px',
                    }}
                />
                <Handle
                    type="target"
                    position="left"
                    id={`${data.id}-success1`}
                    style={{
                        background: 'rgb(62,255,192)',
                        top: '50%',
                        width: '5px',
                        height: '5px',
                    }}
                />
            </>

            <div className="hidden-btn">
                <div
                    onClick={() => handleDelete(id)}
                    className="delete-btn"
                >
                    <DeleteOutlined />
                </div>
                <div
                    className="play-btn"
                >
                    <CaretRightOutlined />
                </div>
                <Switch
                    onChange={(checked) => handleOffNode(id, checked)} // Cập nhật trạng thái khi switch thay đổi
                    size='small' className="switch-btn" defaultChecked />
            </div>
        </div>
    );

    const nodeTypes = useMemo(() => ({
        CustomPressHomeNode,
    }), []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            const icon = getIconForLabel(type); // Ánh xạ icon cho loại node

            const newNode = {
                id: getId(),
                type: 'CustomPressHomeNode',
                position,
                data: {
                    label: <>{icon} {type}</>,
                    isActive: true, // Thiết lập mặc định là active (bật switch)
                },
                className: "node-container",
                style: {
                    background: 'rgb(92,175,225)', // Màu mặc định của node
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance]
    );


    // click node
    const onNodeClick = (e, val) => {
        setId(val.id);
        setIsModalOpen(true);
        setNodeData(val);
    };


    const itemsTab = [
        {
            key: '1',
            label: 'Option',
            children: [
                <span style={{ marginTop: '30px' }}>Package Name</span>,
                <Input placeholder="Package name or AppID" style={{ marginBottom: '30px' }} />,
                <span>Timeout open app (Default 180 seconds)</span>,
                <Input placeholder="180" style={{ marginBottom: '20px' }} />,
            ],
        },
        {
            key: '2',
            label: 'Setting',
            children: [
                <span style={{ marginTop: '30px' }}>Sleep time (seconds) before run this node (0 to disable)</span>,
                <Input placeholder="0" style={{ marginBottom: '30px' }} />,
                <span>Timeout (seconds) runtime for this node (0 to disable)</span>,
                <Input placeholder="30" style={{ marginBottom: '20px' }} />,
                <Radio.Group name="radiogroup" defaultValue={1}>,
                    <Radio value={1}>Succes node</Radio>,
                    <Radio value={2}>Fail node</Radio>,
                </Radio.Group>
            ],
        },
        {
            key: '3',
            label: 'Note',
            children: [
                <Input placeholder="" style={{ height: '100px' }} />,
            ],
        },
    ];



    // modal
    const [nodeData, setNodeData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOk = () => {
        setIsModalOpen(false); // Close the modal
    };

    const handleCancel = () => {
        setIsModalOpen(false); // Close the modal
    };

    const CustomModal = ({ data }) => {
        return (
            <Modal title={data ? data.data.label : "Loading..."} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                {/* Hiển thị tất cả thông tin của node */}
                {data ? (
                    <div style={{ height: '400px' }}>
                        <Tabs defaultActiveKey="1" items={itemsTab} />
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </Modal>
        );
    };

    // modal

    return (
        <div className="dndflow">
            <ReactFlowProvider>
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        onNodeClick={(e, val) => onNodeClick(e, val)}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        fitView
                    >
                        <Background color="gray" variant="variant" />
                        <Controls />
                    </ReactFlow>
                </div>
            </ReactFlowProvider>
            <CustomModal data={nodeData} />
        </div>
    );
};


const mountNode = document.getElementById('root');
ReactDOM.createRoot(mountNode).render(<DnDFlow />);
export default DnDFlow;
