import React from 'react'

const Model = (props:any) => {
    let { setModalOpen, handleDeleteConfirm ,modalOpen } = props

    return (
        <div>
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md w-[100%] max-w-xl">
                        <h2 className="font-size-55px font-semibold mb-4">Are you sure you want to delete this announcement?</h2>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteConfirm()}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Model
