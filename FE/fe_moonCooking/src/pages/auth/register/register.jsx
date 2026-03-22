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
  User,
  Phone,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  UserPlus,
} from "lucide-react";

/* ─── Field ──────────────────────────────────────────────────────────────── */
function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  rightSlot,
  required,
  hint,
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
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        {label}
        {required && <span style={{ color: "#ef4444", fontSize: 14 }}>*</span>}
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
          style={{
            padding: "0 14px",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
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
            minWidth: 0,
          }}
        />
        {rightSlot && (
          <span style={{ paddingRight: 12, flexShrink: 0 }}>{rightSlot}</span>
        )}
      </div>
      {hint && !error && (
        <p
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 11,
            color: "#94a3b8",
            margin: 0,
          }}
        >
          {hint}
        </p>
      )}
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

/* ─── Password strength ──────────────────────────────────────────────────── */
function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    { label: "8+ chars", ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /\d/.test(password) },
    { label: "Special", ok: /[!@#$%^&*]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const barColors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
  const labels = ["Weak", "Fair", "Good", "Strong"];

  return (
    <div style={{ marginTop: 2 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: i < score ? barColors[score - 1] : "#e2e8f0",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {checks.map(({ label, ok }) => (
            <span
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                fontSize: 11,
                fontFamily: "'DM Sans',sans-serif",
                color: ok ? "#16a34a" : "#94a3b8",
                fontWeight: ok ? 600 : 400,
              }}
            >
              <CheckCircle2
                size={10}
                color={ok ? "#16a34a" : "#d1d5db"}
                fill={ok ? "#dcfce7" : "none"}
              />
              {label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: barColors[score - 1],
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            {labels[score - 1]}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Role card ──────────────────────────────────────────────────────────── */
function RoleCard({ role, selected, onClick }) {
  const meta = {
    USER: {
      emoji: "🍽️",
      title: "Home Cook",
      desc: "Browse recipes, get AI nutrition advice & book restaurants",
    },
    CHEF: {
      emoji: "👨‍🍳",
      title: "Professional Chef",
      desc: "Publish recipes, manage your restaurant & build your audience",
    },
  };
  const { emoji, title, desc } = meta[role];
  return (
    <motion.div
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        padding: "14px 16px",
        borderRadius: 14,
        border: `2px solid ${selected ? "#2563eb" : "#e2e8f0"}`,
        background: selected ? "#eff6ff" : "#f8fafc",
        cursor: "pointer",
        transition: "all 0.2s",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        boxShadow: selected ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
      }}
    >
      <span style={{ fontSize: 22, lineHeight: 1, marginTop: 1 }}>{emoji}</span>
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: selected ? "#1d4ed8" : "#1e293b",
            marginBottom: 3,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 12,
            color: "#64748b",
            lineHeight: 1.45,
          }}
        >
          {desc}
        </p>
      </div>
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: `2px solid ${selected ? "#2563eb" : "#cbd5e1"}`,
          background: selected ? "#2563eb" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.2s",
          marginTop: 2,
        }}
      >
        {selected && (
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#fff",
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

/* ─── SignupPage ─────────────────────────────────────────────────────────── */
export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "USER",
  });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required.";
    else if (form.username.trim().length < 3)
      e.username = "Username must be at least 3 characters.";

    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email address.";

    if (!form.phone.trim()) e.phone = "Phone number is required.";
    else if (!/^(\+84|84|0)[35789]\d{8}$/.test(form.phone))
      e.phone = "Invalid format. Example: 0912345678 or +84912345678";

    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters.";

    if (!form.confirmPassword)
      e.confirmPassword = "Please confirm your password.";
    else if (form.confirmPassword !== form.password)
      e.confirmPassword = "Passwords do not match.";

    if (!form.role) e.role = "Please select a role.";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error("Please fix the highlighted errors.");
      return;
    }
    setLoading(true);
    try {
      // Replace with real API call
      await new Promise((res) => setTimeout(res, 1800));
      toast.success("Account created! Please check your email to activate. 🎉");
      setTimeout(() => navigate("/login"), 1000);
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Live progress tracking
  const checks = [
    form.username.trim().length >= 3,
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
    /^(\+84|84|0)[35789]\d{8}$/.test(form.phone),
    form.password.length >= 8,
    form.confirmPassword.length > 0 && form.confirmPassword === form.password,
    !!form.role,
  ];
  const progress = Math.round(
    (checks.filter(Boolean).length / checks.length) * 100,
  );

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
          className="mc-signup-left"
          style={{
            width: "42%",
            background:
              "linear-gradient(155deg, #0f172a 0%, #1e3a8a 50%, #0369a1 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px 52px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.04,
              backgroundImage:
                "radial-gradient(circle, #bae6fd 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: -100,
              right: -100,
              width: 360,
              height: 360,
              background: "rgba(14,165,233,0.15)",
              borderRadius: "50%",
              filter: "blur(90px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -60,
              left: -60,
              width: 280,
              height: 280,
              background: "rgba(30,58,138,0.3)",
              borderRadius: "50%",
              filter: "blur(70px)",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              width: "100%",
              maxWidth: 360,
            }}
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 44,
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  background: "rgba(255,255,255,0.15)",
                  border: "1.5px solid rgba(255,255,255,0.25)",
                  borderRadius: 13,
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
                  fontSize: 23,
                  fontWeight: 800,
                  color: "#ffffff",
                }}
              >
                Moon<span style={{ color: "#7dd3fc" }}>Cooking</span>
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 36,
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.2,
                marginBottom: 14,
              }}
            >
              Join our
              <br />
              <span style={{ fontStyle: "italic", color: "#7dd3fc" }}>
                food family
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              style={{
                fontSize: 14,
                color: "#93c5fd",
                lineHeight: 1.7,
                marginBottom: 30,
              }}
            >
              Create your free account and unlock a world of chef-crafted
              recipes, AI nutrition guidance, and a thriving cooking community.
            </motion.p>

            {/* Progress card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28 }}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 16,
                padding: "18px 20px",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#e0f2fe",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  Profile completion
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: progress === 100 ? "#4ade80" : "#7dd3fc",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  {progress}%
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: "rgba(255,255,255,0.12)",
                  borderRadius: 4,
                  marginBottom: 14,
                }}
              >
                <motion.div
                  style={{
                    height: "100%",
                    borderRadius: 4,
                    background:
                      progress === 100
                        ? "linear-gradient(90deg, #4ade80, #22c55e)"
                        : "linear-gradient(90deg, #38bdf8, #2563eb)",
                  }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {[
                  { label: "Username", done: checks[0] },
                  { label: "Email", done: checks[1] },
                  { label: "Phone", done: checks[2] },
                  { label: "Password (8+ chars)", done: checks[3] },
                  { label: "Passwords match", done: checks[4] },
                  { label: "Role selected", done: checks[5] },
                ].map(({ label, done }) => (
                  <div
                    key={label}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <CheckCircle2
                      size={14}
                      color={done ? "#4ade80" : "#475569"}
                      fill={done ? "#16a34a22" : "none"}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        color: done ? "#bbf7d0" : "#64748b",
                        fontFamily: "'DM Sans',sans-serif",
                        fontWeight: done ? 600 : 400,
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Security note */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <ShieldCheck
                size={15}
                color="#7dd3fc"
                style={{ marginTop: 2, flexShrink: 0 }}
              />
              <p
                style={{
                  fontSize: 12,
                  color: "#7dd3fc",
                  lineHeight: 1.55,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Your data is encrypted and secure. We never share personal
                information with third parties.
              </p>
            </div>

            {/* Already have account */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                marginTop: 24,
                padding: "14px 18px",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 12,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  color: "#bfdbfe",
                  marginBottom: 10,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Already have an account?
              </p>
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login")}
                style={{
                  width: "100%",
                  padding: "11px 18px",
                  background: "rgba(255,255,255,0.15)",
                  border: "1.5px solid rgba(255,255,255,0.35)",
                  borderRadius: 10,
                  color: "#ffffff",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Sign In Instead →
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* ── Right panel (form) ─────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            background: "#f8fafc",
            overflowY: "auto",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "48px 32px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            style={{ width: "100%", maxWidth: 460 }}
          >
            {/* Header */}
            <div style={{ marginBottom: 30 }}>
              <h1
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: 7,
                }}
              >
                Create Account
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: "#64748b",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2563eb",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                    padding: 0,
                  }}
                >
                  Sign in here →
                </button>
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 18 }}
              >
                {/* Username */}
                <Field
                  label="Username"
                  value={form.username}
                  onChange={set("username")}
                  placeholder="e.g. john_cook"
                  icon={User}
                  error={errors.username}
                  required
                />

                {/* Email */}
                <Field
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  icon={Mail}
                  error={errors.email}
                  required
                />

                {/* Phone */}
                <Field
                  label="Phone Number"
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="0912345678"
                  icon={Phone}
                  error={errors.phone}
                  required
                  hint="Vietnamese format: 0912345678 · +84912345678"
                />

                {/* Password */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 5 }}
                >
                  <Field
                    label="Password"
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={set("password")}
                    placeholder="Create a strong password"
                    icon={Lock}
                    error={errors.password}
                    required
                    rightSlot={
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
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
                  <PasswordStrength password={form.password} />
                </div>

                {/* Confirm password */}
                <Field
                  label="Confirm Password"
                  type={showCpw ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  placeholder="Re-enter your password"
                  icon={Lock}
                  error={errors.confirmPassword}
                  required
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowCpw(!showCpw)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        padding: 0,
                      }}
                    >
                      {showCpw ? (
                        <EyeOff size={16} color="#94a3b8" />
                      ) : (
                        <Eye size={16} color="#94a3b8" />
                      )}
                    </button>
                  }
                />

                {/* Role */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <label
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#374151",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    Account Role{" "}
                    <span style={{ color: "#ef4444", fontSize: 14 }}>*</span>
                  </label>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {["USER", "CHEF"].map((role) => (
                      <RoleCard
                        key={role}
                        role={role}
                        selected={form.role === role}
                        onClick={() => {
                          setForm((p) => ({ ...p, role }));
                          if (errors.role)
                            setErrors((p) => ({ ...p, role: "" }));
                        }}
                      />
                    ))}
                  </div>
                  <AnimatePresence>
                    {errors.role && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
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
                        <AlertCircle size={12} /> {errors.role}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Admin note */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 9,
                      padding: "10px 14px",
                      background: "#fefce8",
                      border: "1px solid #fde68a",
                      borderRadius: 10,
                    }}
                  >
                    <span style={{ fontSize: 14, marginTop: 1 }}>🔒</span>
                    <p
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 12,
                        color: "#92400e",
                        lineHeight: 1.5,
                        margin: 0,
                      }}
                    >
                      <strong>Admin</strong> access is not available for public
                      registration. Contact your system administrator.
                    </p>
                  </div>
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
                    marginTop: 4,
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
                      Creating account…
                    </>
                  ) : (
                    <>
                      <UserPlus size={17} /> Create Account
                    </>
                  )}
                </motion.button>

                {/* Mobile — already have account */}
                <div
                  className="mc-mobile-login"
                  style={{ display: "none", textAlign: "center" }}
                >
                  <p
                    style={{
                      fontSize: 14,
                      color: "#64748b",
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
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
                      Sign in
                    </button>
                  </p>
                </div>

                <p
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    color: "#94a3b8",
                    lineHeight: 1.6,
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  By creating an account you agree to our{" "}
                  <a
                    href="#"
                    style={{ color: "#2563eb", textDecoration: "none" }}
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    style={{ color: "#2563eb", textDecoration: "none" }}
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 768px) {
          .mc-signup-left { display: none !important; }
          .mc-mobile-login { display: block !important; }
        }
      `}</style>
    </>
  );
}
