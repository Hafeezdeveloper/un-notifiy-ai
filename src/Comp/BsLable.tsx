import React from 'react'

const BsLabel = (props: any) => {
    let { label } = props
    return (
        <label className="d-block mb-1  text-left font-size-20px   font_use text-gray-700 font-medium">
            {label}
        </label>
    )
}

export default BsLabel
