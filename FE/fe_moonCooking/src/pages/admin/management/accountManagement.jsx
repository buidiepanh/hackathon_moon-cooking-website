import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Users,
  Search,
  UserCheck,
  UserX,
  ChefHat,
  ShieldCheck,
  Eye,
  Ban,
  Phone,
  Mail,
  Calendar,
  Hash,
  RefreshCw,
  CheckCircle,
  X,
  Lock,
} from "lucide-react";
import { getAllUsers } from "../../../services/apiServices";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatDateTime = (iso) =>
  new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const ROLE_STYLE = {
  USER: { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  CHEF: { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  ADMIN: { color: "#dc2626", bg: "#fff5f5", border: "#fecaca" },
};

const RoleIcon = ({ role, size = 10 }) => {
  if (role === "CHEF") return <ChefHat size={size} />;
  if (role === "ADMIN") return <ShieldCheck size={size} />;
  return <Users size={size} />;
};

function Avatar({ name, size = 36, fontSize = 13, role }) {
  const initials = (name || "U")
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const gradients = {
    ADMIN: "linear-gradient(135deg,#dc2626,#b91c1c)",
    CHEF: "linear-gradient(135deg,#d97706,#b45309)",
    USER: "linear-gradient(135deg,#2563eb,#1d4ed8)",
  };
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: gradients[role] ?? gradients.USER,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans',sans-serif",
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

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ user, onClose }) {
  if (!user) return null;
  const rs = ROLE_STYLE[user.role] ?? ROLE_STYLE.USER;

  return (
    <AnimatePresence>
      {user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 24 }}
            transition={{ type: "spring", damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 22,
              width: "100%",
              maxWidth: 480,
              boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
              overflow: "hidden",
            }}
          >
            {/* Header gradient */}
            <div
              style={{
                background: "linear-gradient(135deg,#0f172a,#1e3a8a)",
                padding: "24px 24px 20px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "50%",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Avatar
                    name={user.username}
                    size={52}
                    fontSize={18}
                    role={user.role}
                  />
                  <div>
                    <h2
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#fff",
                        margin: "0 0 6px",
                      }}
                    >
                      {user.username}
                    </h2>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "2px 9px",
                          background: rs.bg,
                          border: `1px solid ${rs.border}`,
                          borderRadius: 6,
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: 10,
                          fontWeight: 700,
                          color: rs.color,
                        }}
                      >
                        <RoleIcon role={user.role} size={9} /> {user.role}
                      </span>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "2px 9px",
                          background: user.active
                            ? "rgba(34,197,94,0.2)"
                            : "rgba(220,38,38,0.2)",
                          border: `1px solid ${user.active ? "rgba(34,197,94,0.4)" : "rgba(220,38,38,0.4)"}`,
                          borderRadius: 6,
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: 10,
                          fontWeight: 700,
                          color: user.active ? "#4ade80" : "#f87171",
                        }}
                      >
                        {user.active ? (
                          <UserCheck size={9} />
                        ) : (
                          <UserX size={9} />
                        )}
                        {user.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 8,
                    width: 32,
                    height: 32,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <X size={16} color="#fff" />
                </button>
              </div>
            </div>

            {/* Info rows */}
            <div style={{ padding: "20px 24px 24px" }}>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  margin: "0 0 14px",
                }}
              >
                Account Information
              </p>

              {[
                { icon: Hash, label: "User ID", value: user._id },
                { icon: Mail, label: "Email", value: user.email },
                { icon: Phone, label: "Phone", value: user.phone },
                {
                  icon: Calendar,
                  label: "Joined",
                  value: formatDateTime(user.createdAt),
                },
                {
                  icon: Calendar,
                  label: "Last Updated",
                  value: formatDateTime(user.updatedAt),
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "10px 0",
                    borderBottom: "1px solid #f8fafc",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <Icon size={14} color="#64748b" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        margin: "0 0 2px",
                      }}
                    >
                      {label}
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 13,
                        color: "#1e293b",
                        margin: 0,
                        wordBreak: "break-all",
                      }}
                    >
                      {value}
                    </p>
                  </div>
                </div>
              ))}

              {/* Activity counts */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 10,
                  marginTop: 16,
                }}
              >
                {[
                  { label: "Receipts", count: user.receipts?.length ?? 0 },
                  {
                    label: "Restaurants",
                    count: user.restaurants?.length ?? 0,
                  },
                  { label: "Bookings", count: user.bookings?.length ?? 0 },
                ].map(({ label, count }) => (
                  <div
                    key={label}
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      padding: "12px 14px",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: 22,
                        fontWeight: 800,
                        color: "#0f172a",
                        margin: 0,
                      }}
                    >
                      {count}
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 11,
                        color: "#64748b",
                        margin: 0,
                      }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── AccountManagement ────────────────────────────────────────────────────────
