import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ChefHat,
  LogOut,
  User,
  Mail,
  Shield,
  ChevronDown,
  ChevronRight,
  Users,
  CreditCard,
  BarChart2,
  Menu,
  X,
  Phone,
  Settings,
} from "lucide-react";
import { getAuthenUser } from "../../services/apiServices";

// ─── Lazy-load page sections ──────────────────────────────────────────────────
const AccountManagement = lazy(() => import("./management/AccountManagement"));
const SubscriptionManagement = lazy(
  () => import("./management/SubscriptionManagement"),
);
const RevenueOverview = lazy(() => import("./management/RevenueOverview"));

// ─── Fonts ────────────────────────────────────────────────────────────────────
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap"
    rel="stylesheet"
  />
);

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    id: "accounts",
    label: "Account Management",
    icon: Users,
    desc: "Manage all user accounts",
  },
  {
    id: "subscriptions",
    label: "Subscription Management",
    icon: CreditCard,
    desc: "Plans & packages",
  },
  {
    id: "revenue",
    label: "Revenue Overview",
    icon: BarChart2,
    desc: "Analytics & earnings",
  },
];

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, size = 36, fontSize = 13, gradient }) {
  const initials = (name || "A")
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: gradient || "linear-gradient(135deg, #dc2626, #b91c1c)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        fontSize,
        fontWeight: 700,
        color: "#fff",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

// ─── Page loading skeleton ────────────────────────────────────────────────────
function PageLoader() {
  const pulse = {
    animate: { opacity: [0.45, 1, 0.45] },
    transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
  };
  return (
    <div style={{ padding: "40px 0" }}>
      <motion.div
        {...pulse}
        style={{
          height: 36,
          width: 220,
          background: "#e2e8f0",
          borderRadius: 10,
          marginBottom: 24,
        }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            {...pulse}
            style={{ height: 90, background: "#f1f5f9", borderRadius: 16 }}
          />
        ))}
      </div>
      <motion.div
        {...pulse}
        style={{ height: 400, background: "#f8fafc", borderRadius: 18 }}
      />
    </div>
  );
}

