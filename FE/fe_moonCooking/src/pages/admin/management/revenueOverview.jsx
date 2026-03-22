import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart2,
  TrendingUp,
  DollarSign,
  Users,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
} from "lucide-react";

// ─── Mock revenue data ────────────────────────────────────────────────────────
const MONTHLY_DATA = [
  { month: "Oct", revenue: 3200000, subs: 16 },
  { month: "Nov", revenue: 4100000, subs: 20 },
  { month: "Dec", revenue: 3800000, subs: 19 },
  { month: "Jan", revenue: 5200000, subs: 26 },
  { month: "Feb", revenue: 6100000, subs: 30 },
  { month: "Mar", revenue: 7400000, subs: 37 },
];

const MOCK_TRANSACTIONS = [
  {
    _id: "tx001",
    user: "Tu Xuan Thinh",
    plan: "Pro package for chef",
    amount: 500000,
    date: "2026-03-21T10:00:00Z",
    status: "success",
  },
  {
    _id: "tx002",
    user: "BABY CUTE SONAMLP",
    plan: "Basic package for chef",
    amount: 200000,
    date: "2026-03-20T14:30:00Z",
    status: "success",
  },
  {
    _id: "tx003",
    user: "Chef Maria Santos",
    plan: "Enterprise package",
    amount: 1200000,
    date: "2026-03-19T09:15:00Z",
    status: "success",
  },
  {
    _id: "tx004",
    user: "Nguyen Van A",
    plan: "Basic package for chef",
    amount: 200000,
    date: "2026-03-18T16:45:00Z",
    status: "failed",
  },
  {
    _id: "tx005",
    user: "Tran Thi B",
    plan: "Pro package for chef",
    amount: 500000,
    date: "2026-03-17T11:00:00Z",
    status: "success",
  },
  {
    _id: "tx006",
    user: "Le Van C",
    plan: "Basic package for chef",
    amount: 200000,
    date: "2026-03-16T08:30:00Z",
    status: "pending",
  },
];

const formatPrice = (p) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    p,
  );

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const STATUS_STYLE = {
  success: {
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#86efac",
    label: "Success",
  },
  failed: {
    color: "#dc2626",
    bg: "#fff5f5",
    border: "#fecaca",
    label: "Failed",
  },
  pending: {
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    label: "Pending",
  },
};

