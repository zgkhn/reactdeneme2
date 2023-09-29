import React, { useState } from 'react';
import Dropzone from 'react-dropzone-uploader';

const ImageAudioVideo = () => {
  const [fileDescriptions, setFileDescriptions] = useState({});

  const getUploadParams = ({ meta }) => {
    const url = 'https://httpbin.org/post';
    return {
      url,
      meta: { fileUrl: `${url}/${encodeURIComponent(meta.name)}`, description: '' },
    };
  };

  const handleChangeStatus = ({ file, meta }, status) => {
    if (file) {
      // Dosya tanımlıysa işlem yap
      if (status === 'done') {
        const newFileDescriptions = { ...fileDescriptions };
        newFileDescriptions[meta.fileUrl] = meta.description;
        setFileDescriptions(newFileDescriptions);
      }
    }
  };

  const handleSubmit = (files, allFiles) => {
    console.log(files.map((f) => f.meta));
    allFiles.forEach((f) => f.remove());
  };

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      accept="image/*,audio/*,video/*"
      inputContent={(files, extra) =>
        extra.reject ? 'Image, audio and video files only' : 'Drag Files'
      }
      styles={{
        dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
        inputLabel: (files, extra) => (extra.reject ? { color: 'red' } : {}),
      }}
    >
      {({ meta }) => {
        const description = fileDescriptions[meta.fileUrl] || '';
        return (
          <div className="file-description">
            <input
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => {
                const newFileDescriptions = { ...fileDescriptions };
                newFileDescriptions[meta.fileUrl] = e.target.value;
                setFileDescriptions(newFileDescriptions);
              }}
            />
                <input
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => {
                const newFileDescriptions = { ...fileDescriptions };
                newFileDescriptions[meta.fileUrl] = e.target.value;
                setFileDescriptions(newFileDescriptions);
              }}
            />
          </div>
        );
      }}
    </Dropzone>
  );
};

export default ImageAudioVideo;
