"use client";

import React, { useState } from 'react';

function UploadVideo() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isActive, setIsActive] = useState(false);

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setIsActive(true);
        console.log('Selected File:', file, 'Is active:', isActive);
    };

    const handleUpload = () => {
        if (isActive) {
            console.log(`uploading ${selectedFile} ...`);
            // You can perform the actual file upload logic here.
        }
    };

    const uploadButtonStyle = {
        backgroundColor: isActive ? '#6366F1' : 'red', // Change these colors as needed
    };

    return (
        <div className='max-w-7xl mx-auto'>

            <label htmlFor='file_input' className="block my-2 text-md font-medium text-gray-900 dark:text-white">Upload file</label>
            <label htmlFor="file_input" className="px-1 py-1 block w-5xl text-sm text-gray-100 border border-gray-300 rounded-lg cursor-pointer bg-gray-800 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600" aria-describedby="file_input_help">
                <input id="file_input" type="text"
                />
            </label>
            <label htmlFor="file_input" className="px-1 py-1 block w-5xl text-sm text-gray-100 border border-gray-300 rounded-lg cursor-pointer bg-gray-800 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600" aria-describedby="file_input_help">
                <input id="file_input" type="text"
                />
            </label>
            <div className='flex'>

                <label htmlFor="file_input" className="px-1 py-1 block w-5xl text-sm text-gray-100 border border-gray-300 rounded-lg cursor-pointer bg-gray-800 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600" aria-describedby="file_input_help">
                    <input id="file_input" type="file" className='' onChange={handleFileChange} />
                </label>

                <button
                    onClick={handleUpload}
                    className='mx-2 text-center items-center px-4 py-1 rounded-lg text-sm font-medium'
                    style={uploadButtonStyle}
                    disabled={!isActive}
                >Upload</button>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-300" id="file_input_help">MP4, AVO, MOV or GIF (MAX. 1280x720px).</p>
        </div>
    );
}

export default UploadVideo;
