import React, { useState, useEffect } from "react";
import "./FileUpload.css";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom"; // ✅ added useParams
import axios from "axios";
import "./train-page.css";

const FileUpload = () => {
    const navigate = useNavigate();
    const { userId: routeUserId } = useParams(); // ✅ route userId

    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [uploadDone, setUploadDone] = useState(false);

    // 🔹 localStorage userId (NO DELETE)
    let storedUserId = null;
    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            storedUserId = parsed?._id || parsed?.id || parsed?.userId;
        }
    } catch {}

    // ✅ Final userId (route first, fallback localStorage)
    const finalUserId = routeUserId || storedUserId;

    /* ================= LOAD PDF STATUS FROM DB ================= */
    useEffect(() => {
        if (!finalUserId) return;

        axios
            .get(`http://localhost:4000/api/pdf/status/${finalUserId}`)
            .then((res) => {
                if (res.data?.hasPdf) {
                    setFile({ name: res.data.pdfName });
                    setUploadDone(true);
                }
            })
            .catch(() => {});
    }, [finalUserId]);

    /* ================= FILE SELECT ================= */
    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        if (selected.type !== "application/pdf") {
            setError("Only PDF files allowed");
            return;
        }

        setError("");
        setSuccess("");
        setFile(selected);
    };

    /* ================= CANCEL FILE ================= */
    const handleCancel = () => {
        setFile(null);
        setError("");
    };

    /* ================= UPLOAD ================= */
    const handleUpload = async () => {
        if (!file || uploadDone || !(file instanceof File)) return;

        if (!finalUserId) {
            setError("User ID missing!");
            return;
        }

        setShowPopup(true);
        setIsUploading(true);
        setError("");
        setSuccess("");

        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("userId", finalUserId);

        try {
            await axios.post(
                "http://localhost:4000/api/pdf/upload",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setTimeout(() => {
                setIsUploading(false);
                setSuccess("PDF uploaded successfully!");
                setUploadDone(true);
            }, 2000);

        } catch (err) {
            setIsUploading(false);
            setShowPopup(false);
            setError(
                err?.response?.data?.message ||
                "Upload failed. Try again."
            );
        }
    };

    return (
        <div className="persona-container">
            <div className="fu-header persona-header">
                <button
                    className="fu-back-btn"
                    onClick={() => navigate(`/dashboard/knowledge/${finalUserId}`)} // ✅ fixed
                >
                    ←
                </button>

                <div>
                    <h2>FILE</h2>
                    <p>Upload files to train your Agent</p>
                </div>
            </div>

            <div className="fu-card">
                {!file && !uploadDone && (
                    <div className="fu-upload-box">
                        <AiOutlineCloudUpload className="fu-upload-icon" />
                        <p className="fu-upload-text">
                            Drag and drop your files here or{" "}
                            <span className="fu-upload-link">upload files</span>
                        </p>

                        <input
                            type="file"
                            accept="application/pdf"
                            className="fu-input"
                            onChange={handleFileChange}
                        />
                    </div>
                )}

                {error && <p className="fu-error">{error}</p>}

                {file && (
                    <div className="fu-file-row">
                        <p className="fu-success">Selected: {file.name}</p>

                        {!uploadDone && (
                            <button
                                className="fu-cancel-btn"
                                onClick={handleCancel}
                            >
                                ✖
                            </button>
                        )}
                    </div>
                )}
            </div>

            <button
                className={`fu-save-btn ${uploadDone ? "blur" : ""}`}
                onClick={handleUpload}
                disabled={isUploading || uploadDone || !file}
            >
                {isUploading ? "Uploading..." : "Upload"}
            </button>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        {isUploading ? (
                            <>
                                <div className="loader"></div>
                                <p>Uploading...</p>
                            </>
                        ) : (
                            <>
                                <p>{success}</p>
                                <button
                                    className="popup-box-btn"
                                    onClick={() => setShowPopup(false)}
                                >
                                    OK
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUpload;