import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChefHat,
  LogIn,
  LogOut,
  User,
  Mail,
  Shield,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { getAuthenUser } from "../services/apiServices";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Foods", href: "/foods" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// ── Role badge color map ──────────────────────────────────────────────────────
const ROLE_STYLE = {
  ADMIN: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca", label: "Admin" },
  CHEF: { bg: "#fffbeb", color: "#d97706", border: "#fde68a", label: "Chef" },
  USER: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe", label: "User" },
};

// ── Avatar: show first 2 initials of username ─────────────────────────────────
function Avatar({ username, size = 38, scrolled }) {
  const initials = (username || "U")
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
        background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: size * 0.36,
        fontWeight: 700,
        color: "#ffffff",
        flexShrink: 0,
        boxShadow: scrolled
          ? "0 2px 8px rgba(37,99,235,0.35)"
          : "0 2px 12px rgba(0,0,0,0.25)",
        border: scrolled
          ? "2px solid #e0e7ff"
          : "2px solid rgba(255,255,255,0.4)",
        transition: "all 0.3s",
        cursor: "pointer",
      }}
    >
      {initials}
    </div>
  );
}

export default function Header() {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ── Fetch user ──────────────────────────────────────────────────────────────
  const fetchAuthenUser = async () => {
    try {
      const res = await getAuthenUser();
      setUser(res);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchAuthenUser();
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Close dropdown on outside click ────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Logout ──────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
    setProfileOpen(false);
    toast.success("Logged out successfully. See you soon! 👋");
    navigate("/login");
  };

  const isActive = (href) => location.pathname === href;

  const headerBg = scrolled ? "#ffffff" : "#1e40af";
  const textColor = scrolled ? "#1e293b" : "#ffffff";
  const subTextColor = scrolled ? "#64748b" : "#bfdbfe";
  const activeColor = scrolled ? "#1d4ed8" : "#ffffff";

  const roleStyle = ROLE_STYLE[user?.role] || ROLE_STYLE.USER;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: headerBg,
          boxShadow: scrolled
            ? "0 2px 24px rgba(30,58,138,0.13)"
            : "0 2px 12px rgba(0,0,0,0.18)",
          transition: "background-color 0.4s ease, box-shadow 0.4s ease",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 72,
            }}
          >
            {/* ── Logo ── */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate("/")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #60a5fa, #1d4ed8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(59,130,246,0.5)",
                }}
              >
                <ChefHat size={22} color="#ffffff" />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: 1.1,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 20,
                    fontWeight: 800,
                    letterSpacing: "-0.3px",
                    color: scrolled ? "#1d4ed8" : "#ffffff",
                  }}
                >
                  Moon
                  <span style={{ color: scrolled ? "#0f172a" : "#bfdbfe" }}>
                    Cooking
                  </span>
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 10,
                    fontWeight: 500,
                    color: subTextColor,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Cook · Eat · Thrive
                </span>
              </div>
            </motion.div>

            {/* ── Desktop Nav ── */}
            <nav
              style={{ display: "flex", alignItems: "center", gap: 2 }}
              className="mc-desktop-nav"
            >
              {navLinks.map((link) => (
                <motion.button
                  key={link.label}
                  whileHover={{ y: -1 }}
                  onClick={() => navigate(link.href)}
                  style={{
                    position: "relative",
                    padding: "8px 18px",
                    background: isActive(link.href)
                      ? scrolled
                        ? "rgba(37,99,235,0.08)"
                        : "rgba(255,255,255,0.15)"
                      : "transparent",
                    border: "none",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                    fontWeight: isActive(link.href) ? 600 : 500,
                    color: isActive(link.href) ? activeColor : subTextColor,
                    transition: "all 0.2s",
                  }}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="nav-underline"
                      style={{
                        position: "absolute",
                        bottom: 3,
                        left: 14,
                        right: 14,
                        height: 2,
                        borderRadius: 2,
                        background: activeColor,
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </nav>

            {/* ── Right: Auth area ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {user ? (
                /* ── Logged-in: Avatar + username row + dropdown ── */
                <div ref={dropdownRef} style={{ position: "relative" }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setProfileOpen((p) => !p)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "5px 10px 5px 5px",
                      background: scrolled
                        ? "#f1f5f9"
                        : "rgba(255,255,255,0.12)",
                      border: scrolled
                        ? "1.5px solid #e2e8f0"
                        : "1.5px solid rgba(255,255,255,0.28)",
                      borderRadius: 40,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <Avatar username={user.username} scrolled={scrolled} />

                    {/* Username + email */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        lineHeight: 1.25,
                      }}
                      className="mc-user-info"
                    >
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 13,
                          fontWeight: 700,
                          color: scrolled ? "#0f172a" : "#ffffff",
                          maxWidth: 120,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.username}
                      </span>
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 11,
                          fontWeight: 400,
                          color: scrolled ? "#64748b" : "#bfdbfe",
                          maxWidth: 120,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.email}
                      </span>
                    </div>

                    <ChevronDown
                      size={15}
                      color={scrolled ? "#64748b" : "#bfdbfe"}
                      style={{
                        transform: profileOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.25s",
                      }}
                    />
                  </motion.button>

                  {/* ── Dropdown popup ── */}
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.93, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.93, y: -8 }}
                        transition={{
                          type: "spring",
                          damping: 22,
                          stiffness: 320,
                        }}
                        style={{
                          position: "absolute",
                          top: "calc(100% + 10px)",
                          right: 0,
                          width: 280,
                          background: "#ffffff",
                          borderRadius: 18,
                          boxShadow:
                            "0 16px 48px rgba(30,58,138,0.18), 0 2px 8px rgba(0,0,0,0.08)",
                          border: "1px solid #e0e7ff",
                          overflow: "hidden",
                          zIndex: 200,
                        }}
                      >
                        {/* Profile header */}
                        <div
                          style={{
                            padding: "20px 20px 16px",
                            background:
                              "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          {/* decorative circle */}
                          <div
                            style={{
                              position: "absolute",
                              top: -20,
                              right: -20,
                              width: 80,
                              height: 80,
                              background: "rgba(255,255,255,0.08)",
                              borderRadius: "50%",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              bottom: -10,
                              left: -10,
                              width: 60,
                              height: 60,
                              background: "rgba(255,255,255,0.05)",
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
                            {/* Large avatar */}
                            <div
                              style={{
                                width: 52,
                                height: 52,
                                borderRadius: "50%",
                                background:
                                  "linear-gradient(135deg, #60a5fa, #3b82f6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: 20,
                                fontWeight: 700,
                                color: "#ffffff",
                                border: "2.5px solid rgba(255,255,255,0.4)",
                                flexShrink: 0,
                              }}
                            >
                              {(user.username || "U")
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
                                  fontFamily: "'DM Sans', sans-serif",
                                  fontSize: 15,
                                  fontWeight: 700,
                                  color: "#ffffff",
                                  margin: 0,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {user.username}
                              </p>
                              <p
                                style={{
                                  fontFamily: "'DM Sans', sans-serif",
                                  fontSize: 12,
                                  color: "#93c5fd",
                                  margin: "2px 0 0",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {user.email}
                              </p>
                            </div>
                          </div>

                          {/* Role badge */}
                          <div
                            style={{
                              marginTop: 12,
                              position: "relative",
                              zIndex: 1,
                            }}
                          >
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                padding: "4px 10px",
                                background: "rgba(255,255,255,0.18)",
                                border: "1px solid rgba(255,255,255,0.3)",
                                borderRadius: 20,
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#ffffff",
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                              }}
                            >
                              <Shield size={10} color="#93c5fd" />
                              {roleStyle.label}
                            </span>
                          </div>
                        </div>

                        {/* Info rows */}
                        <div style={{ padding: "14px 16px 6px" }}>
                          {[
                            {
                              icon: User,
                              label: "Username",
                              value: user.username,
                            },
                            { icon: Mail, label: "Email", value: user.email },
                            {
                              icon: Shield,
                              label: "Role",
                              value: user.role,
                              isRole: true,
                            },
                          ].map(({ icon: Icon, label, value, isRole }) => (
                            <div
                              key={label}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "9px 10px",
                                borderRadius: 10,
                                marginBottom: 2,
                              }}
                            >
                              <div
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: 8,
                                  background: "#eff6ff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <Icon size={14} color="#2563eb" />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p
                                  style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontSize: 10,
                                    fontWeight: 600,
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
                                      background: roleStyle.bg,
                                      border: `1px solid ${roleStyle.border}`,
                                      borderRadius: 6,
                                      fontFamily: "'DM Sans', sans-serif",
                                      fontSize: 12,
                                      fontWeight: 700,
                                      color: roleStyle.color,
                                      marginTop: 1,
                                    }}
                                  >
                                    {value}
                                  </span>
                                ) : (
                                  <p
                                    style={{
                                      fontFamily: "'DM Sans', sans-serif",
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

                        {/* Divider */}
                        <div
                          style={{
                            height: 1,
                            background: "#f1f5f9",
                            margin: "2px 16px 8px",
                          }}
                        />

                        {/* Logout button */}
                        <div style={{ padding: "0 12px 12px" }}>
                          <motion.button
                            whileHover={{
                              scale: 1.02,
                              backgroundColor: "#fef2f2",
                            }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleLogout}
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 8,
                              padding: "11px 16px",
                              background: "#fff5f5",
                              border: "1.5px solid #fecaca",
                              borderRadius: 12,
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: 14,
                              fontWeight: 700,
                              color: "#dc2626",
                              cursor: "pointer",
                              transition: "background 0.2s",
                            }}
                          >
                            <LogOut size={15} color="#dc2626" />
                            Log Out
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* ── Not logged in: Sign In button ── */
                <motion.button
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/login")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 22px",
                    background: scrolled
                      ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                      : "rgba(255,255,255,0.2)",
                    border: scrolled
                      ? "none"
                      : "1.5px solid rgba(255,255,255,0.5)",
                    borderRadius: 12,
                    color: "#ffffff",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: scrolled
                      ? "0 4px 16px rgba(37,99,235,0.4)"
                      : "none",
                    transition: "all 0.3s",
                  }}
                >
                  <LogIn size={16} color="#ffffff" />
                  Sign In
                </motion.button>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="mc-mobile-only"
                style={{
                  padding: 8,
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 8,
                  cursor: "pointer",
                  color: textColor,
                  display: "none",
                }}
              >
                {mobileOpen ? (
                  <X size={20} color={textColor} />
                ) : (
                  <Menu size={20} color={textColor} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: "#ffffff",
                borderTop: "1px solid #dbeafe",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 24px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {/* Mobile user info card */}
                {user && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      background: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      borderRadius: 14,
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      {(user.username || "U")
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
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#1e293b",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.username}
                      </p>
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 11,
                          color: "#64748b",
                          margin: "1px 0 0",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.email} ·{" "}
                        <span
                          style={{ color: roleStyle.color, fontWeight: 600 }}
                        >
                          {user.role}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => {
                      navigate(link.href);
                      setMobileOpen(false);
                    }}
                    style={{
                      padding: "12px 16px",
                      background: isActive(link.href)
                        ? "#eff6ff"
                        : "transparent",
                      border: "none",
                      borderRadius: 10,
                      textAlign: "left",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 15,
                      fontWeight: 500,
                      color: isActive(link.href) ? "#1d4ed8" : "#374151",
                      cursor: "pointer",
                    }}
                  >
                    {link.label}
                  </motion.button>
                ))}

                {user ? (
                  <motion.button
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                    onClick={handleLogout}
                    style={{
                      marginTop: 8,
                      padding: "12px 16px",
                      background: "#fff5f5",
                      border: "1.5px solid #fecaca",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#dc2626",
                      cursor: "pointer",
                    }}
                  >
                    <LogOut size={16} /> Log Out
                  </motion.button>
                ) : (
                  <motion.button
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                    onClick={() => {
                      navigate("/login");
                      setMobileOpen(false);
                    }}
                    style={{
                      marginTop: 8,
                      padding: "12px 16px",
                      background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                      border: "none",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    <LogIn size={16} /> Sign In
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <style>{`
        @media (max-width: 768px) {
          .mc-desktop-nav { display: none !important; }
          .mc-mobile-only { display: flex !important; }
          .mc-user-info   { display: none !important; }
        }
      `}</style>
    </>
  );
}
