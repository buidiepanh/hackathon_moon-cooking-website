import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChefHat,
  Sparkles,
  AlertCircle,
  LogIn,
  UserPlus,
} from "lucide-react";
import { getAuthenUser, loginFunction } from "../../../services/apiServices";

/* ─── Field ──────────────────────────────────────────────────────────────── */
function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  rightSlot,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 13,
          fontWeight: 600,
          color: "#374151",
        }}
      >
        {label}
      </label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: focused ? "#ffffff" : "#f8fafc",
          border: `1.5px solid ${error ? "#ef4444" : focused ? "#2563eb" : "#e2e8f0"}`,
          borderRadius: 12,
          overflow: "hidden",
          transition: "all 0.2s",
          boxShadow: focused
            ? "0 0 0 3px rgba(37,99,235,0.1)"
            : error
              ? "0 0 0 3px rgba(239,68,68,0.08)"
              : "none",
        }}
      >
        <span
          style={{ padding: "0 14px", display: "flex", alignItems: "center" }}
        >
          <Icon
            size={16}
            color={error ? "#ef4444" : focused ? "#2563eb" : "#94a3b8"}
            style={{ transition: "color 0.2s" }}
          />
        </span>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            padding: "13px 0",
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 14,
            color: "#1e293b",
          }}
        />
        {rightSlot && <span style={{ paddingRight: 14 }}>{rightSlot}</span>}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 12,
              color: "#ef4444",
              margin: 0,
            }}
          >
            <AlertCircle size={12} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const FOOD_EMOJIS = ["🍜", "🥗", "🍣", "🥘", "🍕", "🥩", "🍱", "🥑"];

