import React from 'react';
import { Handle } from 'reactflow';

const StartNode = ({ data }) => {
    return (
        <div style={{
            backgroundColor: 'rgb(50,173,108)',
            boxShadow: '0 4px 6px rgba(50,173,108,0.1), 0 -4px 6px rgba(50,173,108,0.1),  4px 0 6px rgba(50,173,108,0.1),  -4px 0 6px rgba(50,173,108,0.1)',
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
};


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

export { StartNode, CustomContextMenu, CustomHandleVariablesNode };
