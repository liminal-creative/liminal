import React, { useState } from 'react';
import axiosInstance from '../axiosConfig.js';

const FileUpload = ({ companyId, onUploadSuccess }) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files.length > 3) {
            alert("You can only upload up to 3 files.");
            return;
        }
        setFiles([...e.target.files]);
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            alert("Please select files to upload.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('companyId', companyId);

        files.forEach(file => {
            formData.append('file', file);
        });

        try {
            const response = await axiosInstance.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log(response.data);
            onUploadSuccess(response.data.fileUrl);
            setFiles([]);
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="file-upload-container">
            <input type="file" multiple accept="image/*,application/pdf" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={uploading || files.length === 0}>
                {uploading ? "Uploading..." : "Upload Files"}
            </button>
            <div className="file-preview-grid">
                {files.map((file, index) => (
                    <div key={index} className="file-preview">
                        {file.type.startsWith('image') ? (
                            <img src={URL.createObjectURL(file)} alt="Preview" />
                        ) : (
                            <p>{file.name}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileUpload;
