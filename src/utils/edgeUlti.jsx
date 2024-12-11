import { addEdge, applyEdgeChanges } from 'reactflow';

// Kiểm tra tính hợp lệ của kết nối
export const isValidConnection = (connection, edges) => {
    // Kiểm tra xem sourceHandle đã có kết nối chưa
    const isHandleAlreadyConnected = edges.some(
        (edge) =>
            edge.source === connection.source && edge.sourceHandle === connection.sourceHandle
    );
    return !isHandleAlreadyConnected; // Chỉ hợp lệ nếu Handle cụ thể chưa có kết nối
};

// Thêm Edge mới khi kết nối
export const handleConnect = (connection, edges, setEdges, isEdgeAnimated) => {
    
    if (isValidConnection(connection, edges)) {
        const edgeColor = connection.sourceHandle === 'false' ? 'lightcoral' : 'lightgreen';
        setEdges((eds) => addEdge({
            ...connection,
            animated: isEdgeAnimated,
            style: { stroke: edgeColor, strokeWidth: 2 },
            type: 'custom',
        }, eds));

    }
};

// Xóa Edge khi click vào X
export const handleEdgeClick = (id, setEdges) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== id));
};

// Xử lý khi Edge thay đổi
export const handleEdgesChange = (changes, setEdges) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
};

// Hàm xử lý sự kiện kéo thả
export const onDragOverHandler = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
};
