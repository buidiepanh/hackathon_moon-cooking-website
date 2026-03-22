import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Search,
  Star,
  Clock,
  ChefHat,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Bot,
  Utensils,
  Users,
  TrendingUp,
  Heart,
  Eye,
  BookOpen,
  X,
  Send,
  Award,
  Flame,
  Leaf,
  Calendar,
} from "lucide-react";

// ─── Fonts ────────────────────────────────────────────────────────────────────
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,400&family=DM+Sans:wght@400;500;600&display=swap"
    rel="stylesheet"
  />
);

// ─── Mock recipe data (matching BE shape) ────────────────────────────────────
const RECIPES = [
  {
    _id: "69be139d0a7ee61a96a15887",
    foodName: "Mixed Salad",
    createdByChef: "Chef Maria Santos",
    steps: ["Wash and chop all vegetables", "Toss with lemon vinaigrette"],
    createdAt: "2026-03-21T03:42:21.124Z",
    updatedAt: "2026-03-21T03:42:21.124Z",
    rating: 4.8,
    reviews: 284,
    cookTime: "15 min",
    category: "Healthy",
    calories: 180,
    tags: ["Vegan", "Low-cal"],
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    featured: true,
  },
  {
    _id: "69be139d0a7ee61a96a15888",
    foodName: "Grilled Salmon",
    createdByChef: "Chef James Park",
    steps: [
      "Marinate salmon with herbs",
      "Grill 6 min each side",
      "Serve with lemon",
    ],
    createdAt: "2026-03-19T10:15:00.000Z",
    updatedAt: "2026-03-19T10:15:00.000Z",
    rating: 4.9,
    reviews: 512,
    cookTime: "25 min",
    category: "Seafood",
    calories: 320,
    tags: ["High-protein", "Omega-3"],
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
    featured: true,
  },
  {
    _id: "69be139d0a7ee61a96a15889",
    foodName: "Avocado Toast",
    createdByChef: "Chef Lucy Chen",
    steps: [
      "Toast sourdough bread",
      "Mash avocado with seasoning",
      "Top with poached egg",
    ],
    createdAt: "2026-03-18T08:00:00.000Z",
    updatedAt: "2026-03-18T08:00:00.000Z",
    rating: 4.6,
    reviews: 198,
    cookTime: "10 min",
    category: "Breakfast",
    calories: 250,
    tags: ["Vegetarian", "Quick"],
    image:
      "https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=600&q=80",
    featured: true,
  },
  {
    _id: "69be139d0a7ee61a96a15890",
    foodName: "Beef Ramen",
    createdByChef: "Chef Kenji Tanaka",
    steps: [
      "Simmer broth 4 hours",
      "Cook ramen noodles",
      "Add chashu & soft egg",
    ],
    createdAt: "2026-03-17T14:30:00.000Z",
    updatedAt: "2026-03-17T14:30:00.000Z",
    rating: 4.7,
    reviews: 367,
    cookTime: "4 hrs",
    category: "Japanese",
    calories: 580,
    tags: ["Comfort", "Umami"],
    image:
      "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80",
    featured: false,
  },
  {
    _id: "69be139d0a7ee61a96a15891",
    foodName: "Mango Smoothie Bowl",
    createdByChef: "Chef Sofia Rivera",
    steps: [
      "Blend frozen mango until smooth",
      "Pour into bowl",
      "Top with granola & fruits",
    ],
    createdAt: "2026-03-16T09:00:00.000Z",
    updatedAt: "2026-03-16T09:00:00.000Z",
    rating: 4.5,
    reviews: 143,
    cookTime: "5 min",
    category: "Breakfast",
    calories: 290,
    tags: ["Vegan", "Fruity"],
    image:
      "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=600&q=80",
    featured: false,
  },
  {
    _id: "69be139d0a7ee61a96a15892",
    foodName: "Margherita Pizza",
    createdByChef: "Chef Marco Bianchi",
    steps: [
      "Prepare and rest dough",
      "Spread tomato sauce",
      "Add mozzarella",
      "Bake 450°F",
    ],
    createdAt: "2026-03-15T18:00:00.000Z",
    updatedAt: "2026-03-15T18:00:00.000Z",
    rating: 4.8,
    reviews: 621,
    cookTime: "40 min",
    category: "Italian",
    calories: 420,
    tags: ["Classic", "Vegetarian"],
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80",
    featured: false,
  },
];

