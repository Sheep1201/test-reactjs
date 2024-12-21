import { Button, Col, Input } from 'antd';
import React, { useRef, useEffect, useState } from 'react';
import { CloseOutlined, PauseCircleOutlined, RightCircleOutlined } from "@ant-design/icons"
import Icon from '@ant-design/icons';
import { stopSvg } from '../asset/index';

const LogPanel = ({
    nodes,
    setNodes,
    edges,
    variables,
    setVariables,
    isPanelVisible,
    isDebugVisible,
    setIsPanelVisible,
    isProcessing: isProcessingProp,
    onProcessEnd,
}) => {
    const isProcessing = useRef(isProcessingProp);
    const [logMessages, setLogMessages] = useState([]); // Thêm state để lưu trữ log
    const logFileRef = useRef(null); // Tham chiếu đến div logFile
    // Đồng bộ giá trị `isProcessingProp` với ref
    useEffect(() => {
        isProcessing.current = isProcessingProp;
    }, [isProcessingProp]);

    const highlightNode = (nodeId) => {
        setNodes((nds = []) =>
            nds.map((node) =>
                node.id === nodeId
                    ? { ...node, style: { ...node.style, boxShadow: '0 0 10px 0.2px yellow' } }
                    : node
            )
        );
    };

    const resetNode = (nodeId) => {
        setNodes((nds = []) =>
            nds.map((node) =>
                node.id === nodeId
                    ? { ...node, style: { ...node.style, boxShadow: 'none' } }
                    : node
            )
        );
    };

    const findNextNodeId = (currentNodeId, result) => {
        const edge = edges.find(
            (e) =>
                e.source === currentNodeId &&
                (e.sourceHandle === result || e.sourceHandle === null)
        );
        return edge ? edge.target : null;
    };

    const processLogic = (node, updateVariables) => {
        let result = 'true';

        updateVariables((prevVars) => {
            const newVariables = [...prevVars];

            switch (node.type) {
                case 'StartNodeCustom':
                    break;
                case 'stop':
                    break;
                case 'CustomNodes':
                    const a = newVariables.find((v) => v.name === 'a');
                    const b = newVariables.find((v) => v.name === 'b');
                    a.value += 1;
                    b.value += 2;
                    result = a.value % 2 === 0 ? 'true' : 'false';
                    break;
                default:
                    console.warn(`Unhandled node type: ${node.type}`);
                    break;
            }

            return newVariables;
        });

        return result;
    };

    const [iconList, setIconList] = useState([]);
    const isDebugResume = useRef(false);
    const isDebugNext = useRef(0);//0-khonog su dung, 1-dung lai, 2-chay tiep

    const startProcess = async () => {
        isProcessing.current = true;
        isDebugResume.current = false;
        isDebugNext.current = 0;

        setLogMessages([]);
        setIconList([]);
        const startTime = Date.now();
        let totalDurationMs = 0;
        const initialIcon = (
            <div
                style={{
                    display: 'inline-block',
                    position: 'relative',
                    zIndex: 1,
                    borderRadius: '50%',
                    border: '3px solid rgb(38,170,87)',
                    width: '10px',
                    height: '10px',
                    bottom: '1px',
                }}
            />
        );

        setIconList([initialIcon]);
        setLogMessages([
            `<span style="color: green;">[Success]</span> - Start | 0ms`,
        ]);
        isProcessing.current = true;
        setVariables((prevVars) =>
            prevVars.map((v) => ({ ...v, value: v.default }))
        );

        let currentNodeId = '1';
        while (currentNodeId) {
            const nodeId = currentNodeId; // Lưu giá trị cục bộ
            if (!isProcessing.current) break;
            const currentNode = nodes.find((node) => node.id === nodeId);
            if (!currentNode) break;

            if (isDebugNext.current === 1) {
                highlightNode(currentNodeId);
                isDebugNext.current = 1;
                const nodeId = currentNodeId; // Lưu giá trị cục bộ
                // Chờ đến khi người dùng tiếp tục
                await new Promise((resolve) => {
                    const interval = setInterval(() => {
                        if (isDebugNext.current === 2) { // `isDebugResume` được kiểm tra từ `useState`
                            isDebugNext.current = 1;
                            clearInterval(interval);
                            resetNode(nodeId); // Reset highlight khi checkpoint kết thúc
                            resolve();
                        }
                        if (isDebugResume.current) { // `isDebugResume` được kiểm tra từ `useState`
                            clearInterval(interval);
                            resetNode(nodeId); // Reset highlight khi checkpoint kết thúc
                            resolve();
                        }
                    }, 500);
                });
            }

            // Nếu checkpoint là true, tạm dừng quá trình xử lý
            if (currentNode.data.checkPoint) {
                // Cập nhật checkpoint ngay khi tạm dừng
                isDebugResume.current = false;
                isDebugNext.current = 1;
                const nodeId = currentNodeId; // Lưu giá trị cục bộ
                highlightNode(currentNodeId);

                // Chờ người dùng tiếp tục
                await new Promise((resolve) => {
                    const interval = setInterval(() => {
                        if (isDebugResume.current) {
                            isDebugNext.current = 0;
                            clearInterval(interval);
                            resetNode(nodeId);
                            resolve();
                        }
                        if (isDebugNext.current === 2) {
                            isDebugNext.current = 1;
                            isDebugResume.current = false;
                            clearInterval(interval);
                            resetNode(nodeId);
                            resolve();
                        }
                    }, 500);
                });
            }


            if (currentNode.type === 'StartNodeCustom') {
                currentNodeId = findNextNodeId(currentNodeId);
                continue;
            }

            if (currentNode.type === 'stop') break;

            const startTimeNode = Date.now();

            highlightNode(currentNodeId);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const result = processLogic(currentNode, setVariables);
            resetNode(currentNodeId);
            currentNodeId = findNextNodeId(currentNodeId, result);

            const endTimeNode = Date.now();
            const durationMs = endTimeNode - startTimeNode;

            const nodeIcon = currentNode.data.label?.props?.children?.[0];
            if (React.isValidElement(nodeIcon)) {
                const iconColor = result === 'true' ? 'rgb(38,170,87)' : 'rgb(216, 35, 35)';
                const coloredIcon = React.cloneElement(nodeIcon, {
                    style: { color: iconColor },
                });
                setIconList((prevIcons) => [...prevIcons, coloredIcon]);
            }

            setLogMessages((prevLogs) => {
                const label = currentNode.data.label?.props?.children?.[2] || 'undefined';
                const successMessage = `<span style="color: green;">[Success]</span> - ${label} | ${durationMs}ms`;
                const failedMessage = `<span style="color: red;">[Failed]</span> - ${label} | ${durationMs}ms<br/> Error: ${label} not found`;
                if (result === 'true') return [...prevLogs, successMessage];
                if (result === 'false') return [...prevLogs, failedMessage];
                return prevLogs;
            });
            // Log trạng thái isDebugResume và isDebugNext
            console.log(`Node: ${currentNode.data.label?.props?.children?.[2]}, isDebugResume: ${isDebugResume.current}, isDebugNext: ${isDebugNext.current}, checkpoint: ${currentNode.data.checkPoint}`);
        }

        isProcessing.current = false;
        if (onProcessEnd) {
            onProcessEnd({ success: true });
        }

        const endTime = Date.now();
        totalDurationMs = endTime - startTime;
        const durationSec = (totalDurationMs / 1000).toFixed(1);
        const displayDuration =
            parseFloat(durationSec) % 1 === 0
                ? `${parseInt(durationSec)}s`
                : `${durationSec}s`;
        setLogMessages((prevLogs) => [
            ...prevLogs,
            `<span style="color: blue;">[Info]</span> - No success not found. Script stopped. <br/>Script running for ${displayDuration}`,
        ]);
    };

    const stopProcess = () => {
        nodes.forEach((node) => {
            if (node) {
                resetNode(node.id);
                isDebugNext.current = 0;
                isDebugResume.current = false;
            }
        });
        if (onProcessEnd) {
            onProcessEnd({ success: false });
        }
        isProcessing.current = false;
    };

    const handleResume = () => {
        isDebugResume.current = true;
        isDebugNext.current = 0;
    };

    const handleNext = async () => {
        isDebugNext.current = 0 ? 1 : 2;
    };


    useEffect(() => {
        if (!variables || variables.length === 0) {
            setVariables([
                { id: 1, name: 'a', value: 0, default: 0 },
                { id: 2, name: 'b', value: 0, default: 0 },
            ]);
        }
    }, [variables, setVariables]);

    useEffect(() => {
        if (isProcessing.current) {
            startProcess();
        } else {
            stopProcess();
        }
    }, [isProcessingProp]);

    // Scroll xuống dưới cùng khi có log mới
    useEffect(() => {
        if (logFileRef.current) {
            logFileRef.current.scrollTop = logFileRef.current.scrollHeight;
        }
    }, [logMessages]); // Theo dõi sự thay đổi của logMessages

    return (
        <div
            style={{
                position: 'absolute',
                bottom: 30,
                left: '58%',
                transform: 'translateX(-50%)',
                width: '75%',
                backgroundColor: 'white',
                zIndex: 1000,
                overflow: 'hidden',
                height: isPanelVisible ? '300px' : '0px',
                transition: 'height 0.5s ease, padding 0.5s ease',
                padding: isPanelVisible ? '10px' : '0',
                boxShadow: isPanelVisible ? '0px 2px 5px rgba(0, 0, 0, 0.2)' : 'none',
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '50px', alignItems: 'center' }}>
                    <span style={{ fontSize: '20px' }}>Log</span>
                    {isDebugVisible && isProcessing.current && (
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center', height: '30px' }}>
                            <Button
                                style={{ backgroundColor: 'rgb(4,140,242)', color: 'white' }}
                                onClick={() => handleResume()}
                                disabled={isProcessing.current && isDebugNext.current !== 1} // Disable khi đang chạy
                            >
                                <PauseCircleOutlined style={{ fontSize: '20px' }} />Resume
                            </Button>
                            <Button
                                style={{ backgroundColor: 'rgb(38,170,87)', color: 'white' }}
                                onClick={() => handleNext()}
                                disabled={isProcessing.current && isDebugNext.current !== 1} // Disable khi đang chạy
                            >
                                <RightCircleOutlined style={{ fontSize: '20px' }} />Next
                            </Button>
                            <Button style={{ color: 'red', borderColor: 'red' }} onClick={() => stopProcess()}>
                                <Icon component={stopSvg} style={{ fontSize: '15px' }} />Stop
                            </Button>
                        </div>
                    )}
                </div>
                <Button style={{ border: 'none', height: '30px', fontSize: '25px', padding: '10px', borderRadius: '50%' }} onClick={() => setIsPanelVisible(false)}><CloseOutlined /></Button>
            </div>
            <hr style={{ opacity: 0.3 }} />
            <div style={{ display: 'flex', flex: 1, flexDirection: 'row', height: '100%', gap: '15px' }}>
                <Col style={{ height: '90%', width: '70%', marginLeft: '10px' }}>
                    <div className='logFile'
                        ref={logFileRef} style={{ display: 'flex', height: '20%', alignItems: 'center', padding: '10px', overflowX: "auto", scrollbarWidth: 'thin' }}>
                        {iconList.length > 0 &&
                            iconList.map((icon, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'inline-block',
                                        position: 'relative',
                                        zIndex: 2, // Icon nằm trên đường nối
                                        marginRight: '60px',
                                        fontSize: '20px',
                                        backgroundColor: 'white',
                                    }}
                                >
                                    {/* Đường nối phía trái cho icon đầu tiên */}
                                    {index === 1 && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '-60%',
                                                width: '10px', // Đảm bảo kéo dài đủ cho khoảng cách
                                                height: '1px',
                                                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu sắc của đường nối
                                                zIndex: -1, // Đảm bảo đường nối nằm dưới icon
                                                transform: 'translateY(-50%)', // Canh chỉnh đường nối vào giữa
                                            }}
                                        />
                                    )}

                                    {/* Đường nối phía phải cho các icon */}
                                    {index !== iconList.length - 1 && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '100%',
                                                width: '300%', // Đảm bảo kéo dài đủ cho khoảng cách
                                                height: '1px',
                                                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu sắc của đường nối
                                                zIndex: 0, // Đảm bảo đường nối nằm dưới icon
                                                transform: 'translateY(-50%)', // Canh chỉnh đường nối vào giữa
                                            }}
                                        />
                                    )}

                                    {icon}
                                </div>
                            ))
                        }

                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '40%', border: '1px solid rgba(0, 0, 0, 0.2)', padding: '20px' }}>
                        <h2 style={{ marginTop: '0px' }}>Variables State</h2>
                        <span>DEVICE_ID</span>
                        <Input
                            value={variables
                                .map((v) => `${v.name}: ${v.value}`)
                                .join(', ')}
                            style={{ zIndex: 1, height: '40px', width: '300px', boxShadow: 'none' }}
                        />
                    </div>
                </Col>
                <Col style={{ height: '90%', width: '30%', marginRight: '10px' }}>
                    <div
                        className='logFile'
                        ref={logFileRef} // Gắn ref cho div logFile
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '80%',
                            border: '1px solid rgba(0, 0, 0, 0.2)',
                            padding: '10px',
                            overflowY: 'auto', // Kích hoạt thanh cuộn khi nội dung vượt quá
                            scrollbarWidth: 'thin',
                            maxHeight: '100%' // Giới hạn chiều cao
                        }}
                    >
                        {/* Render các logMessages liên tục */}
                        {logMessages.map((message, index) => (
                            <div
                                key={index}
                                dangerouslySetInnerHTML={{ __html: message }} // Render HTML trực tiếp
                            ></div>
                        ))}
                    </div>
                </Col>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {(variables || []).map((v) => (
                    <li key={v.id}>
                        <strong>{v.name}</strong>: {v.value}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LogPanel;
