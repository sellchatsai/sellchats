import React, { useState, useEffect } from "react";
import "./AddWebsite.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"; // ✅ added useParams
import "./train-page.css";

const AddWebsiteForm = ({ user }) => {
  const navigate = useNavigate();
  const { userId: routeUserId } = useParams(); // ✅ route param support

  const [url, setUrl] = useState("");
  const [storedWebsite, setStoredWebsite] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupLoading, setPopupLoading] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");

  // 🔹 original userId logic (NO REMOVE)
  const propUserId = user?._id || user?.id || user?.userId;

  // 🔹 fallback localStorage
  let storedUserId = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      storedUserId =
        parsed?._id || parsed?.id || parsed?.userId;
    }
  } catch {}

  // ✅ final userId (priority: route > prop > localStorage)
  const finalUserId = routeUserId || propUserId || storedUserId;

  /* ================= LOAD FROM DB ================= */
  useEffect(() => {
    if (!finalUserId) return;

    axios
      .get(`http://localhost:4000/api/chatbot/${finalUserId}`)
      .then((res) => {
        const website = res.data?.settings?.website;
        if (website) {
          setStoredWebsite(website);
          setUrl(website);
        }
      })
      .catch(() => {});
  }, [finalUserId]);

  /* ================= CRAWL WEBSITE ================= */
  const handleCrawl = async () => {
    if (!url.trim()) {
      setError("⚠️ Please enter a website URL");
      return;
    }

    try {
      setPopupLoading(true);
      setShowPopup(true);
      setError("");
      setSuccess("");

      await axios.post(
        "http://localhost:4000/api/webhook/ingest-website",
        {
          userId: finalUserId,
          source: url.trim(),
        }
      );

      setTimeout(() => {
        setPopupLoading(false);
        setPopupMsg("✅ Website uploaded. Training started.");
        setStoredWebsite(url.trim());
      }, 2000);

    } catch (err) {
      setPopupLoading(false);
      setShowPopup(false);
      setError(
        err?.response?.data?.message ||
        "❌ Failed to upload website"
      );
    }
  };

  return (
    <div className="persona-container">
      <div className="link-header-row persona-header">
        <button
          className="fu-back-btn"
          onClick={() => navigate(`/dashboard/knowledge/${finalUserId}`)} // ✅ fixed
        >
          ←
        </button>

        <div>
          <h2>LINK</h2>
          <p>Add website URLs to train your Agent</p>
        </div>
      </div>

      <div className="link-card">
        <label className="label-text">Enter a URL</label>
        <p className="help-text">Provide a URL for your agent to analyze</p>

        <input
          type="text"
          className="link-input"
          value={url}
          disabled={!!storedWebsite}
          onChange={(e) => setUrl(e.target.value)}
        />

        {storedWebsite && (
          <p className="info-text">
            🔒 Website uploaded successfully.
          </p>
        )}

        <button
          className="crawl-btn"
          onClick={handleCrawl}
          disabled={popupLoading || !!storedWebsite}
          style={{
            opacity: storedWebsite ? 0.5 : 1,
            cursor: storedWebsite ? "not-allowed" : "pointer"
          }}
        >
          {popupLoading ? "Uploading..." : "Upload"}
        </button>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            {popupLoading ? (
              <>
                <div className="loader"></div>
                <p>Uploading...</p>
              </>
            ) : (
              <>
                <p>{popupMsg}</p>
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

export default AddWebsiteForm;