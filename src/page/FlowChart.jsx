import React from 'react';
import ReactFlow, { Background, Controls, Handle } from 'reactflow';
import 'reactflow/dist/style.css';
import { FaHome, FaArrowLeft } from 'react-icons/fa';



const nodes = [
    {
        id: '1',
        type: 'input',
        data: { label: 'Start' },
        position: { x: 10, y: 250 },
    },
    {
        id: '2',
        type: 'contextMenu',
        data: { title: 'Context Menu', menus: ['New menu', 'New menu', 'New menu', 'New menu'] },
        position: { x: 200, y: 0 },
    },
    {
        id: '3',
        data: {
            label: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaHome style={{ marginRight: '8px', fontSize: '16px' }} />
                    Press Home
                </div>
            )
        },
        position: { x: 200, y: 200 }, sourcePosition: 'right', targetPosition: 'left',
        style: {
            backgroundColor: '#6fb7ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', borderRadius: '2px', color: 'white', border: 'none', width: '100px', height: '40px', fontSize: '8px'
        },
    },
    {
        id: '4',
        data: {
            label: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaArrowLeft style={{ marginRight: '8px', fontSize: '16px' }} />
                    Press Back
                </div>
            )
        },
        position: { x: 400, y: 300 }, sourcePosition: 'right', targetPosition: 'left',
        style: {
            backgroundColor: '#6fb7ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', borderRadius: '2px', color: 'white', border: 'none', width: '100px', height: '40px', fontSize: '8px'
        },
    },
    {
        id: '5',
        type: 'CustomHandleVariablesNode',
        data: { label: '{x} Variables' },
        position: { x: 100, y: 350 },
        style: {
            backgroundColor: '#efa01f',
            padding: '10px',
            borderRadius: '2px',
            color: 'white',
            border: 'none',
            boxShadow:
                '0 4px 6px rgba(239,160,31,0.5), 0 -4px 6px rgba(239,160,31,0.5), 4px 0 6px rgba(239,160,31,0.5), -4px 0 6px rgba(239,160,31,0.5)',
        },
    },
];


const CustomPressHomeNode = ({ data }) => (
    <div style={{ ...data.style }}>
        {data.label}
        <Handle
            type="source"
            position="right"
            id="success2-right"
            style={{
                background: 'rgb(62,255,192)',
                top: '20%',
                width: '5px',
                height: '5px',
            }}
        />
        <Handle
            type="source"
            position="right"
            id="error2-right"
            style={{
                background: 'red',
                top: '80%',
                width: '5px',
                height: '5px',
            }}
        />
        <Handle
            type="target"
            position="left"
            id="success2-left"
            style={{
                background: 'rgb(62,255,192)',
                top: '50%',
                width: '5px',
                height: '5px',
            }}
        />
    </div>
);
const CustomPressBackNode3 = ({ data }) => (
    <div style={{ ...data.style }}>
        {data.label}
        <Handle
            type="source"
            position="right"
            id="success3-right"
            style={{
                background: 'rgb(62,255,192)',
                top: '20%',
                width: '5px',
                height: '5px',
            }}
        />
        <Handle
            type="source"
            position="right"
            id="error3-right"
            style={{
                background: 'red',
                top: '80%',
                width: '5px',
                height: '5px',
            }}
        />
        <Handle
            type="target"
            position="left"
            id="success3-left"
            style={{
                background: 'rgb(62,255,192)',
                top: '50%',
                width: '5px',
                height: '5px',
            }}
        />
    </div>
);
const CustomContextMenu = ({ data }) => {
    return (
        <div style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            backgroundColor: 'rgb(50,173,108)',
            textAlign: 'center',
            width: '100px',
            height: '140px',
            fontSize: '8px',
            color: 'white',
            position: 'relative', // Quan trọng để định vị Handle
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '5px',
                border: '1px solid white',
                borderRadius: '5px',
                backgroundColor: 'rgb(50,173,108)',
                color: 'white',
                height: '12px'
            }}>
                <span style={{ fontSize: '16px' }}>☰</span>
                <strong>{data.title}</strong>
            </div>
            <ul style={{ listStyleType: 'none', padding: 0, marginTop: '10px' }}>
                {data.menus.map((menu, index) => (
                    <li
                        key={index}
                        style={{
                            height: '12px',
                            margin: '5px 0',
                            padding: '5px',
                            backgroundColor: '#6fb7ff',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <span>{menu}</span>
                        <span style={{ fontSize: '12px', marginLeft: '5px', color: 'rgb(62,255,192)' }}>►</span>
                    </li>
                ))}
            </ul>
            {/* Thêm các Handle */}
            <Handle
                type="source"
                position="right"
                id="successMenu-1"
                style={{
                    background: 'rgb(62,255,192)',
                    top: '35%',
                    width: '5px',
                    height: '5px',
                }}
            />
            <Handle
                type="source"
                position="right"
                id="successMenu-2"
                style={{
                    background: 'rgb(62,255,192)',
                    top: '52%',
                    width: '5px',
                    height: '5px',
                }}
            />
            <Handle
                type="source"
                position="right"
                id="successMenu-3"
                style={{
                    background: 'rgb(62,255,192)',
                    top: '69%',
                    width: '5px',
                    height: '5px',
                }}
            />
            <Handle
                type="source"
                position="right"
                id="successMenu-4"
                style={{
                    background: 'rgb(62,255,192)',
                    top: '86%',
                    width: '5px',
                    height: '5px',
                }}
            />
        </div>
    );
};
const CustomHandleVariablesNode = ({ data }) => (
    <div
        style={{
            backgroundColor: '#efa01f',
            padding: '10px',
            borderRadius: '1px',
            color: 'white',
            border: 'none',
            boxShadow:
                '0 4px 6px rgba(239,160,31,0.5), 0 -4px 6px rgba(239,160,31,0.5), 4px 0 6px rgba(239,160,31,0.5), -4px 0 6px rgba(239,160,31,0.5)',
            textAlign: 'center',
        }}
    >
        {data.label}
    </div>
);
const CustomStartNode = ({ data }) => (
    <div style={{
        backgroundColor: 'rgb(50,173,108)',
        boxShadow: '0 4px 6px rgba(50,173,108,0.2), 0 -4px 6px rgba(50,173,108,0.2),  4px 0 6px rgba(50,173,108,0.2),  -4px 0 6px rgba(50,173,108,0.2)',
        padding: '20px',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        border: 'none',
        position: 'relative',
    }}>
        {data.label}
        <Handle
            type="source"
            position="right"
            id="Start-right-handle"
            style={{
                background: 'rgb(62,255,192)',
                width: '5px',
                height: '5px',
                right: '-5px',
                top: '50%',
                transform: 'translateY(-50%)',
            }}
        />
    </div>
);

const nodeTypes = {
    contextMenu: CustomContextMenu,
    handleNode2: CustomPressHomeNode,
    handleNode3: CustomPressBackNode3,
    CustomStartNode: CustomStartNode,
    CustomHandleVariablesNode: CustomHandleVariablesNode,
};
nodes[0].type = 'CustomStartNode';
nodes[2].type = 'handleNode2';
nodes[3].type = 'handleNode3';

const edges = [
    {
        id: 'e1-2',
        source: '1',
        sourceHandle: 'Start-right-handle',
        target: '3',
        targetHandle: 'success2-left',
        type: 'bezier',
        style: { stroke: 'rgb(62,255,192)', strokeWidth: 2 },
    },
    {
        id: 'e2-3',
        source: '3',
        sourceHandle: 'success2-right',
        target: '4',
        targetHandle: 'success3-left',
        type: 'bezier',
        style: { stroke: 'rgb(62,255,192)', strokeWidth: 2 },
    },
];

const FlowChart = () => {
    return (
        <div style={{ height: '100vh' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background />
                <Controls />
            </ReactFlow>

        </div>
    );
};

export default FlowChart;
