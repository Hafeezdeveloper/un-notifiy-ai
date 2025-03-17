import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const BsInp = (props: any) => {
    let { onChange, type, value, label, inplabel, name, icon, onClick } = props
    return (
        <div >
            {inplabel && <div className="flex ">
                <label className="block font-size-20px   font_use text-gray-700 font-medium">
                    {inplabel}
                </label> </div>
            }
            <div className='relative'>
                <input
                    name={name}
                    type={type ? type : "text"}
                    placeholder={label}
                    value={value}
                    onChange={onChange}
                    className="mt-1 z-0 font-size-18px font_use w-full px-2 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <div className="absolute  custom-icon-pass-position right-3 sm:top-2 md:top-3 lg:top-3 text-gray-500" >
                    {icon && (
                        <div className="">
                            <button
                                type="button"
                                onClick={onClick}
                                className="focus:outline-none"
                            >
                                <FontAwesomeIcon icon={icon} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BsInp
