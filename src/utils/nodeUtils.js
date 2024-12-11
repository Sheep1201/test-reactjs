import { applyNodeChanges } from 'reactflow';

// Hàm xử lý khi Node thay đổi (di chuyển, thêm, xóa)
export const handleNodesChange = (changes, setNodes) => {
  setNodes((nds) => applyNodeChanges(changes, nds));
};

// Xóa Node và Edge được chọn khi nhấn phím Delete
export const handleKeyDown = (event, setNodes, setEdges) => {
  if (event.key === 'Delete') {
    // Xóa các Node được chọn
    setNodes((nds) => nds.filter((node) => !node.selected));

    // Xóa các Edge được chọn
    setEdges((eds) => eds.filter((edge) => !edge.selected));
  }
};