/* ─── LoginPage ──────────────────────────────────────────────────────────── */
export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email address.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 2)
      e.password = "Password must be at least 3 characters.";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error("Please fix the errors below.");
      return;
    }
    setLoading(true);
    try {
      const res = await loginFunction(form);
      if (res) {
        toast.success("Signed in successfully! Welcome back.");
        sessionStorage.setItem("token", res.accessToken);
        const user = await getAuthenUser();
        if (user.role === "USER") {
          navigate("/");
        } else if (user.role === "CHEF") {
          navigate("/chef");
        } else if (user.role === "ADMIN") {
          navigate("/admin");
        }
      } else {
        toast.error("Signed in failed! Please try again.");
      }
    } catch {
      toast.error("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,500&family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        {/* ── Left panel ─────────────────────────────────────────────────── */}
        <div
          className="mc-left-panel"
          style={{
            width: "48%",
            background:
              "linear-gradient(150deg, #0f172a 0%, #1e3a8a 45%, #1d4ed8 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px 56px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* bg texture */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.05,
              backgroundImage:
                "radial-gradient(circle, #93c5fd 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: -80,
              left: -80,
              width: 320,
              height: 320,
              background: "rgba(59,130,246,0.2)",
              borderRadius: "50%",
              filter: "blur(80px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -60,
              right: -60,
              width: 280,
              height: 280,
              background: "rgba(99,102,241,0.18)",
              borderRadius: "50%",
              filter: "blur(70px)",
            }}
          />

          {/* Floating emojis */}
          {FOOD_EMOJIS.map((emoji, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                fontSize: 26,
                left: `${10 + (i % 4) * 22}%`,
                top: `${12 + Math.floor(i / 4) * 50}%`,
                opacity: 0.22,
                userSelect: "none",
              }}
              animate={{ y: [0, -10, 0], rotate: [0, 6, -6, 0] }}
              transition={{
                duration: 3 + i * 0.4,
                repeat: Infinity,
                delay: i * 0.35,
              }}
            >
              {emoji}
            </motion.div>
          ))}

          <div
            style={{
              position: "relative",
              zIndex: 2,
              textAlign: "center",
              maxWidth: 380,
            }}
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                marginBottom: 44,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: "rgba(255,255,255,0.15)",
                  border: "1.5px solid rgba(255,255,255,0.28)",
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChefHat size={24} color="#ffffff" />
              </div>
              <span
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#ffffff",
                }}
              >
                Moon<span style={{ color: "#93c5fd" }}>Cooking</span>
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 38,
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.2,
                marginBottom: 18,
              }}
            >
              Welcome
              <br />
              <span style={{ fontStyle: "italic", color: "#93c5fd" }}>
                back, Chef!
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: 15,
                color: "#93c5fd",
                lineHeight: 1.7,
                marginBottom: 40,
              }}
            >
              Sign in to access your personalized recipes, AI nutrition advisor,
              and kitchen dashboard.
            </motion.p>

            {/* Feature pills */}
            {[
              { icon: "🤖", text: "AI Nutrition Advisor" },
              { icon: "📖", text: "10,000+ Recipes" },
              { icon: "⭐", text: "Rate & Review" },
            ].map(({ icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 12,
                  marginBottom: 10,
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: 20 }}>{icon}</span>
                <span
                  style={{ fontSize: 14, fontWeight: 500, color: "#e0f2fe" }}
                >
                  {text}
                </span>
                <Sparkles
                  size={13}
                  color="#60a5fa"
                  style={{ marginLeft: "auto" }}
                />
              </motion.div>
            ))}

            {/* ── Sign up CTA on left panel ─────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              style={{
                marginTop: 28,
                padding: "16px 20px",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 14,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: "#bfdbfe",
                  marginBottom: 12,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                New to MoonCooking?
              </p>
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/signup")}
                style={{
                  width: "100%",
                  padding: "12px 20px",
                  background: "rgba(255,255,255,0.15)",
                  border: "1.5px solid rgba(255,255,255,0.35)",
                  borderRadius: 12,
                  color: "#ffffff",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.2s",
                }}
              >
                <UserPlus size={16} color="#ffffff" />
                Create a Free Account
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* ── Right panel ─────────────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 32px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{ width: "100%", maxWidth: 420 }}
          >
            {/* Header */}
            <div style={{ marginBottom: 36 }}>
              <h1
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 30,
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: 8,
                }}
              >
                Sign In
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: "#64748b",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2563eb",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                    padding: 0,
                    textDecoration: "underline",
                    textDecorationColor: "transparent",
                    transition: "text-decoration-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.textDecorationColor = "#2563eb")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.textDecorationColor = "transparent")
                  }
                >
                  Create one free →
                </button>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                <Field
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  icon={Mail}
                  error={errors.email}
                />

                <Field
                  label="Password"
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Enter your password"
                  icon={Lock}
                  error={errors.password}
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        padding: 0,
                      }}
                    >
                      {showPw ? (
                        <EyeOff size={16} color="#94a3b8" />
                      ) : (
                        <Eye size={16} color="#94a3b8" />
                      )}
                    </button>
                  }
                />

                {/* Forgot password */}
                <div style={{ textAlign: "right", marginTop: -8 }}>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: 13,
                      color: "#2563eb",
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{
                    scale: loading ? 1 : 1.02,
                    y: loading ? 0 : -1,
                  }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  style={{
                    width: "100%",
                    padding: "15px",
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    border: "none",
                    borderRadius: 14,
                    color: "#ffffff",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: loading ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: "0 6px 20px rgba(37,99,235,0.38)",
                    transition: "opacity 0.2s",
                    opacity: loading ? 0.8 : 1,
                  }}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 0.9,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        style={{
                          width: 18,
                          height: 18,
                          border: "2.5px solid rgba(255,255,255,0.35)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                        }}
                      />
                      Signing in…
                    </>
                  ) : (
                    <>
                      <LogIn size={17} /> Sign In
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                margin: "28px 0",
              }}
            >
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
              <span
                style={{
                  fontSize: 12,
                  color: "#94a3b8",
                  fontWeight: 500,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                OR CONTINUE WITH
              </span>
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            </div>

            {/* Social */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {[
                { label: "Google", emoji: "🌐" },
                { label: "Facebook", emoji: "📘" },
              ].map(({ label, emoji }) => (
                <motion.button
                  key={label}
                  type="button"
                  whileHover={{ y: -1, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "12px",
                    background: "#ffffff",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#374151",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  <span>{emoji}</span> {label}
                </motion.button>
              ))}
            </div>

            {/* Mobile signup link */}
            <div
              className="mc-mobile-signup"
              style={{ display: "none", marginTop: 24, textAlign: "center" }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: "#64748b",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                New to MoonCooking?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2563eb",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  Create a free account
                </button>
              </p>
            </div>

            <p
              style={{
                textAlign: "center",
                marginTop: 24,
                fontSize: 12,
                color: "#94a3b8",
                lineHeight: 1.6,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              By signing in you agree to our{" "}
              <a href="#" style={{ color: "#2563eb", textDecoration: "none" }}>
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" style={{ color: "#2563eb", textDecoration: "none" }}>
                Privacy Policy
              </a>
              .
            </p>
          </motion.div>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 768px) {
          .mc-left-panel { display: none !important; }
          .mc-mobile-signup { display: block !important; }
        }
      `}</style>
    </>
  );
}
