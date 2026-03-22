import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Crown,
  CheckCircle,
  Package,
  Zap,
  Sparkles,
  AlertCircle,
  Calendar,
  Shield,
  ChefHat,
  BookOpen,
  Store,
  Star,
  ToggleLeft,
  ToggleRight,
  BadgeCheck,
  Clock,
} from "lucide-react";
import {
  getAllChefPackages,
  getMyPackage,
} from "../../../services/apiServices";

// ─── Fonts ────────────────────────────────────────────────────────────────────
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
);
// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    price,
  );

// Map featCode → icon
const FEAT_ICON_MAP = {
  CREATE_RECEIPT: BookOpen,
  CREATE_RESTAURANT: Store,
  AI_ADVISOR: Sparkles,
  PRIORITY_SUPPORT: Star,
  CUSTOM_BRAND: BadgeCheck,
};
const getFeatIcon = (code) => FEAT_ICON_MAP[code] ?? Package;

// Plan visual config by index (since BE doesn't send colors)
const PLAN_THEMES = [
  {
    color: "#2563eb",
    gradient: "linear-gradient(135deg,#eff6ff,#dbeafe)",
    border: "#bfdbfe",
    icon: Zap,
  },
  {
    color: "#7c3aed",
    gradient: "linear-gradient(135deg,#f5f3ff,#ede9fe)",
    border: "#c4b5fd",
    icon: Crown,
  },
  {
    color: "#d97706",
    gradient: "linear-gradient(135deg,#fffbeb,#fef3c7)",
    border: "#fde68a",
    icon: Star,
  },
  {
    color: "#64748b",
    gradient: "linear-gradient(135deg,#f8fafc,#f1f5f9)",
    border: "#e2e8f0",
    icon: Package,
  },
];
const getTheme = (index) => PLAN_THEMES[index % PLAN_THEMES.length];

