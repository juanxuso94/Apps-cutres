import React from 'react';

export const LeafIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <g strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25L14.47 8.75L21.75 9.42L16.21 14.24L17.9 21.5L12 17.77L6.1 21.5L7.79 14.24L2.25 9.42L9.53 8.75L12 2.25Z" />
        </g>
        <g transform="translate(0, -0.5)">
            <circle cx="12" cy="12.5" r="5" strokeWidth="1.2"/>
            <circle cx="12" cy="12.5" r="3.7" strokeWidth="1"/>
            <circle cx="12"cy="12.5" r="2.4" strokeWidth="0.8"/>
            <circle cx="12" cy="12.5" r="1.1" strokeWidth="0.6"/>
            <circle cx="12" cy="12.5" r="0.2" fill="currentColor" strokeWidth="0"/>
        </g>
    </svg>
);