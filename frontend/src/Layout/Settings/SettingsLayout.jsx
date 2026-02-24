import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import "./settings.css";

const SettingsLayout = ({ user, setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId: routeUserId } = useParams(); // ✅ added

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 🔹 original prop logic (NO REMOVE)
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

  // ✅ final userId
  const finalUserId = routeUserId || propUserId || storedUserId;

  const isSettingsHome = location.pathname === "/settings";

  const pageTitleMap = {
    [`/settings/account/${finalUserId}`]: "Account Settings",
    [`/settings/security/${finalUserId}`]: "Security Settings",
  };

  const pageTitle = pageTitleMap[location.pathname];

  /* ================= MOBILE SETTINGS HOME ================= */
  if (isMobile && isSettingsHome) {
    return (
      <div className="settings-mobile-home">

        <div className="settings-mobile-header">
          <button
            className="fu-back-btn"
            onClick={() =>
              navigate(`/dashboard/knowledge/${finalUserId}`)
            }
          >
            ←
          </button>

          <h2 className="settings-title">Settings</h2>
        </div>

        <div
          className="settings-card"
          onClick={() =>
            navigate(`/settings/account/${finalUserId}`)
          }
        >
          <span>Account</span>
          <p>Profile & personal info</p>
        </div>

        <div
          className="settings-card"
          onClick={() =>
            navigate(`/settings/security/${finalUserId}`)
          }
        >
          <span>Security</span>
          <p>Password & authentication</p>
        </div>

      </div>
    );
  }

  /* ================= DETAIL PAGE ================= */
  return (
    <div className="settings-root">
      {!isMobile && (
        <aside className="settings-sidebar">
          <NavLink
            to={`/settings/account/${finalUserId}`}
            className="settings-link"
          >
            Account
          </NavLink>

          <NavLink
            to={`/settings/security/${finalUserId}`}
            className="settings-link"
          >
            Security
          </NavLink>
        </aside>
      )}

      <main className="settings-content">
        {isMobile && pageTitle && (
          <div className="settings-mobile-header">
            <button
              className="fu-back-btn"
              onClick={() => navigate(`/settings`)}
            >
              ←
            </button>

            <h2>{pageTitle}</h2>
          </div>
        )}

        <Outlet context={{ user, setUser }} />
      </main>
    </div>
  );
};

export default SettingsLayout;