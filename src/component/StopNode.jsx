import React from 'react';
import { Handle } from 'reactflow';

const StopNode = ({ data }) => {
    return (
        <div style={{
            backgroundColor: 'rgb(208,58,83)',
            boxShadow: '0 4px 6px rgba(208,58,83,0.1), 0 -4px 6px rgba(208,58,83,0.1),  4px 0 6px rgba(208,58,83,0.1),  -4px 0 6px rgba(208,58,83,0.1)',
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
                type="target"
                position="left"
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
};

export default StopNode;