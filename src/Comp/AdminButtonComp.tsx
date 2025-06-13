import React from 'react'

const AdminButtonComp = (props: any) => {
    let { onClick, style, label } = props

    return (
            <button onClick={onClick}>
                <span style={{ backgroundImage: "linear-gradient(180deg, #0072b5, #005a92)", color: "white" }} className={`${style ? style : "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold rounded-pill "}`}>
                    {label}
                </span>
            </button>
    )
}

export default AdminButtonComp