// ─── Feature row ─────────────────────────────────────────────────────────────
function FeatureRow({ feat, color }) {
  const Icon = getFeatIcon(feat.featCode);
  const valueLabel =
    feat.featValue === 1
      ? "✓"
      : feat.featValue >= 999
        ? "Unlimited"
        : `Up to ${feat.featValue}`;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        opacity: feat.featEnable ? 1 : 0.45,
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 7,
          background: feat.featEnable ? color + "18" : "#f1f5f9",
          border: `1px solid ${feat.featEnable ? color + "35" : "#e2e8f0"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={13} color={feat.featEnable ? color : "#94a3b8"} />
      </div>
      <span
        style={{
          flex: 1,
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 13,
          color: feat.featEnable ? "#374151" : "#94a3b8",
          lineHeight: 1.4,
        }}
      >
        {feat.featName}
      </span>
      <span
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 11,
          fontWeight: 700,
          color: feat.featEnable ? color : "#94a3b8",
          background: feat.featEnable ? color + "12" : "#f1f5f9",
          border: `1px solid ${feat.featEnable ? color + "30" : "#e2e8f0"}`,
          borderRadius: 5,
          padding: "1px 7px",
          whiteSpace: "nowrap",
        }}
      >
        {feat.featEnable ? valueLabel : "Disabled"}
      </span>
    </div>
  );
}

// ─── MySubscription ───────────────────────────────────────────────────────────
export default function MySubscription() {
  const [currentSub, setCurrentSub] = useState(null);
  const [plans, setPlans] = useState([]);

  const fetchData = async () => {
    try {
      const res = await getAllChefPackages();
      setPlans(res);
      const res1 = await getMyPackage();
      setCurrentSub(res1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isCurrentPlan = (plan) => currentSub?._id === plan._id;

  const handleUpgrade = (plan) => {
    if (isCurrentPlan(plan)) return;
    if (!plan.available) {
      toast.error("This plan is no longer available.");
      return;
    }
    toast.success(`Redirecting to checkout for "${plan.subsciptionName}"...`);
    // TODO: navigate to checkout or call API
  };

  return (
    <>
      <FontLink />

      {/* ── Page header ── */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 28,
            fontWeight: 800,
            color: "#0f172a",
            margin: 0,
          }}
        >
          My Subscription
        </h1>
        <p
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 14,
            color: "#64748b",
            margin: "4px 0 0",
          }}
        >
          Manage your plan and unlock premium features
        </p>
      </div>

      {/* ── Current plan banner ── */}
      <AnimatePresence mode="wait">
        {currentSub ? (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "linear-gradient(135deg,#1e3a8a,#1d4ed8,#2563eb)",
              borderRadius: 22,
              padding: "26px 30px",
              marginBottom: 36,
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 12px 36px rgba(37,99,235,0.3)",
            }}
          >
            {/* decorative */}
            <div
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 160,
                height: 160,
                background: "rgba(255,255,255,0.06)",
                borderRadius: "50%",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -30,
                left: 50,
                width: 120,
                height: 120,
                background: "rgba(255,255,255,0.04)",
                borderRadius: "50%",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.04,
                backgroundImage:
                  "radial-gradient(circle,#93c5fd 1px,transparent 1px)",
                backgroundSize: "24px 24px",
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 20,
                  marginBottom: 20,
                }}
              >
                {/* Left */}
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: "rgba(255,255,255,0.15)",
                      border: "1.5px solid rgba(255,255,255,0.28)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Crown size={26} color="#fbbf24" />
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#93c5fd",
                        margin: 0,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      Active Plan
                    </p>
                    <p
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: 24,
                        fontWeight: 800,
                        color: "#fff",
                        margin: "3px 0 0",
                        lineHeight: 1.1,
                      }}
                    >
                      {currentSub.subsciptionName}
                    </p>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "2px 10px",
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.22)",
                        borderRadius: 20,
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#bfdbfe",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginTop: 6,
                      }}
                    >
                      <ChefHat size={10} />{" "}
                      {currentSub.subscriptionType.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                {/* Right */}
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      background: "rgba(34,197,94,0.2)",
                      border: "1px solid rgba(34,197,94,0.4)",
                      borderRadius: 20,
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#4ade80",
                    }}
                  >
                    <CheckCircle size={13} /> Active
                  </span>
                  <p
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: 26,
                      fontWeight: 800,
                      color: "#fff",
                      margin: "10px 0 2px",
                    }}
                  >
                    {formatPrice(currentSub.price)}
                  </p>
                  {currentSub.expiresAt && (
                    <p
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 13,
                        color: "#93c5fd",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Calendar size={13} /> Expires{" "}
                      {formatDate(currentSub.expiresAt)}
                    </p>
                  )}
                </div>
              </div>

              {/* Features of current plan */}
              <div
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 14,
                  padding: "14px 16px",
                }}
              >
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#93c5fd",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    margin: "0 0 12px",
                  }}
                >
                  Included Features
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
                    gap: 8,
                  }}
                >
                  {currentSub.features.map((feat) => {
                    const Icon = getFeatIcon(feat.featCode);
                    const valueLabel =
                      feat.featValue === 1
                        ? "✓"
                        : feat.featValue >= 999
                          ? "Unlimited"
                          : `Up to ${feat.featValue}`;
                    return (
                      <div
                        key={feat._id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 6,
                            background: "rgba(255,255,255,0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={13} color="#bfdbfe" />
                        </div>
                        <span
                          style={{
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 13,
                            color: "#e0f2fe",
                            flex: 1,
                          }}
                        >
                          {feat.featName}
                        </span>
                        <span
                          style={{
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#fbbf24",
                            background: "rgba(251,191,36,0.15)",
                            borderRadius: 5,
                            padding: "1px 6px",
                          }}
                        >
                          {valueLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="no-plan"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "18px 22px",
              background: "#fffbeb",
              border: "1.5px solid #fde68a",
              borderRadius: 16,
              marginBottom: 32,
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
            }}
          >
            <AlertCircle
              size={20}
              color="#d97706"
              style={{ flexShrink: 0, marginTop: 2 }}
            />
            <div>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#92400e",
                  margin: 0,
                }}
              >
                No active subscription
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13,
                  color: "#b45309",
                  margin: "3px 0 0",
                }}
              >
                You're currently on the Free plan. Choose a plan below to unlock
                more features.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Available plans header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 4px",
            }}
          >
            Available Plans
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 14,
              color: "#64748b",
              margin: 0,
            }}
          >
            Choose the plan that fits your needs
          </p>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            background: "#f0fdf4",
            border: "1px solid #86efac",
            borderRadius: 20,
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: "#16a34a",
          }}
        >
          <CheckCircle size={12} /> {plans.filter((p) => p.available).length}{" "}
          plans available
        </span>
      </div>

      {/* ── Plan cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: 22,
        }}
      >
        {plans.map((plan, i) => {
          const theme = getTheme(i);
          const active = isCurrentPlan(plan);
          const disabled = !plan.available;
          const PlanIcon = theme.icon;

          return (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.09 }}
              style={{
                background: disabled ? "#f8fafc" : theme.gradient,
                border: `2px solid ${active ? theme.color : disabled ? "#e2e8f0" : theme.border}`,
                borderRadius: 22,
                padding: "24px 22px",
                position: "relative",
                overflow: "hidden",
                opacity: disabled ? 0.65 : 1,
                boxShadow: active
                  ? `0 8px 28px ${theme.color}35`
                  : disabled
                    ? "none"
                    : "0 4px 16px rgba(0,0,0,0.05)",
                transition: "box-shadow 0.3s",
              }}
            >
              {/* Badge: Current / Popular / Unavailable */}
              {(active || i === 1 || disabled) && (
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    padding: "3px 10px",
                    background: disabled
                      ? "#94a3b8"
                      : active
                        ? theme.color
                        : theme.color,
                    borderRadius: 20,
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {disabled ? (
                    <>
                      <ToggleLeft size={9} /> Unavailable
                    </>
                  ) : active ? (
                    <>
                      <CheckCircle size={9} /> Current Plan
                    </>
                  ) : (
                    <>
                      <Sparkles size={9} /> Popular
                    </>
                  )}
                </div>
              )}

              {/* Icon + Type badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: (disabled ? "#94a3b8" : theme.color) + "18",
                    border: `1.5px solid ${disabled ? "#94a3b8" : theme.color}35`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PlanIcon
                    size={22}
                    color={disabled ? "#94a3b8" : theme.color}
                  />
                </div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "2px 8px",
                    background: (disabled ? "#94a3b8" : theme.color) + "14",
                    border: `1px solid ${disabled ? "#94a3b8" : theme.color}28`,
                    borderRadius: 6,
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    color: disabled ? "#94a3b8" : theme.color,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  <ChefHat size={9} />{" "}
                  {plan.subscriptionType.replace(/_/g, " ")}
                </span>
              </div>

              {/* Plan name */}
              <p
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#0f172a",
                  margin: "0 0 4px",
                }}
              >
                {plan.subsciptionName}
              </p>

              {/* Price */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 6,
                  marginBottom: 18,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: 26,
                    fontWeight: 800,
                    color: disabled ? "#94a3b8" : theme.color,
                  }}
                >
                  {formatPrice(plan.price)}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 12,
                    color: "#64748b",
                  }}
                >
                  / month
                </span>
              </div>

              {/* Features */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginBottom: 22,
                }}
              >
                {plan.features.map((feat) => (
                  <FeatureRow
                    key={feat._id}
                    feat={feat}
                    color={disabled ? "#94a3b8" : theme.color}
                  />
                ))}
              </div>

              {/* Meta: created date */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  marginBottom: 18,
                }}
              >
                <Clock size={11} color="#94a3b8" />
                <span
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 11,
                    color: "#94a3b8",
                  }}
                >
                  Added {formatDate(plan.createdAt)}
                </span>
              </div>

              {/* CTA button */}
              <motion.button
                whileHover={{ scale: active || disabled ? 1 : 1.03 }}
                whileTap={{ scale: active || disabled ? 1 : 0.97 }}
                onClick={() => handleUpgrade(plan)}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: active
                    ? "transparent"
                    : disabled
                      ? "#e2e8f0"
                      : theme.color,
                  border: `1.5px solid ${active ? theme.color : disabled ? "#e2e8f0" : theme.color}`,
                  borderRadius: 12,
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: active ? theme.color : disabled ? "#94a3b8" : "#fff",
                  cursor: active || disabled ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  transition: "all 0.2s",
                  boxShadow:
                    active || disabled ? "none" : `0 4px 14px ${theme.color}40`,
                }}
              >
                {active ? (
                  <>
                    <CheckCircle size={15} /> Current Plan
                  </>
                ) : disabled ? (
                  <>
                    <ToggleLeft size={15} /> Not Available
                  </>
                ) : (
                  <>
                    <Sparkles size={15} /> Subscribe — {formatPrice(plan.price)}
                  </>
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* ── Note ── */}
      <div
        style={{
          marginTop: 32,
          padding: "16px 20px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 14,
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <Shield
          size={16}
          color="#64748b"
          style={{ flexShrink: 0, marginTop: 2 }}
        />
        <p
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 13,
            color: "#64748b",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Prices are in Vietnamese Dong (VND). All plans are billed monthly. You
          can cancel anytime — no hidden fees. Payments are processed securely.
        </p>
      </div>
    </>
  );
}