const FEATURED = RECIPES.filter((r) => r.featured);

const STATS = [
  { icon: Utensils, value: "12,000+", label: "Recipes", bg: "#2563eb" },
  { icon: ChefHat, value: "850+", label: "Expert Chefs", bg: "#4f46e5" },
  { icon: Users, value: "2.4M", label: "Happy Cooks", bg: "#0891b2" },
  { icon: TrendingUp, value: "98%", label: "Satisfaction", bg: "#0284c7" },
];

const AI_REPLIES = [
  "For a balanced diet, try the Mixed Salad — it's packed with vitamins A, C, and K. Pair with grilled salmon for complete nutrition! 🥗",
  "To reduce processed sugar, swap sugary drinks with smoothie bowls sweetened with natural mango. Delicious and healthier! 🥭",
  "For weight management, high-fiber, low-calorie meals are key. Our Mixed Salad has only 180 kcal and keeps you full for hours! 💪",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Stars({ rating }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          color={s <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}
          fill={s <= Math.round(rating) ? "#f59e0b" : "#f3f4f6"}
        />
      ))}
    </div>
  );
}

// ─── Recipe Card ─────────────────────────────────────────────────────────────
function RecipeCard({ recipe, index, onView }) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: "#ffffff",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: hovered
          ? "0 16px 48px rgba(37,99,235,0.18)"
          : "0 4px 20px rgba(30,58,138,0.08)",
        border: "1px solid #e0e7ff",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
        <img
          src={recipe.image}
          alt={recipe.foodName}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.5s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
          }}
        />
        {/* Category badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            padding: "4px 10px",
            background: "#1d4ed8",
            borderRadius: 8,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: "#ffffff",
            letterSpacing: "0.04em",
          }}
        >
          {recipe.category}
        </div>
        {/* Like */}
        <button
          onClick={() => setLiked(!liked)}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 32,
            height: 32,
            background: "rgba(255,255,255,0.92)",
            border: "none",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
        >
          <Heart
            size={15}
            color={liked ? "#ef4444" : "#94a3b8"}
            fill={liked ? "#ef4444" : "none"}
          />
        </button>
        {/* Bottom info */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 12,
            right: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: "#ffffff",
              fontWeight: 500,
            }}
          >
            <Flame size={12} color="#fb923c" fill="#fb923c" /> {recipe.calories} kcal
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: "#ffffff",
              fontWeight: 500,
            }}
          >
            <Clock size={12} color="#ffffff" /> {recipe.cookTime}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 18px 18px" }}>
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 17,
            fontWeight: 700,
            color: hovered ? "#1d4ed8" : "#1e293b",
            marginBottom: 4,
            transition: "color 0.2s",
          }}
        >
          {recipe.foodName}
        </h3>

        <p
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: "#64748b",
            marginBottom: 10,
          }}
        >
          <ChefHat size={12} color="#64748b" /> {recipe.createdByChef}
        </p>

        {/* Steps preview */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: "#94a3b8",
            marginBottom: 10,
            lineHeight: 1.5,
          }}
        >
          {recipe.steps[0]}...
        </p>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: "3px 9px",
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: 6,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: "#1d4ed8",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Date */}
        <p
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            color: "#94a3b8",
            marginBottom: 12,
          }}
        >
          <Calendar size={11} color="#94a3b8" /> {formatDate(recipe.createdAt)}
        </p>

        {/* Rating + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Stars rating={recipe.rating} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#64748b" }}>
              <strong style={{ color: "#1e293b" }}>{recipe.rating}</strong> · {recipe.reviews} reviews
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onView(recipe)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 16px",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              border: "none",
              borderRadius: 10,
              color: "#ffffff",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
            }}
          >
            <BookOpen size={13} /> View Recipe
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── AI Chat Widget ───────────────────────────────────────────────────────────
function AIChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    {
      role: "ai",
      text: "👋 Hi! I'm your AI nutrition advisor. Ask me anything about healthy eating!",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  const send = () => {
    if (!input.trim()) return;
    setMsgs((p) => [...p, { role: "user", text: input }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((p) => [
        ...p,
        { role: "ai", text: AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)] },
      ]);
      setTyping(false);
    }, 1400);
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 200,
          width: 56,
          height: 56,
          background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
          border: "none",
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(37,99,235,0.5)",
        }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} color="#fff" />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Bot size={22} color="#fff" />
            </motion.div>
          )}
        </AnimatePresence>
        <span
          style={{
            position: "absolute",
            top: -3,
            right: -3,
            width: 14,
            height: 14,
            background: "#22c55e",
            borderRadius: "50%",
            border: "2px solid #fff",
          }}
        />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 16 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            style={{
              position: "fixed",
              bottom: 96,
              right: 28,
              zIndex: 200,
              width: 320,
              background: "#ffffff",
              borderRadius: 20,
              boxShadow: "0 20px 60px rgba(30,58,138,0.22)",
              border: "1px solid #dbeafe",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={18} color="#ffffff" />
              </div>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#ffffff", margin: 0 }}>
                  Nutrition AI
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#bfdbfe", margin: 0, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 7, height: 7, background: "#4ade80", borderRadius: "50%", display: "inline-block" }} /> Online now
                </p>
              </div>
            </div>

            {/* Messages */}
            <div
              style={{
                height: 240,
                overflowY: "auto",
                padding: 14,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                background: "#f8fafc",
              }}
            >
              {msgs.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div
                    style={{
                      maxWidth: "84%",
                      padding: "9px 13px",
                      borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      background: m.role === "user" ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "#ffffff",
                      color: m.role === "user" ? "#ffffff" : "#1e293b",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      lineHeight: 1.5,
                      boxShadow: m.role === "ai" ? "0 2px 8px rgba(30,58,138,0.08)" : "none",
                      border: m.role === "ai" ? "1px solid #e0e7ff" : "none",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div
                    style={{
                      padding: "10px 14px",
                      background: "#ffffff",
                      border: "1px solid #e0e7ff",
                      borderRadius: "14px 14px 14px 4px",
                      display: "flex",
                      gap: 5,
                      alignItems: "center",
                      boxShadow: "0 2px 8px rgba(30,58,138,0.08)",
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        style={{ width: 7, height: 7, background: "#3b82f6", borderRadius: "50%", display: "inline-block" }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.55, delay: i * 0.13, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: "10px 12px", borderTop: "1px solid #e0e7ff", background: "#ffffff", display: "flex", gap: 8 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about nutrition..."
                style={{
                  flex: 1,
                  padding: "9px 12px",
                  background: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: "#1e293b",
                  outline: "none",
                }}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={send}
                style={{
                  width: 36,
                  height: 36,
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  border: "none",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <Send size={15} color="#ffffff" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── PublicPage ───────────────────────────────────────────────────────────────
export default function PublicPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [carIdx, setCarIdx] = useState(0);
  const [dir, setDir] = useState(1);

  // Carousel auto-play
  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setCarIdx((i) => (i + 1) % FEATURED.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const goCar = (next) => {
    setDir(next > carIdx ? 1 : -1);
    setCarIdx(next);
  };

  // ── Auth-aware view handler ──────────────────────────────────────────────
  const handleView = (recipe) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      // Logged in → go to receipt detail
      navigate(`/receipt-detail/${recipe._id}`);
    } else {
      // Not logged in → toast warning then redirect to login
      toast.error("Please sign in to view the full recipe! 🔐", {
        duration: 3000,
      });
      setTimeout(() => navigate("/login"), 1300);
    }
  };

  const filtered = RECIPES.filter(
    (r) =>
      r.foodName.toLowerCase().includes(query.toLowerCase()) ||
      r.category.toLowerCase().includes(query.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())),
  ).sort((a, b) => b.rating - a.rating);

  const slide = FEATURED[carIdx];

  const variants = {
    enter: (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <>
      <FontLink />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          background: "linear-gradient(145deg, #0f172a 0%, #1e3a8a 45%, #1e40af 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          paddingTop: 80,
        }}
      >
        {/* BG blobs */}
        <div style={{ position: "absolute", top: 80, left: 80, width: 360, height: 360, background: "rgba(59,130,246,0.18)", borderRadius: "50%", filter: "blur(90px)" }} />
        <div style={{ position: "absolute", bottom: 60, right: 60, width: 440, height: 440, background: "rgba(99,102,241,0.14)", borderRadius: "50%", filter: "blur(100px)" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle, #93c5fd 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

        <div style={{ position: "relative", textAlign: "center", maxWidth: 780, padding: "0 28px", zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: 100,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: "#bfdbfe",
              marginBottom: 28,
            }}
          >
            <Sparkles size={14} color="#fbbf24" />
            AI-Powered Nutrition Guidance
            <Sparkles size={14} color="#fbbf24" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(40px, 7vw, 72px)",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.12,
              marginBottom: 22,
            }}
          >
            Cook with{" "}
            <span style={{ fontStyle: "italic", color: "#93c5fd" }}>Moon</span>
            <br />& Eat Healthy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 18,
              color: "#93c5fd",
              lineHeight: 1.65,
              marginBottom: 36,
              maxWidth: 560,
              margin: "0 auto 36px",
            }}
          >
            Discover chef-crafted recipes, get AI nutrition advice, and build healthy eating habits — all in one place.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.32 }}
            style={{ maxWidth: 560, margin: "0 auto 20px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.1)",
                border: "1.5px solid rgba(255,255,255,0.25)",
                borderRadius: 16,
                padding: "6px 6px 6px 16px",
                backdropFilter: "blur(12px)",
                gap: 10,
              }}
            >
              <Search size={18} color="#93c5fd" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search recipes, cuisines, ingredients..."
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  color: "#ffffff",
                }}
              />
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: "10px 22px",
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  border: "none",
                  borderRadius: 12,
                  color: "#ffffff",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(37,99,235,0.5)",
                }}
              >
                Search
              </motion.button>
            </div>

            {/* Suggestions */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 14 }}>
              {["Salad", "Pasta", "Seafood", "Breakfast", "Vegan"].map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  style={{
                    padding: "5px 14px",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    borderRadius: 100,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: "#bfdbfe",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}
          >
            <motion.a
              href="#recipes"
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 28px",
                background: "#ffffff",
                borderRadius: 14,
                color: "#1d4ed8",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 8px 24px rgba(255,255,255,0.15)",
              }}
            >
              Explore Recipes <ArrowRight size={16} />
            </motion.a>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}
        >
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(147,197,253,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            scroll
          </span>
          <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom, rgba(147,197,253,0.4), transparent)", margin: "6px auto 0" }} />
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section style={{ background: "#ffffff", borderBottom: "1px solid #e0e7ff", padding: "40px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }} className="mc-stats-grid">
          {STATS.map(({ icon: Icon, value, label, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09 }}
              style={{ textAlign: "center" }}
            >
              <div style={{ width: 52, height: 52, background: bg, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", boxShadow: `0 6px 18px ${bg}55` }}>
                <Icon size={24} color="#ffffff" />
              </div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 2px" }}>{value}</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#64748b", margin: 0 }}>{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CAROUSEL ──────────────────────────────────────────────────────── */}
      <section style={{ background: "#f0f7ff", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#2563eb", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
              <Award size={13} /> Featured Recipes
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Chef's Highlights
            </h2>
          </div>

          <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", height: 460, boxShadow: "0 20px 60px rgba(30,58,138,0.2)" }}>
            <AnimatePresence custom={dir} mode="popLayout">
              <motion.div
                key={carIdx}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "tween", duration: 0.48, ease: "easeInOut" }}
                style={{ position: "absolute", inset: 0 }}
              >
                <img src={slide.image} alt={slide.foodName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)" }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
                  <div style={{ maxWidth: 480, padding: "0 52px" }}>
                    <span style={{ display: "inline-block", padding: "5px 12px", background: "#1d4ed8", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "#ffffff", letterSpacing: "0.04em", marginBottom: 16 }}>
                      {slide.category}
                    </span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, color: "#ffffff", lineHeight: 1.15, marginBottom: 10 }}>
                      {slide.foodName}
                    </h3>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#bfdbfe", marginBottom: 10, display: "flex", alignItems: "center", gap: 7 }}>
                      <ChefHat size={14} color="#93c5fd" /> {slide.createdByChef}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                      <Stars rating={slide.rating} />
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.75)" }}>
                        {slide.rating} · {slide.reviews} reviews
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
                      {slide.tags.map((t) => (
                        <span key={t} style={{ padding: "4px 12px", background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#ffffff" }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleView(slide)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "12px 24px",
                        background: "#ffffff",
                        border: "none",
                        borderRadius: 14,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#1d4ed8",
                        cursor: "pointer",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                      }}
                    >
                      <Eye size={16} /> View Recipe
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Arrows */}
            {[
              { side: "left", icon: ArrowLeft, onClick: () => goCar((carIdx - 1 + FEATURED.length) % FEATURED.length) },
              { side: "right", icon: ArrowRight, onClick: () => goCar((carIdx + 1) % FEATURED.length) },
            ].map(({ side, icon: Icon, onClick }) => (
              <button
                key={side}
                onClick={onClick}
                style={{
                  position: "absolute",
                  top: "50%",
                  [side]: 16,
                  transform: "translateY(-50%)",
                  width: 42,
                  height: 42,
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.35)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                  zIndex: 10,
                }}
              >
                <Icon size={18} color="#ffffff" />
              </button>
            ))}

            {/* Dots */}
            <div style={{ position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 7, zIndex: 10 }}>
              {FEATURED.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goCar(i)}
                  style={{
                    border: "none",
                    cursor: "pointer",
                    borderRadius: 100,
                    background: "rgba(255,255,255,0.9)",
                    padding: 0,
                    width: i === carIdx ? 24 : 8,
                    height: 8,
                    opacity: i === carIdx ? 1 : 0.4,
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TOP RATED RECIPES ─────────────────────────────────────────────── */}
      <section id="recipes" style={{ background: "#ffffff", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#2563eb", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                <TrendingUp size={13} /> Top Rated
              </span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 800, color: "#0f172a", margin: "6px 0 0" }}>
                {query ? `Results for "${query}"` : "Most Loved Recipes"}
              </h2>
            </motion.div>
            <a href="/foods" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#2563eb", textDecoration: "none" }}>
              View all <ArrowRight size={15} />
            </a>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0", color: "#94a3b8" }}>
              <Search size={44} color="#cbd5e1" style={{ margin: "0 auto 16px", display: "block" }} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16 }}>No recipes found for "{query}"</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="mc-recipe-grid">
              {filtered.map((r, i) => (
                <RecipeCard key={r._id} recipe={r} index={i} onView={handleView} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── AI SECTION ────────────────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(145deg, #0f172a 0%, #1e3a8a 60%, #1e40af 100%)", padding: "80px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 20, right: 40, width: 300, height: 300, background: "rgba(59,130,246,0.12)", borderRadius: "50%", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: 20, left: 40, width: 250, height: 250, background: "rgba(99,102,241,0.1)", borderRadius: "50%", filter: "blur(70px)" }} />
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#93c5fd", marginBottom: 24 }}>
              <Bot size={14} color="#93c5fd" /> AI-Powered Health Advisor
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, color: "#ffffff", marginBottom: 16 }}>
              Your Personal <span style={{ fontStyle: "italic", color: "#93c5fd" }}>Nutrition</span> Coach
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#93c5fd", maxWidth: 560, margin: "0 auto 44px", lineHeight: 1.65 }}>
              Get personalized meal recommendations, calorie insights, and healthy eating tips — powered by AI, tailored for you.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="mc-ai-grid">
              {[
                { icon: Leaf, title: "Smart Meal Planning", desc: "AI suggests meals based on your dietary goals and preferences." },
                { icon: Flame, title: "Calorie Intelligence", desc: "Understand nutritional content of every recipe at a glance." },
                { icon: Sparkles, title: "Personalized Tips", desc: "Daily healthy eating tips crafted for your lifestyle and goals." },
              ].map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, padding: "24px 22px", textAlign: "left" }}
                >
                  <div style={{ width: 42, height: 42, background: "rgba(59,130,246,0.25)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <Icon size={20} color="#93c5fd" />
                  </div>
                  <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#ffffff", marginBottom: 8 }}>{title}</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#93c5fd", lineHeight: 1.6, margin: 0 }}>{desc}</p>
                </motion.div>
              ))}
            </div>
            <p style={{ marginTop: 28, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              <Bot size={15} color="#60a5fa" /> Try the AI Advisor → click the blue chat button in the bottom right
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────────────── */}
      <section id="about" style={{ background: "#f0f7ff", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="mc-about-grid">
          <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span style={{ display: "inline-block", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#2563eb", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
              About MoonCooking
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 800, color: "#0f172a", lineHeight: 1.2, marginBottom: 18 }}>
              Where Culinary Art Meets <span style={{ color: "#1d4ed8", fontStyle: "italic" }}>Healthy Living</span>
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#475569", lineHeight: 1.72, marginBottom: 16 }}>
              MoonCooking is your all-in-one culinary platform where professional chefs share their finest recipes, home cooks discover new favorites, and AI helps you eat smarter every day.
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#475569", lineHeight: 1.72, marginBottom: 28 }}>
              Our platform empowers chefs to manage restaurant reservations, publish step-by-step recipes, and build their audience — while giving food lovers the tools to cook with confidence.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { label: "For Home Cooks", desc: "Browse thousands of rated recipes from professional chefs." },
                { label: "For Chefs", desc: "Upload recipes, manage your restaurant & grow your brand." },
                { label: "AI Advisor", desc: "Get personalized nutrition advice and healthy meal ideas." },
                { label: "Community", desc: "Rate, review, and share your culinary discoveries." },
              ].map(({ label, desc }) => (
                <div key={label} style={{ background: "#ffffff", borderRadius: 14, padding: "14px 16px", border: "1px solid #dbeafe", boxShadow: "0 2px 8px rgba(30,58,138,0.06)" }}>
                  <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 5 }}>{label}</h4>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#64748b", lineHeight: 1.55, margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", mt: 0 },
              { src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80", mt: 24 },
              { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80", mt: 0 },
              { src: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&q=80", mt: -24 },
            ].map(({ src, mt }, i) => (
              <motion.div key={i} whileHover={{ scale: 1.03 }} style={{ borderRadius: 18, overflow: "hidden", marginTop: mt, boxShadow: "0 6px 24px rgba(30,58,138,0.14)" }}>
                <img src={src} alt="cooking" style={{ width: "100%", height: 176, objectFit: "cover", display: "block" }} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section style={{ background: "#ffffff", padding: "64px 32px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #1e40af 100%)",
              borderRadius: 28,
              padding: "56px 40px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(37,99,235,0.4)",
            }}
          >
            <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, background: "rgba(255,255,255,0.06)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 800, color: "#ffffff", marginBottom: 14 }}>
                Ready to Start Cooking?
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#bfdbfe", marginBottom: 32, maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.65 }}>
                Join 2.4 million cooks, get AI nutrition advice, and unlock thousands of chef-crafted recipes today.
              </p>
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login")}
                style={{
                  padding: "16px 36px",
                  background: "#ffffff",
                  border: "none",
                  borderRadius: 16,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#1d4ed8",
                  cursor: "pointer",
                  boxShadow: "0 8px 28px rgba(0,0,0,0.2)",
                }}
              >
                Get Started — It's Free
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Chat Widget */}
      <AIChat />

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 900px) {
          .mc-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .mc-recipe-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .mc-ai-grid { grid-template-columns: 1fr !important; }
          .mc-about-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .mc-recipe-grid { grid-template-columns: 1fr !important; }
          .mc-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: rgba(147,197,253,0.55); }
      `}</style>
    </>
  );
}