// ─── AdminLayout ──────────────────────────────────────────────────────────────
export default function AdminLayout() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("accounts");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [admin, setAdmin] = useState(null);

  const fetchAdmin = async () => {
    try {
      const res = await getAuthenUser();
      setAdmin(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    toast.success("Logged out successfully. Goodbye! 👋");
    setTimeout(() => navigate("/login"), 600);
  };

  const currentNav = NAV_ITEMS.find((n) => n.id === activeTab);

  return (
    <>
      <FontLink />

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "#fafafa",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* ══════════════════════════════════════════════════════════════
            SIDEBAR — red/dark theme to distinguish from Chef (blue)
        ══════════════════════════════════════════════════════════════ */}

        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.45)",
                zIndex: 40,
              }}
              className="admin-overlay"
            />
          )}
        </AnimatePresence>

        <aside
          className={`admin-sidebar${sidebarOpen ? " admin-sidebar--open" : ""}`}
          style={{
            width: 262,
            background:
              "linear-gradient(165deg, #0f172a 0%, #1c1917 40%, #1a0a0a 100%)",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            position: "sticky",
            top: 0,
            height: "100vh",
            zIndex: 50,
            boxShadow: "4px 0 24px rgba(0,0,0,0.2)",
            overflow: "hidden",
          }}
        >
          {/* bg decorations */}
          <div
            style={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              background: "rgba(220,38,38,0.08)",
              borderRadius: "50%",
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 80,
              left: -40,
              width: 160,
              height: 160,
              background: "rgba(185,28,28,0.06)",
              borderRadius: "50%",
              filter: "blur(50px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.025,
              backgroundImage:
                "radial-gradient(circle,#fca5a5 1px,transparent 1px)",
              backgroundSize: "28px 28px",
              pointerEvents: "none",
            }}
          />

          {/* Logo row */}
          <div
            style={{
              padding: "26px 22px 18px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
                onClick={() => navigate("/")}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 14px rgba(220,38,38,0.45)",
                  }}
                >
                  <ChefHat size={20} color="#fff" />
                </div>
                <div>
                  <span
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#fff",
                    }}
                  >
                    Moon<span style={{ color: "#fca5a5" }}>Cooking</span>
                  </span>
                  <p
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 9,
                      fontWeight: 600,
                      color: "#6b7280",
                      margin: 0,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                    }}
                  >
                    Admin Console
                  </p>
                </div>
              </div>

              {/* Close button — mobile only */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="admin-sidebar-close"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  display: "none",
                }}
              >
                <X size={18} color="#6b7280" />
              </button>
            </div>
          </div>

          {/* Admin mini card */}
          <div
            style={{
              margin: "0 14px 20px",
              padding: "12px 14px",
              background: "rgba(220,38,38,0.08)",
              border: "1px solid rgba(220,38,38,0.18)",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              gap: 11,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Avatar name={admin?.username} size={38} fontSize={14} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {admin?.username}
              </p>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "1px 7px",
                  background: "rgba(220,38,38,0.2)",
                  border: "1px solid rgba(220,38,38,0.4)",
                  borderRadius: 10,
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#fca5a5",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                <Shield size={8} color="#fca5a5" /> {admin?.role}
              </span>
            </div>
          </div>

          {/* Nav section label */}
          <div
            style={{
              padding: "0 22px",
              marginBottom: 8,
              position: "relative",
              zIndex: 1,
            }}
          >
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: "#4b5563",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Administration
            </p>
          </div>

          {/* Nav items */}
          <nav
            style={{
              flex: 1,
              padding: "0 10px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {NAV_ITEMS.map((item) => {
              const active = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: active ? 0 : 4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    padding: "11px 12px",
                    marginBottom: 4,
                    background: active ? "rgba(220,38,38,0.15)" : "transparent",
                    border: active
                      ? "1px solid rgba(220,38,38,0.25)"
                      : "1px solid transparent",
                    borderRadius: 12,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      background: active
                        ? "rgba(220,38,38,0.25)"
                        : "rgba(255,255,255,0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "background 0.2s",
                    }}
                  >
                    <item.icon
                      size={16}
                      color={active ? "#fca5a5" : "#6b7280"}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 14,
                        fontWeight: active ? 700 : 500,
                        color: active ? "#fff" : "#9ca3af",
                        margin: 0,
                        transition: "color 0.2s",
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 11,
                        color: active ? "#fca5a5" : "#4b5563",
                        margin: 0,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                  {active && (
                    <ChevronRight size={13} color="rgba(252,165,165,0.5)" />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Settings link */}
          <div
            style={{
              padding: "0 10px",
              marginBottom: 10,
              position: "relative",
              zIndex: 1,
            }}
          >
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => toast.success("Opening settings...")}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: "10px 12px",
                background: "transparent",
                border: "1px solid transparent",
                borderRadius: 12,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  background: "rgba(255,255,255,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Settings size={16} color="#6b7280" />
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#9ca3af",
                  margin: 0,
                }}
              >
                Settings
              </p>
            </motion.button>
          </div>

          {/* Logout */}
          <div
            style={{
              padding: "14px 14px 22px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.06)",
                marginBottom: 12,
              }}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "rgba(220,38,38,0.08)",
                border: "1px solid rgba(220,38,38,0.2)",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: "#fca5a5",
                cursor: "pointer",
              }}
            >
              <LogOut size={15} color="#fca5a5" /> Log Out
            </motion.button>
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════════════════
            MAIN AREA
        ══════════════════════════════════════════════════════════════ */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          {/* ── Top header ── */}
          <header
            style={{
              height: 68,
              background: "#ffffff",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 28px",
              position: "sticky",
              top: 0,
              zIndex: 30,
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}
          >
            {/* Left: hamburger + breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button
                onClick={() => setSidebarOpen(true)}
                className="admin-hamburger"
                style={{
                  padding: 8,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 9,
                  cursor: "pointer",
                  display: "none",
                }}
              >
                <Menu size={20} color="#374151" />
              </button>
              <div>
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#94a3b8",
                    margin: 0,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Admin Console
                </p>
                <p
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  {currentNav?.label}
                </p>
              </div>
            </div>

            {/* Right: profile dropdown */}
            <div ref={profileRef} style={{ position: "relative" }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setProfileOpen((p) => !p)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "5px 12px 5px 5px",
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 40,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <Avatar name={admin?.username} size={34} fontSize={12} />
                <div
                  className="admin-profile-text"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    lineHeight: 1.25,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#0f172a",
                      maxWidth: 140,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {admin?.username}
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 11,
                      color: "#64748b",
                      maxWidth: 140,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {admin?.email}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  color="#64748b"
                  style={{
                    transform: profileOpen ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform 0.25s",
                  }}
                />
              </motion.button>

              {/* ── Profile popup ── */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    key="profile-popup"
                    initial={{ opacity: 0, scale: 0.92, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -8 }}
                    transition={{ type: "spring", damping: 22, stiffness: 320 }}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 10px)",
                      right: 0,
                      width: 276,
                      background: "#fff",
                      borderRadius: 20,
                      boxShadow:
                        "0 16px 48px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)",
                      border: "1px solid #f1f5f9",
                      overflow: "hidden",
                      zIndex: 200,
                    }}
                  >
                    {/* Popup header — red gradient for admin */}
                    <div
                      style={{
                        padding: "20px 20px 16px",
                        background: "linear-gradient(135deg,#1c1917,#dc2626)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: -18,
                          right: -18,
                          width: 80,
                          height: 80,
                          background: "rgba(255,255,255,0.07)",
                          borderRadius: "50%",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        <div
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg,#ef4444,#dc2626)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#fff",
                            border: "2px solid rgba(255,255,255,0.35)",
                            flexShrink: 0,
                          }}
                        >
                          {admin?.username
                            .trim()
                            .split(" ")
                            .slice(0, 2)
                            .map((w) => w[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontFamily: "'DM Sans',sans-serif",
                              fontSize: 14,
                              fontWeight: 700,
                              color: "#fff",
                              margin: 0,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {admin?.username}
                          </p>
                          <p
                            style={{
                              fontFamily: "'DM Sans',sans-serif",
                              fontSize: 12,
                              color: "#fca5a5",
                              margin: "2px 0 0",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {admin?.email}
                          </p>
                        </div>
                      </div>
                      <div
                        style={{
                          marginTop: 11,
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "3px 10px",
                            background: "rgba(220,38,38,0.3)",
                            border: "1px solid rgba(252,165,165,0.35)",
                            borderRadius: 20,
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#fca5a5",
                            textTransform: "uppercase",
                          }}
                        >
                          <Shield size={9} color="#fca5a5" /> {admin?.role}
                        </span>
                      </div>
                    </div>

                    {/* Info rows */}
                    <div style={{ padding: "12px 14px 6px" }}>
                      {[
                        {
                          icon: User,
                          label: "Username",
                          value: admin?.username,
                        },
                        { icon: Mail, label: "Email", value: admin?.email },
                        { icon: Phone, label: "Phone", value: admin?.phone },
                        {
                          icon: Shield,
                          label: "Role",
                          value: admin?.role,
                          isRole: true,
                        },
                      ].map(({ icon: Icon, label, value, isRole }) => (
                        <div
                          key={label}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "8px 8px",
                            borderRadius: 10,
                            marginBottom: 2,
                          }}
                        >
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 8,
                              background: "#fff5f5",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Icon size={13} color="#dc2626" />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p
                              style={{
                                fontFamily: "'DM Sans',sans-serif",
                                fontSize: 10,
                                fontWeight: 700,
                                color: "#94a3b8",
                                margin: 0,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                              }}
                            >
                              {label}
                            </p>
                            {isRole ? (
                              <span
                                style={{
                                  display: "inline-block",
                                  padding: "1px 8px",
                                  background: "#fff5f5",
                                  border: "1px solid #fecaca",
                                  borderRadius: 5,
                                  fontFamily: "'DM Sans',sans-serif",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: "#dc2626",
                                  marginTop: 1,
                                }}
                              >
                                {value}
                              </span>
                            ) : (
                              <p
                                style={{
                                  fontFamily: "'DM Sans',sans-serif",
                                  fontSize: 13,
                                  fontWeight: 500,
                                  color: "#1e293b",
                                  margin: 0,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {value}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        height: 1,
                        background: "#f1f5f9",
                        margin: "4px 14px 8px",
                      }}
                    />

                    <div style={{ padding: "0 12px 12px" }}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleLogout}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          padding: "11px",
                          background: "#fff5f5",
                          border: "1.5px solid #fecaca",
                          borderRadius: 12,
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#dc2626",
                          cursor: "pointer",
                        }}
                      >
                        <LogOut size={15} color="#dc2626" /> Log Out
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </header>

          {/* ── Page content — lazy loads only active tab ── */}
          <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.26 }}
              >
                <Suspense fallback={<PageLoader />}>
                  {activeTab === "accounts" && <AccountManagement />}
                  {activeTab === "subscriptions" && <SubscriptionManagement />}
                  {activeTab === "revenue" && <RevenueOverview />}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed !important;
            left: 0; top: 0; bottom: 0;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          .admin-sidebar.admin-sidebar--open {
            transform: translateX(0);
          }
          .admin-hamburger     { display: flex !important; }
          .admin-sidebar-close { display: block !important; }
          .admin-overlay       { display: block; }
          .admin-profile-text  { display: none !important; }
        }
        @media (min-width: 769px) {
          .admin-overlay { display: none; }
        }
      `}</style>
    </>
  );
}
