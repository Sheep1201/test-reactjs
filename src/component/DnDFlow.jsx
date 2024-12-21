import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, { Handle, ReactFlowProvider, useNodesState, useEdgesState, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import './style.css';
import {
    OpenAIOutlined, MailOutlined, ApiOutlined, CheckSquareOutlined, WifiOutlined, DeleteOutlined, FileOutlined, StopOutlined, GlobalOutlined,
    CaretRightOutlined, AppstoreOutlined, HomeOutlined, PictureOutlined, ArrowLeftOutlined, FullscreenOutlined, EditOutlined, FontSizeOutlined, ReloadOutlined,
} from "@ant-design/icons";
import Icon from '@ant-design/icons';
import {
    stopSvg, table, cmd, database_backup, mobile_info, tfa, bracket, pause, question_circle, coding, loop, comment,
    gui_random, variable, SpreadSheet, dice, write_file, read_file,
    installApp, attribute, cube, swap, mobile_vibrate, mobile_action, clipboard, keyboard, mobile_property,
    image_search
} from '../asset/index';
import ReactDOM from 'react-dom/client';
import { Switch, Modal, Tabs, Input, Radio, Popover, Button } from "antd";
import { StartNode as StartNodeCustom, CustomContextMenu, CustomHandleVariablesNode } from './StartNode';

import StopNodeCustom from './StopNode'
import { handleConnect, handleEdgeClick, handleEdgesChange, onDragOverHandler } from '../utils/edgeUlti';
import { saveFlow, loadFlow } from '../utils/flowUtils';
import CustomEdge from './EdgeCustom';
import LogPanel from './LogPanel';

const content = (
    <div>
        <Button style={{ width: '100%' }}>Device_ID</Button>
    </div>
);

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
    {
        id: '1',
        type: 'startNode',
        data: { label: 'Start' },
        position: { x: 630, y: 400 },
    },
    {
        id: '2',
        type: 'contextMenu',
        data: { title: 'Context Menu', menus: ['New menu', 'New menu', 'New menu', 'New menu'] },
        position: { x: 600, y: 200 },
    },
    {
        id: '3',
        type: 'CustomHandleVariablesNode',
        data: { label: '{x} Variables' },
        position: { x: 600, y: 550 },
        style: {
            backgroundColor: '#efa01f',
            padding: '10px',
            borderRadius: '2px',
            color: 'white',
            border: 'none',
            boxShadow:
                '0 4px 6px rgba(239,160,31,0.2), 0 -4px 6px rgba(239,160,31,0.2), 4px 0 6px rgba(239,160,31,0.2), -4px 0 6px rgba(239,160,31,0.2)',
        },
    },
];


