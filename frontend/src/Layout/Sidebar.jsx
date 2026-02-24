import { useLocation, useNavigate } from "react-router-dom";
import { FiUser, FiBookOpen, FiMessageSquare } from "react-icons/fi";
import "./dashboard.css";
import { FiSettings } from "react-icons/fi";
import PopupModal from "../Components/Auth/Common/PopupModal";
import { useState } from "react";

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId =
    storedUser?._id || storedUser?.id || storedUser?.userId;

  const isActive = (path) => location.pathname.startsWith(path);
  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const handleNavigate = (path) => {
    // Mobile logic
    if (window.innerWidth <= 768) {
      setOpen(false);

      // ⏳ Wait for sidebar close animation
      setTimeout(() => {
        navigate(path);
      }, 300); // must match CSS transition
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <aside className={`sidebar ${open ? "open" : ""}`}>

        {/* AI PERSONA */}
        <div
          onClick={() => handleNavigate(`/dashboard/persona/${userId}`)}
          className={`side-item ${isActive("/dashboard/persona") ? "active" : ""}`}
        >
          <FiUser className="icon" />
          <div>
            <p className="sidebar-title">AI PERSONA</p>
            <span className="sidebar-subtitle">
              How the agent talks and acts
            </span>
          </div>
        </div>

        {/* KNOWLEDGE BASE */}
        <div
          onClick={() => handleNavigate(`/dashboard/knowledge/${userId}`)}
          className={`side-item ${isActive("/dashboard/knowledge") ? "active" : ""}`}
        >
          <FiBookOpen className="icon" />
          <div>
            <p className="sidebar-title">KNOWLEDGE BASE</p>
            <span className="sidebar-subtitle">
              Train agent for context aware replies
            </span>
          </div>
        </div>

        {/* TEACH YOUR AGENT */}
        <div
          onClick={async () => {
            try {
              const res = await fetch(
                `http://localhost:4000/api/chatbot/${userId}`
              );
              const data = await res.json();

              // ❌ BLOCK IF WEBSITE NOT UPLOADED
              if (!data?.settings?.website) {
                setPopup({
                  show: true,
                  title: "Website Required",
                  message: "Please upload website first to use teach tour agent.",
                  onConfirm: () => {
                    setPopup(prev => ({ ...prev, show: false }));
                    handleNavigate(`/dashboard/knowledge/${userId}`);
                  },
                });
                return;
              }

              // ✅ ALLOW
              handleNavigate(`/dashboard/teach/${userId}`);
            } catch (err) {
              console.error(err);
              alert("Something went wrong");
            }
          }}
          className={`side-item ${isActive("/dashboard/teach") ? "active" : ""}`}
        >
          <FiMessageSquare className="icon" />
          <div>
            <p className="sidebar-title">TEACH YOUR AGENT</p>
            <span className="sidebar-subtitle">
              Train your agent with chat
            </span>
          </div>
        </div>

        {/* SETTINGS */}
        <div
          onClick={() => handleNavigate(`/settings/account/${userId}`)}
          className={`side-item ${isActive("/settings") ? "active" : ""}`}
          style={{ marginTop: "auto" }}
        >
          <FiSettings className="icon" />
          <div>
            <p className="sidebar-title">SETTINGS</p>
            <span className="sidebar-subtitle">Account & Preferences</span>
          </div>
        </div>

      </aside>
      <PopupModal
        show={popup.show}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup(prev => ({ ...prev, show: false }))}
        onConfirm={popup.onConfirm}
      />
    </>
  );

};

export default Sidebar;
