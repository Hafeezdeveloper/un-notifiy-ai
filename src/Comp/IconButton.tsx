import React from 'react';

interface IconButtonProps {
    icon: React.ReactNode;
    onClick?: () => void;
    tooltip?: string;
    bgColor?: string; // optional custom background color
}

const IconButton = (props: any) => {
    let { icon, onClick, tooltip, bgColor } = props
    return (
        <button
            className={`p-2 ${bgColor || ' hover:bg-gray-800'} rounded-full`}
            title={tooltip || ''}
            onClick={onClick}
        >
            {icon}
        </button>
    );
};

export default IconButton;