export default function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [detailUser, setDetailUser] = useState(null);

  const fetchData = async () => {
    try {
      const res = await getAllUsers();
      setAccounts(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = accounts.filter((a) => {
    const matchSearch =
      a.username.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.phone.includes(search);
    const matchRole = roleFilter === "ALL" || a.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleActive = async (acc) => {
    try {
      if (acc?.role === "ADMIN") {
        toast.error("Admin accounts cannot be deactivated.");
        return;
      }
      const res = await toggleActive(acc?._id);
      if (res) {
        toast.success(`${acc?.username} has been ${acc?.active}!`);
        fetchData();
      } else {
        toast.error(`"This fucntion is not working!`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Stats
  const total = accounts.length;
  const active = accounts.filter((a) => a.active).length;
  const chefs = accounts.filter((a) => a.role === "CHEF").length;
  const inactive = accounts.filter((a) => !a.active).length;

  return (
    <div>
      {/* Page header */}
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
          Account Management
        </h1>
        <p
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 14,
            color: "#64748b",
            margin: "4px 0 0",
          }}
        >
          View and manage all user accounts on the platform
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
          marginBottom: 24,
        }}
        className="admin-stats"
      >
        {[
          {
            icon: Users,
            label: "Total Users",
            value: total,
            color: "#2563eb",
            bg: "#eff6ff",
          },
          {
            icon: UserCheck,
            label: "Active",
            value: active,
            color: "#16a34a",
            bg: "#f0fdf4",
          },
          {
            icon: ChefHat,
            label: "Chefs",
            value: chefs,
            color: "#d97706",
            bg: "#fffbeb",
          },
          {
            icon: UserX,
            label: "Inactive",
            value: inactive,
            color: "#dc2626",
            bg: "#fff5f5",
          },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div
            key={label}
            style={{
              background: "#fff",
              border: "1.5px solid #f1f5f9",
              borderRadius: 16,
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
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
                flexShrink: 0,
              }}
            >
              <Icon size={18} color={color} />
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                {value}
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 11,
                  color: "#64748b",
                  margin: 0,
                }}
              >
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search
            size={15}
            color="#94a3b8"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            style={{
              padding: "10px 14px 10px 38px",
              background: "#fff",
              border: "1.5px solid #e2e8f0",
              borderRadius: 10,
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 14,
              color: "#1e293b",
              outline: "none",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Role filter */}
        <div style={{ display: "flex", gap: 6 }}>
          {["ALL", "USER", "CHEF", "ADMIN"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              style={{
                padding: "9px 16px",
                background: roleFilter === r ? "#dc2626" : "#fff",
                border: `1.5px solid ${roleFilter === r ? "#dc2626" : "#e2e8f0"}`,
                borderRadius: 9,
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: roleFilter === r ? "#fff" : "#64748b",
                cursor: "pointer",
                transition: "all 0.18s",
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Refresh */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => toast.success("Data refreshed!")}
          style={{
            padding: "9px 14px",
            background: "#fff",
            border: "1.5px solid #e2e8f0",
            borderRadius: 9,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "#64748b",
          }}
        >
          <RefreshCw size={14} /> Refresh
        </motion.button>
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          border: "1.5px solid #f1f5f9",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 2fr 1.2fr 1fr 0.8fr 0.8fr",
            gap: 0,
            background: "#f8fafc",
            borderBottom: "1.5px solid #f1f5f9",
            padding: "12px 20px",
          }}
        >
          {["User", "Contact", "Role", "Status", "Joined", "Actions"].map(
            (h) => (
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
            ),
          )}
        </div>

        {filtered.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "56px 0", color: "#94a3b8" }}
          >
            <Users
              size={40}
              color="#cbd5e1"
              style={{ margin: "0 auto 12px", display: "block" }}
            />
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15 }}>
              No accounts found
            </p>
          </div>
        ) : (
          filtered.map((acc, i) => {
            const rs = ROLE_STYLE[acc.role] ?? ROLE_STYLE.USER;
            const isAdmin = acc.role === "ADMIN";

            return (
              <motion.div
                key={acc._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 2fr 1.2fr 1fr 0.8fr 0.8fr",
                  gap: 0,
                  padding: "14px 20px",
                  borderBottom:
                    i < filtered.length - 1 ? "1px solid #f8fafc" : "none",
                  alignItems: "center",
                  opacity: acc.active ? 1 : 0.65,
                  transition: "background 0.15s, opacity 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#fafafa")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                {/* User */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    paddingRight: 12,
                  }}
                >
                  <Avatar
                    name={acc.username}
                    size={36}
                    fontSize={13}
                    role={acc.role}
                  />
                  <div style={{ minWidth: 0 }}>
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
                      {acc.username}
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 10,
                        color: "#94a3b8",
                        margin: "1px 0 0",
                      }}
                    >
                      #{acc._id.slice(-6)}
                    </p>
                  </div>
                </div>

                {/* Contact */}
                <div style={{ paddingRight: 12 }}>
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 12,
                      color: "#475569",
                      margin: "0 0 3px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Mail size={11} color="#94a3b8" /> {acc.email}
                  </p>
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 12,
                      color: "#475569",
                      margin: 0,
                    }}
                  >
                    <Phone size={11} color="#94a3b8" /> {acc.phone}
                  </p>
                </div>

                {/* Role */}
                <div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "3px 10px",
                      background: rs.bg,
                      border: `1px solid ${rs.border}`,
                      borderRadius: 6,
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      color: rs.color,
                    }}
                  >
                    <RoleIcon role={acc.role} size={10} />
                    {acc.role}
                  </span>
                </div>

                {/* Status */}
                <div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "3px 10px",
                      background: acc.active ? "#f0fdf4" : "#fff5f5",
                      border: `1px solid ${acc.active ? "#86efac" : "#fecaca"}`,
                      borderRadius: 6,
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      color: acc.active ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {acc.active ? <UserCheck size={10} /> : <UserX size={10} />}
                    {acc.active ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Joined */}
                <div>
                  <p
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 12,
                      color: "#64748b",
                      margin: 0,
                    }}
                  >
                    {formatDate(acc.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6 }}>
                  {/* View detail */}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setDetailUser(acc)}
                    style={{
                      width: 32,
                      height: 32,
                      background: "#f0f9ff",
                      border: "1px solid #bae6fd",
                      borderRadius: 8,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="View details"
                  >
                    <Eye size={14} color="#0891b2" />
                  </motion.button>

                  {/* Ban / Approve — disabled for ADMIN */}
                  <motion.button
                    whileHover={{ scale: isAdmin ? 1 : 1.08 }}
                    whileTap={{ scale: isAdmin ? 1 : 0.92 }}
                    onClick={() => toggleActive(acc)}
                    title={
                      isAdmin
                        ? "Cannot deactivate admin accounts"
                        : acc.active
                          ? "Deactivate account"
                          : "Approve account"
                    }
                    style={{
                      width: 32,
                      height: 32,
                      background: isAdmin
                        ? "#f8fafc"
                        : acc.active
                          ? "#fff5f5"
                          : "#f0fdf4",
                      border: `1px solid ${
                        isAdmin ? "#e2e8f0" : acc.active ? "#fecaca" : "#86efac"
                      }`,
                      borderRadius: 8,
                      cursor: isAdmin ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: isAdmin ? 0.45 : 1,
                    }}
                  >
                    {isAdmin ? (
                      // Lock icon — admin is protected, cannot be toggled
                      <Lock size={14} color="#94a3b8" />
                    ) : acc.active ? (
                      // Red ban icon — account is active, clicking will deactivate
                      <Ban size={14} color="#dc2626" />
                    ) : (
                      // Green check icon — account is inactive, clicking will approve
                      <CheckCircle size={14} color="#16a34a" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Detail modal */}
      <DetailModal user={detailUser} onClose={() => setDetailUser(null)} />

      <style>{`
        * { box-sizing: border-box; }
        @media (max-width: 900px) {
          .admin-stats { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  );
}
