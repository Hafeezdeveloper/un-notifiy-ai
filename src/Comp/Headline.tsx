
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeadlineProps {
    title?: string;
    location?: string | number | (() => void);
    btnText?: string;
}

const Headline: React.FC<HeadlineProps> = ({ title = "", location, btnText = "" }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (typeof location === 'function') {
            // If location is a function, call it to perform state updates
            location();
        } else if (location === -1) {
            // If location is -1, navigate back
            navigate(-1);
        } else if (typeof location === 'string') {
            // If location is a string, navigate to the specified path
            navigate(location);
        } else {
            console.warn("Invalid location prop provided to Headline component.");
        }
    };

    return (
        <div className="container-1480">
            <div className="allside_shadow bg-white rounded-none lg:rounded-lg mb-2 py-3 px-6 flex justify-between items-center">
                <h4 className="font-size-20px font-Poppins-SemiBold theme-color-green">
                    {title}
                </h4>
                <div className='flex flex-row gap-2'>
                    {btnText &&
                        <button
                            className='theme-bg-green font-Poppins-Medium font-size-14px px-5 py-1 inline-table rounded-3xl text-white feeds-btn'
                        >
                            {btnText}
                        </button>
                    }
                    <button onClick={handleClick}>
                        <img
                            className="cursor-pointer notifi-back"
                            src="https://edgie.backslashwebs.com/imgs%2FBeck-icon.png"
                            alt="Back"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Headline;
