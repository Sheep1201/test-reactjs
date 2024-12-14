import { Button, Col, Input } from 'antd';
import React, { useRef, useEffect, useState } from 'react';
import { CloseOutlined } from "@ant-design/icons"

const LogPanel = ({
    nodes,
    setNodes,
    edges,
    variables,
    setVariables,
    isPanelVisible,
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
            }

            return newVariables;
        });

        return result;
    };

    const [iconList, setIconList] = useState([]);

    const startProcess = async () => {
        const startTime = Date.now();
        let totalDurationMs = 0;
        const initialIcon = (
            <>
                <div
                    style={{
                        display: 'inline-block',
                        position: 'relative',
                        zIndex: 1, // Icon nằm trên đường nối
                        borderRadius: '50%',  // Hình tròn
                        border: '3px solid rgb(38,170,87)',  // Viền màu đen
                        width: '10px',  // Kích thước vòng tròn
                        height: '10px', // Kích thước vòng tròn
                        bottom: '1px'
                    }}
                />
            </>
        );

        // Đặt icon vào danh sách
        setIconList([initialIcon]);
        setLogMessages([
            `<span style="color: green;">[Success]</span> - Start | 0ms`
        ]);
        isProcessing.current = true;
        setVariables((prevVars) =>
            prevVars.map((v) => ({ ...v, value: v.default }))
        );

        let currentNodeId = '1';
        while (currentNodeId) {
            if (!isProcessing.current) break;

            const nodeToProcess = currentNodeId;
            const currentNode = nodes.find((node) => node.id === nodeToProcess);

            if (!currentNode) break;

            if (currentNode.type === 'StartNodeCustom') {
                currentNodeId = findNextNodeId(nodeToProcess);
                continue;
            }

            if (currentNode.type === 'stop') break;

            // Đánh dấu thời gian bắt đầu xử lý node
            const startTime = Date.now();

            highlightNode(nodeToProcess);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const result = processLogic(currentNode, setVariables);
            resetNode(nodeToProcess);
            currentNodeId = findNextNodeId(nodeToProcess, result);

            // Đánh dấu thời gian kết thúc xử lý node
            const endTimeNode = Date.now();
            const durationMs = endTimeNode - startTime; // Tính thời gian xử lý

            // Icon
            const nodeIcon = currentNode.data.label?.props?.children?.[0];
            if (React.isValidElement(nodeIcon)) {
                // Kiểm tra giá trị của result và xác định màu sắc cho icon
                const iconColor = result === 'true' ? 'rgb(38,170,87)' : 'rgb(216, 35, 35)';

                // Thêm màu sắc vào icon, tạo một bản sao của icon với màu sắc đã thay đổi
                const coloredIcon = React.cloneElement(nodeIcon, {
                    style: { color: iconColor }
                });

                // Cập nhật danh sách icon với icon đã thay đổi màu sắc
                setIconList((prevIcons) => [...prevIcons, coloredIcon]);
            }


            // Cập nhật logMessages ngay lập tức sau mỗi bước xử lý
            setLogMessages((prevLogs) => {
                const label = currentNode.data.label?.props?.children?.[2] || 'undefined';

                const successMessage = `<span style="color: green;">[Success]</span> - ${label} | ${durationMs}ms`;
                const failedMessage = `<span style="color: red;">[Failed] </span> - ${label} | ${durationMs}ms<br/> Error: ${label} not found`;
                if (result === 'true') {
                    return [...prevLogs, successMessage];
                }
                if (result === 'false') {
                    return [...prevLogs, failedMessage];
                }
            });
        }

        isProcessing.current = false;
        if (onProcessEnd) {
            onProcessEnd({ success: true }); // Gửi trạng thái về
        }

        const endTime = Date.now();
        totalDurationMs = endTime - startTime;
        const durationSec = (totalDurationMs / 1000).toFixed(1);
        const displayDuration = (parseFloat(durationSec) % 1 === 0) ? `${parseInt(durationSec)}s` : `${durationSec}s`;
        // Cập nhật logMessages khi quá trình kết thúc
        setLogMessages((prevLogs) => [
            ...prevLogs,
            `<span style="color: blue;">[Info] </span> - No success not found. Script stopped. <br/>Script running for ${displayDuration}`
        ]);
    };

    const stopProcess = () => {
        isProcessing.current = false;
        if (onProcessEnd) {
            onProcessEnd({ success: false }); // Gửi trạng thái khi dừng
        }
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
                <span style={{ fontSize: '20px' }}>Log</span>
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
