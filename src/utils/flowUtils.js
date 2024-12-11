// Lưu trạng thái flow vào localStorage
export const saveFlow = (nodes, edges) => {
  const flow = { nodes, edges };
  localStorage.setItem('flow', JSON.stringify(flow));
  console.log(JSON.stringify(flow));
  alert('Workflow saved!');
};

// Tải trạng thái flow từ localStorage
export const loadFlow = (setNodes, setEdges) => {
  const flow = JSON.parse(localStorage.getItem('flow'));
  if (flow) {
    setNodes(flow.nodes || []);
    setEdges(flow.edges || []);
  } else {
    alert('No saved workflow found!');
  }
};