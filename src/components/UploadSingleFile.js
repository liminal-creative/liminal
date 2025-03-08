import React, { useContext, useState } from "react";
import axiosInstance from '../axiosConfig.js';
import AuthContext from '../context/AuthContext.js';

const FileUpload = () => {
    const { auth } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("companyId", auth.user.organizationId
        ._id); 
    try {
      setUploading(true);
      const response = await axiosInstance.post("/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("File uploaded successfully!");
      setFile(null);
    } catch (error) {
      setMessage("Error uploading file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload a File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;
