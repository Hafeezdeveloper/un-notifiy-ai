import React from 'react';

const HeaderSearchInput = () => {
    return (
        <div className="w-full max-w-xs  sm:max-w-sm md:max-w-md">
            <div className="relative">
                <input
                    type="search"
                    placeholder=""
                    className="bg-white/20 text-white placeholder-white/70 rounded-full py-1 px-4 pl-10 w-full 
                               focus:outline-none focus:ring-2 focus:ring-white/50 transition-all
                               text-sm sm:text-base
                              "
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">
                    ⌕
                </span>
            </div>
        </div>
    );
};

export default HeaderSearchInput;