import React, { useState, useEffect } from "react";
import "./AddWebsite.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./train-page.css";

const AddWebsiteForm = ({ user }) => {
  const navigate = useNavigate();
  const { userId: routeUserId } = useParams();

  const [url, setUrl] = useState("");
  const [storedWebsite, setStoredWebsite] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [justUploaded, setJustUploaded] = useState(false);

  const propUserId = user?._id || user?.id || user?.userId;

  let storedUserId = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      storedUserId = parsed?._id || parsed?.id || parsed?.userId;
    }
  } catch {}

  const finalUserId = routeUserId || propUserId || storedUserId;

  /* ================= LOAD EXISTING WEBSITE ================= */
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

  /* ================= URL VALIDATION ================= */
  const isValidUrl = (value) => {
    try {
      const parsed = new URL(value);
      return (
        ["http:", "https:"].includes(parsed.protocol) &&
        parsed.hostname.includes(".")
      );
    } catch {
      return false;
    }
  };

  /* ================= HANDLE UPLOAD ================= */
  const handleCrawl = async () => {
    const cleanUrl = url.trim();

    if (!cleanUrl) {
      setError("Please enter a website URL.");
      return;
    }

    if (!isValidUrl(cleanUrl)) {
      setError("Enter a valid URL (must start with http:// or https://).");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setJustUploaded(false);

      await axios.post(
        "http://localhost:4000/api/webhook/ingest-website",
        {
          userId: finalUserId,
          source: cleanUrl,
        }
      );

      setStoredWebsite(cleanUrl);
      setJustUploaded(true);

      localStorage.setItem("trainingActive", "true");
      localStorage.setItem("trainingStartTime", Date.now());
      window.dispatchEvent(new Event("trainingStarted"));

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Failed to upload website. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="persona-container">
      <div className="link-header-row persona-header">
        <button
          className="fu-back-btn"
          onClick={() => navigate(`/dashboard/knowledge/${finalUserId}`)}
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
        <p className="help-text">
          Provide a valid website URL for your agent to analyze.
        </p>

        <input
          type="text"
          className="link-input"
          value={url}
          disabled={!!storedWebsite}
          onChange={(e) => setUrl(e.target.value)}
        />

        {/* SUCCESS / LOCK MESSAGE */}
        {storedWebsite && (
          <div className="success-box">
            {justUploaded ? (
              <>
                ✅ Website uploaded successfully.
                <br />
                Training has started. You will be notified once completed.
              </>
            ) : (
              <>
                🔒 Website connected successfully.
                <br />
                If you need to update it, please contact Support.
              </>
            )}
          </div>
        )}

        {/* BUTTON */}
        <button
          className={`crawl-btn ${storedWebsite ? "disabled-btn" : ""}`}
          onClick={handleCrawl}
          disabled={!!storedWebsite || loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
};

export default AddWebsiteForm;