const DnDFlow = ({ isPanelVisible, setIsPanelVisible, isDebugVisible, isProcessing, onProcessEnd }) => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [variables, setVariables] = useState([
        {
            id: `1`,
            name: 'a',
            value: 0,
            default: 0,
        },
        {
            id: `2`,
            name: 'b',
            value: 0,
            default: 0,
        },
    ]);
    const capitalizeLabel = (label) => {
        return label
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    function getId() {
        return 'id-' + Math.random().toString(36).substr(2, 9);  // Tạo ID ngẫu nhiên
    }

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

    const onDragOver = useCallback(onDragOverHandler, []);

    const isEdgeAnimated = true; // Ví dụ: giá trị này có thể là cố định hoặc từ trạng thái

    // Xử lý sự thay đổi của các Edge
    const onEdgesChange = useCallback(
        (changes) => handleEdgesChange(changes, setEdges),
        [setEdges]
    );

    // Xử lý khi click vào Edge (xóa)
    const onEdgeClick = useCallback(
        (event, edge) => {
            event.stopPropagation();
            handleEdgeClick(edge.id, setEdges);
        },
        [setEdges]
    );

    const handleColorChange = (id) => {
        setNodes((prevNodes) => {
            return prevNodes.map((node) => {
                if (node.id === id) {
                    const isRed = node.data.color === 'red'; // Kiểm tra màu hiện tại
                    const updatedNode = {
                        ...node,
                        data: {
                            ...node.data,
                            color: isRed ? 'gray' : 'red', // Đổi màu giữa red và gray
                        },
                    };
                    return updatedNode;
                }
                return node;
            });
        });
    };


    const handleCheckPointClick = (nodeId) => {
        setNodes((prevNodes) => {
            return prevNodes.map((node) => {
                if (node.id === nodeId) {
                    const updatedNode = {
                        ...node,
                        data: {
                            ...node.data,
                            checkPoint: !node.data.checkPoint, // Đổi trạng thái checkPoint
                        },
                    };
                    return updatedNode;
                }
                return node;
            });
        });
    };


    const CustomNodes = ({ data, id }) => (
        <div style={{ ...data.style }}>
            {data.label}
            <>
                <Handle
                    type="source"
                    position="right"
                    id="true"
                    style={{
                        background: 'rgb(62,255,192)',
                        top: '30%',
                        width: '7px',
                        height: '7px',
                    }}
                />
                <Handle
                    type="source"
                    position="right"
                    id="false"
                    style={{
                        background: 'red',
                        top: '70%',
                        width: '7px',
                        height: '7px',
                    }}
                />
                <Handle
                    type="target"
                    position="left"
                    style={{
                        background: 'rgb(62,255,192)',
                        top: '50%',
                        width: '7px',
                        height: '7px',
                    }}
                />
            </>
            <div className="hidden-btn">
                <div
                    onClick={(e) => {
                        e.stopPropagation(); // Ngăn sự kiện click lan đến node
                        handleDelete(id);
                    }}
                    className="delete-btn"
                >
                    <DeleteOutlined />
                </div>
                <div
                    className="play-btn"
                    onClick={(e) => {
                        e.stopPropagation(); // Ngăn sự kiện click lan đến node
                        console.log('Play button clicked!');
                    }}
                >
                    <CaretRightOutlined />
                </div>
                <div className="switch-btn"
                    onClick={(e) => {
                        e.stopPropagation(); // Ngăn sự kiện click lan truyền đến node cha
                    }}
                >
                    <Switch
                        onChange={(checked) => {
                            handleOffNode(id, checked); // Thay đổi trạng thái
                        }}
                        size="small"
                        defaultChecked
                    />
                </div>
            </div>
            {isDebugVisible && (
                <div className="checkPoint-btn" onClick={(e) => e.stopPropagation()}>
                    <div
                        className="checkPoint-circle"
                        style={{ backgroundColor: data.color || 'gray' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleColorChange(id); // Đổi màu khi click
                            handleCheckPointClick(id);
                        }}
                    />
                    <div
                        className="checkPoint-circle2"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleColorChange(id);
                            handleCheckPointClick(id);
                        }}
                    />
                </div>
            )}
        </div>
    );

    const nodeTypes = useMemo(() => ({
        CustomNodes,
        StartNodeCustom: StartNodeCustom,
        CustomContextMenu: CustomContextMenu,
        CustomHandleVariablesNode: CustomHandleVariablesNode,
        StopNodeCustom: StopNodeCustom,
    }), [isDebugVisible]);
    initialNodes[0].type = 'StartNodeCustom';
    initialNodes[1].type = 'CustomContextMenu';
    initialNodes[2].type = 'CustomHandleVariablesNode';
    const edgeTypes = { custom: CustomEdge };


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

            const icon = type.toLowerCase() === 'stop' ? null : getIconForLabel(type); // Ánh xạ icon cho loại node

            const newNode = {
                id: getId(),
                type: type.toLowerCase() === 'stop' ? 'StopNodeCustom' : 'CustomNodes',
                position,
                data: {
                    label: <>{icon} {capitalizeLabel(type)}</>, // Áp dụng hàm capitalizeLabel
                    isActive: true, // Thiết lập mặc định là active (bật switch)
                    checkPoint: false,
                },
                className: "node-container",
                ...(type.toLowerCase() !== 'stop' && {
                    style: {
                        background: 'rgb(92,175,225)', // Màu mặc định của node
                        color: 'white',
                        borderRadius: '2px', // Bo tròn góc của node
                        padding: '10px',
                    },
                }),
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
        if (e.target.classList.contains("delete-btn") ||
            e.target.classList.contains("play-btn") ||
            e.target.classList.contains("switch-btn")) {
            return;
        }
    };


    const itemsTab = [
        {
            key: '1',
            label: 'Option',
            children: [
                <span style={{ marginTop: '30px' }}>Package Name</span>,
                <div style={{ position: 'relative' }}>
                    <Input
                        placeholder="Package name or AppID"
                        style={{ marginBottom: '30px', zIndex: 1, height: '40px', boxShadow: 'none' }}
                    />
                    <Popover content={content} title="Variables" trigger="hover" className='x-btn'>
                        <div>{"{X}"}</div>
                    </Popover>
                </div>,
                <span>Timeout open app (Default 180 seconds)</span>,
                <div style={{ position: 'relative' }}>
                    <Input
                        placeholder="180"
                        style={{ marginBottom: '30px', zIndex: 1, height: '40px', boxShadow: 'none' }}
                    />
                    <Popover content={content} title="Variables" trigger="hover" className='x-btn'>
                        <div>{"{X}"}</div>
                    </Popover>
                </div>,
            ],
        },
        {
            key: '2',
            label: 'Setting',
            children: [
                <span style={{ marginTop: '30px' }}>Sleep time (seconds) before run this node (0 to disable)</span>,
                <div style={{ position: 'relative' }}>
                    <Input
                        placeholder="0"
                        style={{ marginBottom: '30px', zIndex: 1, height: '40px', boxShadow: 'none' }}
                    />
                    <Popover content={content} title="Variables" trigger="hover" className='x-btn'>
                        <div>{"{X}"}</div>
                    </Popover>
                </div>,
                <span>Timeout (seconds) runtime for this node (0 to disable)</span>,
                <div style={{ position: 'relative' }}>
                    <Input
                        placeholder="30"
                        style={{ marginBottom: '30px', zIndex: 1, height: '40px', boxShadow: 'none' }}
                    />
                    <Popover content={content} title="Variables" trigger="hover" className='x-btn'>
                        <div>{"{X}"}</div>
                    </Popover>
                </div>,
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
                <Input placeholder="" style={{ height: '100px', boxShadow: 'none' }} />,
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


    const handleProcessEnd = (result) => {
        console.log('Quá trình kết thúc:', result);
        if (onProcessEnd) {
            onProcessEnd(result); // Gọi callback để truyền dữ liệu lên component cha
        }
    };

    return (
        <div className="dndflow">
            <ReactFlowProvider>
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        onNodeClick={(e, val) => onNodeClick(e, val)}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={(connection) => handleConnect(connection, edges, setEdges, isEdgeAnimated)}
                        onEdgeClick={onEdgeClick}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                    >
                        <Background color="gray" variant="lines" gap={16} style={{ opacity: 0.2 }} />
                        <Controls />
                    </ReactFlow>
                </div>
            </ReactFlowProvider>
            <CustomModal data={nodeData} />
            <LogPanel
                nodes={nodes}
                setNodes={setNodes}
                edges={edges}
                setEdges={setEdges}
                variables={variables}
                setVariables={setVariables}
                isPanelVisible={isPanelVisible}
                isDebugVisible={isDebugVisible}
                setIsPanelVisible={setIsPanelVisible}
                isProcessing={isProcessing}
                onProcessEnd={handleProcessEnd}
            />
        </div>
    );
};


const mountNode = document.getElementById('root');
ReactDOM.createRoot(mountNode).render(<DnDFlow />);
export default DnDFlow;