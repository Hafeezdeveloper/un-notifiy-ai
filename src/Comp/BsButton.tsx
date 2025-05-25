import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const BsButton = (props: any) => {
    let { isLoading, onClick, label, style } = props
    return (
        <>
            <button
                type="submit"
                className={`${isLoading ? "flex justify-center" : ""} ${style ? style : "w-full rounded-pill bg-primary      hover:bg-blue-700 text-white py-2 transition"}  `}
                disabled={isLoading}
                onClick={onClick}
            >

                {label}
                {isLoading && (
                    <><svg
                        className="ml-2 mt-1  h-5 w-4 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                    </svg>
                    </>)}
            </button >
        </>
    )
}

export default BsButton