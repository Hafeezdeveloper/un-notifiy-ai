import { useState } from "react";

const BsSelect = (props: any) => {
    let { onChange, value, name, data, style } = props
    return (
        <div className="relative">
            <select
                className={`${style ? style : "w-full"} font-size-20px p-2 font_use text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                value={value}
                name={name}
                onChange={onChange}
            >
                {data && Array.isArray(data) && data.map((x, i) => {
                    return (
                        <>
                            <option className="font_use " value={x._id}>{x.name}</option>
                        </>
                    )
                })}
            </select>
        </div>
    );
};

export default BsSelect;
