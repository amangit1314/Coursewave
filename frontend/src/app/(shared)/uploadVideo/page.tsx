"use client";

import React, { useState } from "react";

function UploadVideo() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setIsActive(true);
    console.log("Selected File:", file, "Is active:", isActive);
  };

  const handleUpload = () => {
    if (isActive) {
      console.log(`uploading ${selectedFile} ...`);
      // You can perform the actual file upload logic here.
    }
  };

  const uploadButtonStyle = {
    backgroundColor: isActive ? "#6366F1" : "red", // Change these colors as needed
  };

  return (
    <div className="mx-auto max-w-7xl">
      <label
        htmlFor="file_input"
        className="text-md my-2 block font-medium text-gray-900 dark:text-white"
      >
        Upload file
      </label>
      <label
        htmlFor="file_input"
        className="w-5xl block cursor-pointer rounded-lg border border-gray-300 bg-gray-800 px-1 py-1 text-sm text-gray-100 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-600"
        aria-describedby="file_input_help"
      >
        <input id="file_input" type="text" />
      </label>
      <label
        htmlFor="file_input"
        className="w-5xl block cursor-pointer rounded-lg border border-gray-300 bg-gray-800 px-1 py-1 text-sm text-gray-100 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-600"
        aria-describedby="file_input_help"
      >
        <input id="file_input" type="text" />
      </label>
      <div className="flex">
        <label
          htmlFor="file_input"
          className="w-5xl block cursor-pointer rounded-lg border border-gray-300 bg-gray-800 px-1 py-1 text-sm text-gray-100 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-600"
          aria-describedby="file_input_help"
        >
          <input
            id="file_input"
            type="file"
            className=""
            onChange={handleFileChange}
          />
        </label>

        <button
          onClick={handleUpload}
          className="mx-2 items-center rounded-lg px-4 py-1 text-center text-sm font-medium"
          style={uploadButtonStyle}
          disabled={!isActive}
        >
          Upload
        </button>
      </div>
      <p
        className="mt-2 text-xs text-gray-500 dark:text-gray-300"
        id="file_input_help"
      >
        MP4, AVO, MOV or GIF (MAX. 1280x720px).
      </p>
    </div>
  );
}

export default UploadVideo;
