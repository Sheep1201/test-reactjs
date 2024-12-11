import React, { useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, getEdgeCenter, useReactFlow, getMarkerEnd } from 'reactflow';

const CustomEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
}) => {
    const { setEdges } = useReactFlow();
    const [isHovered, setIsHovered] = useState(false);

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            <path
                id={id}
                style={style}
                className="react-flow__edge-path"
                d={edgePath}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            />
            <EdgeLabelRenderer>
                <button
                    style={{
                        position: "absolute",
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: "all",
                        cursor: "pointer",
                        opacity: isHovered ? 1 : 0, // Ẩn hoặc hiển thị nút button dựa trên trạng thái isHovered
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(200, 0, 0, 0.15)',
                        color: 'red',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onMouseEnter={() => setIsHovered(true)} // Khi di chuột vào
                    onMouseLeave={() => setIsHovered(false)} // Khi di chuột ra
                    onClick={() => {
                        setEdges((es) => es?.filter((e) => e?.id !== id));
                    }}
                >
                    X
                </button>
            </EdgeLabelRenderer>
        </>
    );
};

export default CustomEdge;