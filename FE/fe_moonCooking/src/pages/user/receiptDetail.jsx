import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ChefHat,
  Clock,
  Calendar,
  Star,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ImageOff,
  Lock,
  Trophy,
  BarChart2,
  ChevronLeft,
  Sparkles,
  PlayCircle,
  Image as ImageIcon,
  AlertTriangle,
  RefreshCw,
  Home,
  SearchX,
} from "lucide-react";
import { getReceiptDetails, ratingReceipt } from "../../services/apiServices";

// ─── Fonts ────────────────────────────────────────────────────────────────────
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap"
    rel="stylesheet"
  />
);

// ─── Simulate API — swap this with your real service call ─────────────────────
const fetchReceiptById = async (id) => {
  try {
    const res = await getReceiptDetails(id);
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
function avgRating(arr) {
  if (!arr?.length) return "0.0";
  return (arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(1);
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
  const pulse = {
    animate: { opacity: [0.45, 1, 0.45] },
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
  };
  return (
    <div
      style={{ maxWidth: 900, margin: "0 auto", padding: "104px 24px 80px" }}
    >
      <motion.div
        {...pulse}
        style={{
          width: 170,
          height: 40,
          background: "#dbeafe",
          borderRadius: 12,
          marginBottom: 28,
        }}
      />
      <motion.div
        {...pulse}
        style={{
          height: 190,
          background: "linear-gradient(135deg, #dbeafe, #eff6ff)",
          borderRadius: 24,
          marginBottom: 24,
        }}
      />
      <motion.div
        {...pulse}
        style={{
          height: 108,
          background: "#f1f5f9",
          borderRadius: 18,
          marginBottom: 20,
        }}
      />
      <motion.div
        {...pulse}
        style={{
          height: 500,
          background: "#f8fafc",
          borderRadius: 24,
          marginBottom: 24,
        }}
      />
    </div>
  );
}

// ─── Invalid ID / Not-found page ──────────────────────────────────────────────
function InvalidReceiptPage({ receiptId, errorMsg, onRetry }) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #fff5f5 0%, #ffffff 50%, #fef2f2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "88px 24px 60px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <FontLink />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", damping: 18 }}
        style={{
          maxWidth: 500,
          width: "100%",
          background: "#ffffff",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow:
            "0 24px 64px rgba(220,38,38,0.14), 0 4px 16px rgba(0,0,0,0.06)",
          border: "1.5px solid #fecaca",
        }}
      >
        {/* Top banner */}
        <div
          style={{
            padding: "40px 36px 30px",
            background:
              "linear-gradient(135deg, #7f1d1d 0%, #dc2626 60%, #ef4444 100%)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              background: "rgba(255,255,255,0.07)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -20,
              left: -20,
              width: 90,
              height: 90,
              background: "rgba(255,255,255,0.05)",
              borderRadius: "50%",
            }}
          />

          <motion.div
            animate={{ rotate: [0, -10, 10, -6, 0] }}
            transition={{ duration: 0.7, delay: 0.35 }}
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <SearchX size={38} color="#ffffff" />
          </motion.div>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 28,
              fontWeight: 800,
              color: "#ffffff",
              margin: "0 0 8px",
              position: "relative",
              zIndex: 1,
            }}
          >
            Recipe Not Found
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: "rgba(255,255,255,0.75)",
              margin: 0,
              position: "relative",
              zIndex: 1,
            }}
          >
            Không thể tải công thức này
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: "28px 32px 32px" }}>
          {/* Error message box */}
          <div
            style={{
              padding: "14px 18px",
              background: "#fff5f5",
              border: "1px solid #fecaca",
              borderRadius: 14,
              marginBottom: 18,
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <AlertTriangle
              size={18}
              color="#dc2626"
              style={{ flexShrink: 0, marginTop: 2 }}
            />
            <div>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#991b1b",
                  margin: "0 0 4px",
                }}
              >
                ID không hợp lệ
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13,
                  color: "#b91c1c",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {errorMsg ||
                  `Receipt ID "${receiptId}" không hợp lệ hoặc không tồn tại.`}
              </p>
            </div>
          </div>

          {/* ID chip */}
          <div
            style={{
              padding: "10px 14px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 10,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                flexShrink: 0,
              }}
            >
              Requested ID
            </span>
            <code
              style={{
                fontFamily: "monospace",
                fontSize: 13,
                color: "#dc2626",
                background: "#fef2f2",
                padding: "2px 10px",
                borderRadius: 6,
                border: "1px solid #fecaca",
                wordBreak: "break-all",
              }}
            >
              {receiptId || "—"}
            </code>
          </div>

          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 13,
              color: "#64748b",
              lineHeight: 1.65,
              marginBottom: 24,
            }}
          >
            Vui lòng kiểm tra lại đường dẫn hoặc quay về trang danh sách để tìm
            công thức bạn muốn.
          </p>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/")}
              style={{
                width: "100%",
                padding: "13px",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                border: "none",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "#ffffff",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(37,99,235,0.35)",
              }}
            >
              <Home size={16} /> Về trang chủ
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/foods")}
              style={{
                width: "100%",
                padding: "13px",
                background: "#ffffff",
                border: "1.5px solid #dbeafe",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: "#1d4ed8",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(30,58,138,0.07)",
              }}
            >
              <SearchX size={16} /> Xem tất cả công thức
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRetry}
              style={{
                width: "100%",
                padding: "11px",
                background: "transparent",
                border: "1.5px solid #e2e8f0",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#64748b",
                cursor: "pointer",
              }}
            >
              <RefreshCw size={14} /> Thử lại
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StarRow({ value, max = 5, size = 18, interactive = false, onChange }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i + 1 <= display;
        return (
          <motion.button
            key={i}
            type="button"
            whileHover={interactive ? { scale: 1.25 } : {}}
            whileTap={interactive ? { scale: 0.88 } : {}}
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onChange?.(i + 1)}
            style={{
              background: "none",
              border: "none",
              padding: 2,
              cursor: interactive ? "pointer" : "default",
            }}
          >
            <Star
              size={size}
              color={filled ? "#f59e0b" : "#d1d5db"}
              fill={filled ? "#f59e0b" : "#f3f4f6"}
            />
          </motion.button>
        );
      })}
    </div>
  );
}