// ─── Mini bar chart ───────────────────────────────────────────────────────────
function MiniBarChart({ data }) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 8,
        height: 100,
        padding: "0 4px",
      }}
    >
      {data.map((d, i) => {
        const heightPct = (d.revenue / maxRevenue) * 100;
        const isLast = i === data.length - 1;
        return (
          <div
            key={d.month}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${heightPct}%` }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
              style={{
                width: "100%",
                borderRadius: "4px 4px 0 0",
                background: isLast
                  ? "linear-gradient(180deg,#dc2626,#b91c1c)"
                  : "linear-gradient(180deg,#fca5a5,#f87171)",
                minHeight: 4,
              }}
            />
            <span
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 10,
                color: isLast ? "#dc2626" : "#94a3b8",
                fontWeight: isLast ? 700 : 400,
              }}
            >
              {d.month}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── RevenueOverview ──────────────────────────────────────────────────────────
export default function RevenueOverview() {
  const [period, setPeriod] = useState("6m");

  const totalRevenue = MONTHLY_DATA.reduce((s, d) => s + d.revenue, 0);
  const currentMonth = MONTHLY_DATA[MONTHLY_DATA.length - 1];
  const prevMonth = MONTHLY_DATA[MONTHLY_DATA.length - 2];
  const growthPct = (
    ((currentMonth.revenue - prevMonth.revenue) / prevMonth.revenue) *
    100
  ).toFixed(1);
  const isGrowthPositive = Number(growthPct) >= 0;
  const totalSubs = MONTHLY_DATA.reduce((s, d) => s + d.subs, 0);
  const successCount = MOCK_TRANSACTIONS.filter(
    (t) => t.status === "success",
  ).length;

  return (
    <div>
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 28,
              fontWeight: 800,
              color: "#0f172a",
              margin: 0,
            }}
          >
            Revenue Overview
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 14,
              color: "#64748b",
              margin: "4px 0 0",
            }}
          >
            Track platform earnings and subscription performance
          </p>
        </div>

        {/* Period selector */}
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "#f1f5f9",
            borderRadius: 12,
            padding: 4,
          }}
        >
          {["1m", "3m", "6m", "1y"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: "7px 14px",
                background: period === p ? "#fff" : "transparent",
                border: "none",
                borderRadius: 9,
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 13,
                fontWeight: period === p ? 700 : 500,
                color: period === p ? "#dc2626" : "#64748b",
                cursor: "pointer",
                boxShadow: period === p ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.2s",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
          marginBottom: 28,
        }}
        className="rev-stats"
      >
        {[
          {
            icon: DollarSign,
            label: "Total Revenue (6M)",
            value: formatPrice(totalRevenue),
            sub: null,
            color: "#dc2626",
            bg: "#fff5f5",
          },
          {
            icon: TrendingUp,
            label: "This Month",
            value: formatPrice(currentMonth.revenue),
            sub: {
              val: `${isGrowthPositive ? "+" : ""}${growthPct}%`,
              up: isGrowthPositive,
            },
            color: "#2563eb",
            bg: "#eff6ff",
          },
          {
            icon: Users,
            label: "Total Subscriptions",
            value: totalSubs,
            sub: null,
            color: "#7c3aed",
            bg: "#f5f3ff",
          },
          {
            icon: CreditCard,
            label: "Successful Txns",
            value: `${successCount} / ${MOCK_TRANSACTIONS.length}`,
            sub: null,
            color: "#16a34a",
            bg: "#f0fdf4",
          },
        ].map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div
            key={label}
            style={{
              background: "#fff",
              border: "1.5px solid #f1f5f9",
              borderRadius: 18,
              padding: "18px 20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  background: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={18} color={color} />
              </div>
              {sub && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3,
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: sub.up ? "#16a34a" : "#dc2626",
                  }}
                >
                  {sub.up ? (
                    <ArrowUpRight size={13} />
                  ) : (
                    <ArrowDownRight size={13} />
                  )}
                  {sub.val} vs last month
                </span>
              )}
            </div>
            <p
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: sub ? 18 : 22,
                fontWeight: 800,
                color: "#0f172a",
                margin: "0 0 2px",
                wordBreak: "break-word",
              }}
            >
              {value}
            </p>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 12,
                color: "#64748b",
                margin: 0,
              }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 28,
        }}
        className="rev-charts"
      >
        {/* Monthly revenue bar chart */}
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #f1f5f9",
            borderRadius: 18,
            padding: "20px 22px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Monthly Revenue
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 12,
                  color: "#64748b",
                  margin: "2px 0 0",
                }}
              >
                Last 6 months
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 10px",
                background: "#fff5f5",
                border: "1px solid #fecaca",
                borderRadius: 8,
              }}
            >
              <BarChart2 size={13} color="#dc2626" />
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#dc2626",
                }}
              >
                VND
              </span>
            </div>
          </div>
          <MiniBarChart data={MONTHLY_DATA} />
          {/* X-axis values */}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {MONTHLY_DATA.map((d) => (
              <div key={d.month} style={{ flex: 1, textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 9,
                    color: "#64748b",
                    margin: 0,
                  }}
                >
                  {(d.revenue / 1000000).toFixed(1)}M
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription growth */}
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #f1f5f9",
            borderRadius: 18,
            padding: "20px 22px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <p
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 16,
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
              }}
            >
              Subscription Growth
            </p>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 12,
                color: "#64748b",
                margin: "2px 0 0",
              }}
            >
              New subscriptions per month
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MONTHLY_DATA.map((d, i) => {
              const pct =
                (d.subs / Math.max(...MONTHLY_DATA.map((x) => x.subs))) * 100;
              const isLast = i === MONTHLY_DATA.length - 1;
              return (
                <div
                  key={d.month}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#64748b",
                      width: 28,
                    }}
                  >
                    {d.month}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 8,
                      background: "#f1f5f9",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.08,
                        ease: "easeOut",
                      }}
                      style={{
                        height: "100%",
                        borderRadius: 4,
                        background: isLast
                          ? "linear-gradient(90deg,#dc2626,#ef4444)"
                          : "linear-gradient(90deg,#fca5a5,#f87171)",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 12,
                      fontWeight: isLast ? 700 : 500,
                      color: isLast ? "#dc2626" : "#64748b",
                      width: 20,
                      textAlign: "right",
                    }}
                  >
                    {d.subs}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transaction table */}
      <div
        style={{
          background: "#fff",
          border: "1.5px solid #f1f5f9",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            padding: "18px 22px",
            borderBottom: "1px solid #f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 17,
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
              }}
            >
              Recent Transactions
            </p>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 12,
                color: "#64748b",
                margin: "2px 0 0",
              }}
            >
              Latest subscription payments
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 13px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 9,
              cursor: "pointer",
            }}
          >
            <Filter size={13} color="#64748b" />
            <span
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: "#64748b",
              }}
            >
              Filter
            </span>
          </div>
        </div>

        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 2fr 1.2fr 1fr 0.8fr",
            background: "#f8fafc",
            borderBottom: "1px solid #f1f5f9",
            padding: "11px 22px",
          }}
        >
          {["User", "Plan", "Amount", "Date", "Status"].map((h) => (
            <span
              key={h}
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {MOCK_TRANSACTIONS.map((tx, i) => {
          const st = STATUS_STYLE[tx.status];
          return (
            <motion.div
              key={tx._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 2fr 1.2fr 1fr 0.8fr",
                padding: "13px 22px",
                borderBottom:
                  i < MOCK_TRANSACTIONS.length - 1
                    ? "1px solid #f8fafc"
                    : "none",
                alignItems: "center",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fafafa")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <div>
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#0f172a",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tx.user}
                </p>
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 10,
                    color: "#94a3b8",
                    margin: "1px 0 0",
                  }}
                >
                  #{tx._id}
                </p>
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13,
                  color: "#475569",
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  paddingRight: 12,
                }}
              >
                {tx.plan}
              </p>
              <p
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                {formatPrice(tx.amount)}
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 12,
                  color: "#64748b",
                  margin: 0,
                }}
              >
                {formatDate(tx.date)}
              </p>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "3px 10px",
                  background: st.bg,
                  border: `1px solid ${st.border}`,
                  borderRadius: 6,
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: st.color,
                }}
              >
                {st.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .rev-stats  { grid-template-columns: repeat(2,1fr) !important; }
          .rev-charts { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .rev-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
