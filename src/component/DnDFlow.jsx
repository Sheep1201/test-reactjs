import React, { useState, useRef, useCallback, useMemo } from 'react';
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



const DnDFlow = ({ isPanelVisible }) => {
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
                        top: '33%',
                        width: '5px',
                        height: '5px',
                    }}
                />
                <Handle
                    type="source"
                    position="right"
                    id= "false"
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
        </div>
    );


    const nodeTypes = useMemo(() => ({
        CustomNodes,
        StartNodeCustom: StartNodeCustom,
        CustomContextMenu: CustomContextMenu,
        CustomHandleVariablesNode: CustomHandleVariablesNode,
        StopNodeCustom: StopNodeCustom,
    }), []);
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


    // Run node

    // Đổi màu Node hiện tại
    const highlightNode = (nodeId) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId
                    ? { ...node, style: { ...node.style, boxShadow: '0 0 10px 0.2px yellow',} }
                    : node
            )
        );
    };

    // Reset màu Node về mặc định
    const resetNode = (nodeId) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId
                    ? { ...node, style: { ...node.style, boxShadow: 'none' } }
                    : node
            )
        );
    };

    // Tìm Node tiếp theo dựa trên edges và sourceHandle
    const findNextNodeId = (currentNodeId, result) => {
        const edge = edges.find(
            (e) => {
                return e.source === currentNodeId && (e.sourceHandle === result || e.sourceHandle === null)
            }
        );
        console.log("Edges:", edges);
        console.log("Current Node ID:", currentNodeId, "Result:", result);
        return edge ? edge.target : null;
    };



    // Logic xác định success hoặc fail
    const processLogic = (node, updateVariables) => {
        let result = "true";

        updateVariables((prevVars) => {
            const newVariables = [...prevVars];

            switch (node.type) {
                case "StartNodeCustom":
                    console.log('type', node.type)
                    break;
                case "stop":
                    break;
                case "CustomNodes":
                    const a = newVariables.find((v) => v.name === "a");
                    const b = newVariables.find((v) => v.name === "b");

                    a.value += 1; // Tăng giá trị
                    b.value += 2;
            }

            return newVariables; // Trả về biến đã cập nhật
        });
        console.log("Process Logic Result:", result); // Debug
        return result;
    };

    const isProcessing = useRef(false);

    // Bắt đầu quy trình từ Node Start
    const startProcess = async () => {
        console.log("Start process");
        isProcessing.current = true; // Đặt trạng thái bắt đầu chạy
        // Reset variables về giá trị mặc định
        setVariables((prevVars) =>
            prevVars.map((v) => ({ ...v, value: v.default }))
        );

        let currentNodeId = '1'; // Node Start
        while (currentNodeId) {
            if (!isProcessing.current) {
                console.log("Process stopped by user.");
                break; // Thoát vòng lặp nếu dừng
            }

            const nodeToProcess = currentNodeId; // Giữ giá trị của currentNodeId tại vòng lặp hiện tại
            const currentNode = nodes.find((node) => node.id === nodeToProcess);

            if (!currentNode) {
                console.error(`Node with ID ${nodeToProcess} not found!`);
                break;
            }

            if (currentNode.type === 'StartNodeCustom') {
                currentNodeId = findNextNodeId(nodeToProcess);
                continue;
            }

            if (currentNode.type === 'stop') {
                break;
            }

            console.log(`Node ${currentNode.type}: running...`);
            highlightNode(nodeToProcess); // Đổi màu Node hiện tại

            await new Promise((resolve) => setTimeout(resolve, 1000)); // Chờ 1 giây

            // Logic xử lý kết quả
            const result = processLogic(currentNode, setVariables);


            resetNode(nodeToProcess); // Reset màu Node
            currentNodeId = findNextNodeId(nodeToProcess, result); // Tìm Node tiếp theo
        }

        isProcessing.current = false; // Kết thúc trạng thái đang chạy
        console.log("End process");
    };


    const stopProcess = () => {
        isProcessing.current = false; // Dừng quá trình
    }


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
            {/* Panel hiển thị Variables */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 30,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    backgroundColor: 'white',
                    zIndex: 1000,
                    overflow: 'hidden',
                    height: isPanelVisible ? '150px' : '0px',
                    transition: 'height 0.5s ease, padding 0.5s ease',
                    padding: isPanelVisible ? '10px' : '0',
                    boxShadow: isPanelVisible ? '0px 2px 5px rgba(0, 0, 0, 0.2)' : 'none',
                }}
            >
                <h4>Log</h4>
                <hr/>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {variables.map((v) => (
                        <li key={v.id}>
                            <strong>{v.name}</strong>: {v.value}
                        </li>
                    ))}
                </ul>
                <button
                    onClick={startProcess}
                    disabled={isProcessing.current} // Không cho phép nhấn nếu đang chạy
                    style={{
                        position: 'absolute',
                        zIndex: 10,
                        top: 130,
                        left: 10,
                        padding: '10px 20px',
                    }}
                >
                    Start Process
                </button>
                <button
                    onClick={stopProcess}
                    disabled={!isProcessing.current} // Không cho phép nhấn nếu không chạy
                    style={{
                        position: 'absolute',
                        zIndex: 10,
                        top: 130,
                        left: 150,
                        padding: '10px 20px',
                    }}
                >
                    Stop Process
                </button>
            </div>
        </div>
    );
};


const mountNode = document.getElementById('root');
ReactDOM.createRoot(mountNode).render(<DnDFlow />);
export default DnDFlow;