function StepMedia({ image, video }) {
  if (video) {
    return (
      <div
        style={{
          position: "relative",
          borderRadius: 16,
          overflow: "hidden",
          background: "#0f172a",
        }}
      >
        <video
          src={video}
          controls
          style={{ width: "100%", maxHeight: 340, display: "block" }}
        />
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            padding: "4px 10px",
            background: "rgba(0,0,0,0.6)",
            borderRadius: 20,
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <PlayCircle size={12} /> Video guide
        </div>
      </div>
    );
  }
  if (image) {
    return (
      <div
        style={{ position: "relative", borderRadius: 16, overflow: "hidden" }}
      >
        <img
          src={image}
          alt="step"
          style={{
            width: "100%",
            height: 300,
            objectFit: "cover",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
            borderRadius: 16,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            padding: "4px 10px",
            background: "rgba(0,0,0,0.5)",
            borderRadius: 20,
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <ImageIcon size={12} /> Photo guide
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        height: 180,
        borderRadius: 16,
        background: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
        border: "2px dashed #cbd5e1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 14,
          background: "#e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ImageOff size={24} color="#94a3b8" />
      </div>
      <p
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 13,
          color: "#94a3b8",
          fontWeight: 500,
        }}
      >
        No media for this step
      </p>
    </div>
  );
}

function RatingDistribution({ ratings }) {
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter((r) => r === star).length,
  }));
  const max = Math.max(...counts.map((c) => c.count), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {counts.map(({ star, count }) => (
        <div
          key={star}
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          <span
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: "#64748b",
              width: 10,
            }}
          >
            {star}
          </span>
          <Star size={12} color="#f59e0b" fill="#f59e0b" />
          <div
            style={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              background: "#e2e8f0",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(count / max) * 100}%` }}
              transition={{
                duration: 0.8,
                delay: (5 - star) * 0.08,
                ease: "easeOut",
              }}
              style={{
                height: "100%",
                borderRadius: 4,
                background: "linear-gradient(90deg,#f59e0b,#fbbf24)",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: "#64748b",
              width: 16,
              textAlign: "right",
            }}
          >
            {count}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main ReceiptDetail ───────────────────────────────────────────────────────
export default function ReceiptDetail() {
  const { receiptId } = useParams();
  const navigate = useNavigate();

  // ── Fetch state ─────────────────────────────────────────────────────────────
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // null | { message }

  // ── Step slider state ────────────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState(new Set([0]));
  const [slideDir, setSlideDir] = useState(1);

  // ── Completion / rating state ────────────────────────────────────────────────
  const [completed, setCompleted] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // ── Fetch on mount / retry ───────────────────────────────────────────────────
  const loadReceipt = () => {
    setLoading(true);
    setError(null);
    fetchReceiptById(receiptId) // ← replace with: getReceiptById(receiptId)
      .then((data) => {
        setReceipt(data);
        setLoading(false);
      })
      .catch((err) => {
        setError({
          message: err.message || "Đã xảy ra lỗi khi tải công thức.",
        });
        setLoading(false);
        toast.error("Không tìm thấy công thức này!");
      });
  };

  useEffect(() => {
    if (!receiptId) {
      setError({ message: "Không tìm thấy receipt ID trong URL." });
      setLoading(false);
      return;
    }
    loadReceipt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiptId]);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <FontLink />
        <LoadingSkeleton />
      </>
    );
  }

  // ── Error / Invalid ID ───────────────────────────────────────────────────────
  if (error || !receipt) {
    return (
      <InvalidReceiptPage
        receiptId={receiptId}
        errorMsg={error?.message}
        onRetry={loadReceipt}
      />
    );
  }

  // ── Normal render ─────────────────────────────────────────────────────────────
  const steps = receipt.steps || [];
  const totalSteps = steps.length;
  const step = steps[currentStep];

  const progress =
    totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0;
  const allVisited = visitedSteps.size === totalSteps;
  const canComplete = allVisited && !completed;
  const avg = avgRating(receipt.rating);
  const totalRatings = receipt.rating?.length || 0;

  const goStep = (next) => {
    if (next < 0 || next >= totalSteps) return;
    setSlideDir(next > currentStep ? 1 : -1);
    setCurrentStep(next);
    setVisitedSteps((prev) => new Set([...prev, next]));
  };

  const handleComplete = () => {
    if (!canComplete) return;
    setCompleted(true);
    toast.success("🎉 Recipe completed! Rate your experience below.");
  };

  const handleSubmitRating = async () => {
    try {
      if (!userRating) {
        toast.error("Please select a star rating first.");
        return;
      }
      const payload = {
        rating: userRating,
      };
      const res = await ratingReceipt(receiptId, payload);
      if (res) {
        toast.success(
          `You rated this recipe ${userRating} star${userRating > 1 ? "s" : ""}. Thank you!`,
        );
        navigate("/");
      } else {
        toast.error("Rating failed! Please try again later!");
      }
      setRatingSubmitted(true);
    } catch (error) {
      console.log(error);
    }
  };

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <>
      <FontLink />

      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(160deg, #f0f7ff 0%, #ffffff 50%, #f8fafc 100%)",
          paddingTop: 88,
          paddingBottom: 80,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          {/* ── Back button ── */}
          <motion.button
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -3 }}
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 28,
              padding: "9px 18px",
              background: "#ffffff",
              border: "1.5px solid #e0e7ff",
              borderRadius: 12,
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: "#1d4ed8",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(30,58,138,0.07)",
            }}
          >
            <ChevronLeft size={16} /> Back to recipes
          </motion.button>

          {/* ── Header card ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background:
                "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%)",
              borderRadius: 24,
              padding: "32px 36px",
              marginBottom: 24,
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 16px 48px rgba(37,99,235,0.28)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 200,
                height: 200,
                background: "rgba(255,255,255,0.06)",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -30,
                left: 60,
                width: 160,
                height: 160,
                background: "rgba(255,255,255,0.04)",
                borderRadius: "50%",
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "5px 13px",
                      background: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      borderRadius: 20,
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#bfdbfe",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: 14,
                    }}
                  >
                    <Sparkles size={11} color="#93c5fd" /> Recipe
                  </span>

                  <h1
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "clamp(26px,5vw,42px)",
                      fontWeight: 800,
                      color: "#ffffff",
                      lineHeight: 1.15,
                      margin: "0 0 16px",
                    }}
                  >
                    {receipt.foodName}
                  </h1>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                    {[
                      { icon: ChefHat, val: receipt.createdByChef?.username },
                      { icon: Clock, val: `${totalSteps} steps` },
                      { icon: Calendar, val: formatDate(receipt.createdAt) },
                    ].map(({ icon: Icon, val }) => (
                      <div
                        key={val}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: "rgba(255,255,255,0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon size={13} color="#93c5fd" />
                        </div>
                        <span
                          style={{
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 13,
                            color: "#bfdbfe",
                          }}
                        >
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Average rating badge */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    borderRadius: 18,
                    padding: "16px 22px",
                    textAlign: "center",
                    minWidth: 110,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: 40,
                      fontWeight: 800,
                      color: "#fff",
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    {avg}
                  </p>
                  <StarRow value={Math.round(Number(avg))} size={14} />
                  <p
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 11,
                      color: "#93c5fd",
                      margin: "5px 0 0",
                    }}
                  >
                    {totalRatings} rating{totalRatings !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Progress bar ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              background: "#ffffff",
              border: "1.5px solid #e0e7ff",
              borderRadius: 18,
              padding: "18px 24px",
              marginBottom: 20,
              boxShadow: "0 4px 16px rgba(30,58,138,0.07)",
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
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: progress === 100 ? "#16a34a" : "#2563eb",
                }}
              >
                {progress}% complete
              </span>
            </div>

            <div
              style={{
                height: 8,
                background: "#e2e8f0",
                borderRadius: 8,
                overflow: "hidden",
                marginBottom: 14,
              }}
            >
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                style={{
                  height: "100%",
                  borderRadius: 8,
                  background:
                    progress === 100
                      ? "linear-gradient(90deg,#16a34a,#22c55e)"
                      : "linear-gradient(90deg,#2563eb,#38bdf8)",
                }}
              />
            </div>

            {/* Step dots */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {steps.map((s, i) => {
                const visited = visitedSteps.has(i);
                const active = i === currentStep;
                return (
                  <motion.button
                    key={s._id}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => goStep(i)}
                    style={{
                      width: active ? 34 : 28,
                      height: 28,
                      borderRadius: 8,
                      border: "none",
                      background: active
                        ? "linear-gradient(135deg,#2563eb,#1d4ed8)"
                        : visited
                          ? "#dbeafe"
                          : "#f1f5f9",
                      cursor: "pointer",
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      color: active ? "#fff" : visited ? "#1d4ed8" : "#94a3b8",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {visited && !active ? (
                      <CheckCircle2 size={13} color="#1d4ed8" />
                    ) : (
                      i + 1
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* ── Step slide card ── */}
          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid #e0e7ff",
              borderRadius: 24,
              overflow: "hidden",
              marginBottom: 24,
              boxShadow: "0 8px 32px rgba(30,58,138,0.09)",
              minHeight: 480,
            }}
          >
            {/* Step ribbon */}
            <div
              style={{
                padding: "18px 28px",
                background: "linear-gradient(90deg,#eff6ff,#f0f7ff)",
                borderBottom: "1px solid #dbeafe",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  boxShadow: "0 4px 10px rgba(37,99,235,0.35)",
                  flexShrink: 0,
                }}
              >
                {currentStep + 1}
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#64748b",
                    margin: 0,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Step {currentStep + 1} / {totalSteps}
                </p>
                <p
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  {step?.stepName}
                </p>
              </div>
            </div>

            {/* Animated slide content */}
            <div style={{ overflow: "hidden" }}>
              <AnimatePresence custom={slideDir} mode="wait">
                <motion.div
                  key={step?._id || currentStep}
                  custom={slideDir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    type: "tween",
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  style={{ padding: "26px 28px 30px" }}
                >
                  <StepMedia image={step?.image} video={step?.video} />

                  <p
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 16,
                      lineHeight: 1.75,
                      color: "#374151",
                      marginTop: 22,
                    }}
                  >
                    {step?.description}
                  </p>

                  {/* Step fields info */}
                  <div
                    style={{
                      marginTop: 20,
                      padding: "14px 18px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#94a3b8",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        margin: "0 0 10px",
                      }}
                    >
                      Step fields
                    </p>
                    {[
                      { label: "Step name", value: step?.stepName },
                      { label: "Description", value: step?.description },
                      {
                        label: "Image",
                        value: step?.image ? "✅ Provided" : "Not provided",
                      },
                      {
                        label: "Video",
                        value: step?.video ? "✅ Provided" : "Not provided",
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "flex-start",
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#64748b",
                            minWidth: 88,
                            paddingTop: 1,
                          }}
                        >
                          {label}
                        </span>
                        <span
                          style={{
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 13,
                            color: "#1e293b",
                            lineHeight: 1.5,
                            wordBreak: "break-word",
                          }}
                        >
                          {value || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 28px",
                borderTop: "1px solid #f1f5f9",
              }}
            >
              <motion.button
                whileHover={{ scale: currentStep > 0 ? 1.03 : 1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => goStep(currentStep - 1)}
                disabled={currentStep === 0}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 20px",
                  background: currentStep === 0 ? "#f1f5f9" : "#ffffff",
                  border: `1.5px solid ${currentStep === 0 ? "#e2e8f0" : "#dbeafe"}`,
                  borderRadius: 12,
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: currentStep === 0 ? "#cbd5e1" : "#1d4ed8",
                  cursor: currentStep === 0 ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                <ArrowLeft size={16} /> Previous
              </motion.button>

              {/* pill dots */}
              <div style={{ display: "flex", gap: 5 }}>
                {steps.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === currentStep ? 20 : 7,
                      height: 7,
                      borderRadius: 4,
                      background:
                        i === currentStep
                          ? "#2563eb"
                          : visitedSteps.has(i)
                            ? "#bfdbfe"
                            : "#e2e8f0",
                      transition: "all 0.3s",
                    }}
                  />
                ))}
              </div>

              {currentStep < totalSteps - 1 ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => goStep(currentStep + 1)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 20px",
                    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                    border: "none",
                    borderRadius: 12,
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#fff",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
                  }}
                >
                  Next <ArrowRight size={16} />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: canComplete ? 1.03 : 1 }}
                  whileTap={{ scale: canComplete ? 0.96 : 1 }}
                  onClick={handleComplete}
                  disabled={!canComplete}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 20px",
                    background: completed
                      ? "linear-gradient(135deg,#16a34a,#15803d)"
                      : canComplete
                        ? "linear-gradient(135deg,#16a34a,#22c55e)"
                        : "#f1f5f9",
                    border: "none",
                    borderRadius: 12,
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    color: canComplete || completed ? "#fff" : "#94a3b8",
                    cursor: canComplete ? "pointer" : "not-allowed",
                    boxShadow: canComplete
                      ? "0 4px 14px rgba(22,163,74,0.35)"
                      : "none",
                    transition: "all 0.3s",
                  }}
                >
                  {completed ? (
                    <>
                      <CheckCircle2 size={16} /> Completed!
                    </>
                  ) : (
                    <>
                      <Trophy size={16} /> Complete Recipe
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>

          {/* ── Rating section ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: "#ffffff",
              border: "1.5px solid #e0e7ff",
              borderRadius: 24,
              overflow: "hidden",
              marginBottom: 24,
              boxShadow: "0 8px 32px rgba(30,58,138,0.08)",
            }}
          >
            <div
              style={{
                padding: "20px 28px",
                background: "linear-gradient(90deg,#eff6ff,#f0f7ff)",
                borderBottom: "1px solid #dbeafe",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#f59e0b,#d97706)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 10px rgba(245,158,11,0.35)",
                }}
              >
                <BarChart2 size={18} color="#fff" />
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Ratings & Reviews
              </h2>
            </div>

            <div style={{ padding: "24px 28px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: 32,
                  alignItems: "start",
                  marginBottom: 28,
                }}
                className="mc-rating-grid"
              >
                {/* Big average */}
                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: 58,
                      fontWeight: 800,
                      color: "#0f172a",
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    {avg}
                  </p>
                  <StarRow value={Math.round(Number(avg))} size={22} />
                  <p
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 13,
                      color: "#64748b",
                      margin: "6px 0 10px",
                    }}
                  >
                    {totalRatings} rating{totalRatings !== 1 ? "s" : ""}
                  </p>
                  {/* Raw rating array chips */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 5,
                      justifyContent: "center",
                    }}
                  >
                    {receipt.rating.map((r, i) => (
                      <span
                        key={i}
                        style={{
                          padding: "2px 8px",
                          background: "#fffbeb",
                          border: "1px solid #fde68a",
                          borderRadius: 6,
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#d97706",
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <Star size={10} color="#f59e0b" fill="#f59e0b" /> {r}
                      </span>
                    ))}
                  </div>
                </div>

                <RatingDistribution ratings={receipt.rating} />
              </div>

              {/* User rating area */}
              <div
                style={{
                  padding: "20px 22px",
                  background: completed ? "#f0fdf4" : "#f8fafc",
                  border: `1.5px solid ${completed ? "#86efac" : "#e2e8f0"}`,
                  borderRadius: 16,
                  transition: "all 0.4s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      background: completed ? "#16a34a" : "#94a3b8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.3s",
                    }}
                  >
                    {completed ? (
                      <Star size={16} color="#fff" />
                    ) : (
                      <Lock size={16} color="#fff" />
                    )}
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#0f172a",
                        margin: 0,
                      }}
                    >
                      {completed
                        ? "Rate this recipe"
                        : "Complete the recipe to unlock rating"}
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 12,
                        color: "#64748b",
                        margin: 0,
                      }}
                    >
                      {completed
                        ? "Your honest feedback helps others."
                        : `Finish all ${totalSteps} steps, then press "Complete Recipe".`}
                    </p>
                  </div>
                </div>

                <AnimatePresence>
                  {completed && !ratingSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 14,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <StarRow
                            value={userRating}
                            size={32}
                            interactive
                            onChange={setUserRating}
                          />
                          {userRating > 0 && (
                            <span
                              style={{
                                fontFamily: "'DM Sans',sans-serif",
                                fontSize: 13,
                                color: "#64748b",
                              }}
                            >
                              {
                                [
                                  "",
                                  "Poor",
                                  "Fair",
                                  "Good",
                                  "Great",
                                  "Excellent!",
                                ][userRating]
                              }
                            </span>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: userRating ? 1.03 : 1 }}
                          whileTap={{ scale: userRating ? 0.97 : 1 }}
                          onClick={handleSubmitRating}
                          style={{
                            alignSelf: "flex-start",
                            padding: "11px 24px",
                            background: userRating
                              ? "linear-gradient(135deg,#f59e0b,#d97706)"
                              : "#e2e8f0",
                            border: "none",
                            borderRadius: 12,
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 14,
                            fontWeight: 700,
                            color: userRating ? "#fff" : "#94a3b8",
                            cursor: userRating ? "pointer" : "not-allowed",
                            boxShadow: userRating
                              ? "0 4px 14px rgba(245,158,11,0.35)"
                              : "none",
                            transition: "all 0.2s",
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                          }}
                        >
                          <Star
                            size={15}
                            color={userRating ? "#fff" : "#94a3b8"}
                            fill={userRating ? "#fff" : "none"}
                          />
                          Submit Rating
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                  {ratingSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 16px",
                        background: "#f0fdf4",
                        border: "1px solid #86efac",
                        borderRadius: 12,
                      }}
                    >
                      <CheckCircle2 size={18} color="#16a34a" />
                      <span
                        style={{
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#166534",
                        }}
                      >
                        You rated {userRating} star{userRating > 1 ? "s" : ""}.
                        Thank you!
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Locked stars */}
                {!completed && (
                  <div
                    style={{
                      display: "flex",
                      gap: 5,
                      marginTop: 4,
                      alignItems: "center",
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={28} color="#d1d5db" fill="#f3f4f6" />
                    ))}
                    <span
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 12,
                        color: "#94a3b8",
                        marginLeft: 8,
                      }}
                    >
                      🔒 Locked
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Receipt meta info ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: "#ffffff",
              border: "1.5px solid #e0e7ff",
              borderRadius: 20,
              padding: "22px 28px",
              boxShadow: "0 4px 16px rgba(30,58,138,0.06)",
            }}
          >
            <h3
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 17,
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: 16,
              }}
            >
              Recipe Info
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: "12px 24px",
              }}
              className="mc-info-grid"
            >
              {[
                { label: "Recipe Name", value: receipt.foodName },
                { label: "Chef", value: receipt.createdByChef?.username },
                { label: "Total Steps", value: `${totalSteps} steps` },
                {
                  label: "Total Ratings",
                  value: `${totalRatings} rating${totalRatings !== 1 ? "s" : ""}`,
                },
                { label: "Average Score", value: `${avg} / 5` },
                { label: "Created", value: formatDate(receipt.createdAt) },
                { label: "Last Updated", value: formatDate(receipt.updatedAt) },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#1e293b",
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 640px) {
          .mc-rating-grid { grid-template-columns: 1fr !important; }
          .mc-info-grid   { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
