import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, Select, Form, Input, InputNumber, Tooltip } from "antd";
import toast from "react-hot-toast";
import {
  Store,
  Plus,
  MapPin,
  Users,
  Edit2,
  Trash2,
  BarChart2,
  Calendar,
  Hash,
  Utensils,
  AlertTriangle,
  Building2,
  TrendingUp,
  Link as LinkIcon,
  ChefHat,
} from "lucide-react";
import {
  addNewRestaurant,
  deleteRestaurant,
  getAllMyRestaurants,
  getAllReceipts,
  getAuthenUser,
  updateRestaurant,
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
    month: "short",
    day: "numeric",
  });

const genId = () =>
  Date.now().toString(16) + Math.random().toString(16).slice(2, 8);

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
function ConfirmModal({ open, name, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.88, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.88, y: 20 }}
            transition={{ type: "spring", damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "28px 28px 24px",
              maxWidth: 400,
              width: "100%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#fff5f5",
                  border: "1.5px solid #fecaca",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={22} color="#dc2626" />
              </div>
              <h3
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Delete Restaurant
              </h3>
            </div>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 14,
                color: "#64748b",
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              Are you sure you want to delete <strong>"{name}"</strong>? This
              action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={onCancel}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 10,
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                  border: "none",
                  borderRadius: 10,
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────
// dishes in form: array of _id strings (Select value)
// On save, we resolve them back to { _id, foodName } objects
function RestaurantModal({
  open,
  initial,
  allReceipts,
  onClose,
  onSave,
  saving,
}) {
  const [form] = Form.useForm();

  const afterOpenChange = (isOpen) => {
    if (isOpen) {
      if (initial) {
        form.setFieldsValue({
          restaurantName: initial.restaurantName ?? "",
          license: initial.license ?? "",
          address: initial.address ?? "",
          seats: initial.seats ?? 1,
          // dishes in BE is now [{ _id, foodName }] — extract IDs for Select
          dishes: Array.isArray(initial.dishes)
            ? initial.dishes.map((d) => (typeof d === "object" ? d._id : d))
            : [],
        });
      } else {
        form.resetFields();
      }
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
    } catch {
      // antd shows inline errors
    }
  };

  const dishOptions = allReceipts.map((r) => ({
    label: r.foodName,
    value: r._id,
  }));

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={saving}
      afterOpenChange={afterOpenChange}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "#ecfeff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Building2 size={16} color="#0891b2" />
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 18,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            {initial ? "Edit Restaurant" : "Add Restaurant"}
          </span>
        </div>
      }
      okText={initial ? "Save Changes" : "Create Restaurant"}
      cancelText="Cancel"
      width={600}
      okButtonProps={{
        style: {
          background: "linear-gradient(135deg,#0891b2,#0e7490)",
          border: "none",
          borderRadius: 9,
          fontFamily: "'DM Sans',sans-serif",
          fontWeight: 700,
          height: 40,
          boxShadow: "0 4px 12px rgba(8,145,178,0.35)",
        },
      }}
      cancelButtonProps={{
        style: {
          borderRadius: 9,
          fontFamily: "'DM Sans',sans-serif",
          fontWeight: 600,
          height: 40,
        },
      }}
      styles={{
        header: { borderBottom: "1px solid #f1f5f9", paddingBottom: 14 },
        body: { paddingTop: 20 },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ fontFamily: "'DM Sans',sans-serif" }}
        requiredMark={false}
      >
        {/* Restaurant Name */}
        <Form.Item
          name="restaurantName"
          label={
            <span
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Restaurant Name <span style={{ color: "#ef4444" }}>*</span>
            </span>
          }
          rules={[{ required: true, message: "Restaurant name is required." }]}
        >
          <Input
            placeholder="e.g. Nha Hang Nai Vang"
            size="large"
            style={{ borderRadius: 9, fontFamily: "'DM Sans',sans-serif" }}
          />
        </Form.Item>

        {/* License URL */}
        <Form.Item
          name="license"
          label={
            <span
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              License URL{" "}
              <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 12 }}>
                — optional
              </span>
            </span>
          }
        >
          <Input
            prefix={<LinkIcon size={14} color="#94a3b8" />}
            placeholder="https://your-license-document.url.com"
            size="large"
            style={{ borderRadius: 9, fontFamily: "'DM Sans',sans-serif" }}
          />
        </Form.Item>

        {/* Address */}
        <Form.Item
          name="address"
          label={
            <span
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Address <span style={{ color: "#ef4444" }}>*</span>
            </span>
          }
          rules={[{ required: true, message: "Address is required." }]}
        >
          <Input.TextArea
            placeholder="e.g. 123 Pham Van Dong, Thu Duc, HCMC"
            rows={2}
            style={{ borderRadius: 9, fontFamily: "'DM Sans',sans-serif" }}
          />
        </Form.Item>

        {/* Seats */}
        <Form.Item
          name="seats"
          label={
            <span
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Number of Seats <span style={{ color: "#ef4444" }}>*</span>
            </span>
          }
          rules={[
            { required: true, message: "Seats is required." },
            { type: "number", min: 1, message: "Must be at least 1 seat." },
          ]}
        >
          <InputNumber
            min={1}
            style={{
              width: "100%",
              borderRadius: 9,
              fontFamily: "'DM Sans',sans-serif",
            }}
            size="large"
            placeholder="e.g. 50"
          />
        </Form.Item>

        {/* Dishes */}
        <Form.Item
          name="dishes"
          label={
            <span
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Menu Dishes
              <span
                style={{
                  fontWeight: 400,
                  color: "#94a3b8",
                  marginLeft: 6,
                  fontSize: 12,
                }}
              >
                — select from your published recipes
              </span>
            </span>
          }
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="Search and select dishes..."
            options={dishOptions}
            optionFilterProp="label"
            showSearch
            size="large"
            style={{ borderRadius: 9, fontFamily: "'DM Sans',sans-serif" }}
            maxTagCount="responsive"
            notFoundContent={
              <div
                style={{
                  textAlign: "center",
                  padding: "16px 0",
                  color: "#94a3b8",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13,
                }}
              >
                No recipes available.
              </div>
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

// ─── RestaurantManagement ─────────────────────────────────────────────────────
export default function RestaurantManagement() {
  const [restaurants, setRestaurants] = useState([]);
  const [allReceipts, setAllReceipts] = useState([]);
  const [user, setUser] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = async () => {
    try {
      const res1 = await getAllMyRestaurants();
      setRestaurants(res1);
      const res2 = await getAllReceipts();
      setAllReceipts(res2);
      const res3 = await getAuthenUser();
      setUser(res3);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Open / close ────────────────────────────────────────────────────────────
  const openNew = () => {
    setEditTarget(null);
    setModalOpen(true);
  };
  const openEdit = (rs) => {
    setEditTarget(rs);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleSave = async (values) => {
    setSaving(true);

    // Resolve dish IDs → full objects
    const resolvedDishes = (values.dishes ?? [])
      .map((id) => allReceipts.find((r) => r._id === id))
      .filter(Boolean);

    if (editTarget) {
      const res = await updateRestaurant(editTarget._id, values);
      if (res) {
        toast.success(`${values.restaurantName} updated successfully!`);
        fetchData();
      } else {
        toast.error(`${values.restaurantName} updated failed!`);
      }
    } else {
      const newRs = {
        _id: genId(),
        restaurantName: values.restaurantName,
        license: values.license ?? "",
        address: values.address,
        seats: values.seats,
        dishes: resolvedDishes,
        ownBy: user._id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
      };
      const res = await addNewRestaurant(newRs);
      if (res) {
        toast.success(`${values.restaurantName} created successfully!`);
        fetchData();
      } else {
        toast.error(`${values.restaurantName} created failed!`);
      }
    }

    setSaving(false);
    closeModal();
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    try {
      const res = await deleteRestaurant(deleteTarget._id);
      if (res) {
        toast.success(`Restaurant delete successfully!`);
        fetchData();
      } else {
        toast.error(`Restaurant delete failed!`);
      }
      setDeleteTarget(null);
    } catch (error) {
      console.log(error);
    }
  };

  // ── Derived stats ───────────────────────────────────────────────────────────
  const totalSeats = restaurants.reduce((s, r) => s + (r.seats ?? 0), 0);
  const totalDishes = restaurants.reduce(
    (s, r) => s + (r.dishes?.length ?? 0),
    0,
  );

  return (
    <>
      <FontLink />

      {/* ── Page header ── */}
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
            My Restaurants
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 14,
              color: "#64748b",
              margin: "4px 0 0",
            }}
          >
            Manage your restaurant listings and menu dishes
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={openNew}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "11px 22px",
            background: "linear-gradient(135deg,#0891b2,#0e7490)",
            border: "none",
            borderRadius: 12,
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(8,145,178,0.35)",
          }}
        >
          <Plus size={16} /> Add Restaurant
        </motion.button>
      </div>

      {/* ── Stats ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
          marginBottom: 28,
        }}
        className="rsm-stats"
      >
        {[
          {
            icon: Store,
            label: "Total Restaurants",
            value: restaurants.length,
            color: "#0891b2",
            bg: "#ecfeff",
          },
          {
            icon: Users,
            label: "Total Seats",
            value: totalSeats,
            color: "#7c3aed",
            bg: "#f5f3ff",
          },
          {
            icon: Utensils,
            label: "Menu Dishes",
            value: totalDishes,
            color: "#d97706",
            bg: "#fffbeb",
          },
          {
            icon: TrendingUp,
            label: "Available Recipes",
            value: allReceipts.length,
            color: "#16a34a",
            bg: "#f0fdf4",
          },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div
            key={label}
            style={{
              background: "#fff",
              border: "1.5px solid #e0e7ff",
              borderRadius: 16,
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 2px 8px rgba(30,58,138,0.06)",
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

      {/* ── Cards ── */}
      {restaurants.length === 0 ? (
        <div
          style={{ textAlign: "center", padding: "72px 0", color: "#94a3b8" }}
        >
          <Store
            size={48}
            color="#cbd5e1"
            style={{ margin: "0 auto 16px", display: "block" }}
          />
          <p
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 20,
              fontWeight: 700,
              color: "#64748b",
              margin: "0 0 6px",
            }}
          >
            No restaurants yet
          </p>
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 14,
              color: "#94a3b8",
              marginBottom: 24,
            }}
          >
            Add your first restaurant to get started.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={openNew}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "11px 24px",
              background: "linear-gradient(135deg,#0891b2,#0e7490)",
              border: "none",
              borderRadius: 12,
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <Plus size={16} /> Add Restaurant
          </motion.button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
            gap: 22,
          }}
        >
          {restaurants.map((rs, i) => (
            <motion.div
              key={rs._id}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              style={{
                background: "#fff",
                border: "1.5px solid #e0e7ff",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 4px 18px rgba(30,58,138,0.08)",
              }}
            >
              {/* Header band */}
              <div
                style={{
                  background: "linear-gradient(135deg,#0f172a,#1e3a8a)",
                  padding: "20px 20px 16px",
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
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#fff",
                        margin: 0,
                        lineHeight: 1.3,
                        flex: 1,
                      }}
                    >
                      {rs.restaurantName}
                    </h3>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Building2 size={17} color="#7dd3fc" />
                    </div>
                  </div>
                  <p
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#475569",
                      margin: "8px 0 0",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    #{rs._id.slice(-8)}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div style={{ padding: "16px 18px 18px" }}>
                {/* Info rows */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  {/* Address */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <MapPin
                      size={13}
                      color="#94a3b8"
                      style={{ flexShrink: 0, marginTop: 2 }}
                    />
                    <span
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 13,
                        color: "#475569",
                        lineHeight: 1.45,
                      }}
                    >
                      {rs.address}
                    </span>
                  </div>

                  {/* Seats */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Users size={13} color="#94a3b8" />
                    <span
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 13,
                        color: "#475569",
                      }}
                    >
                      {rs.seats} seat{rs.seats !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Owner — now shows username from populated ownBy */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <ChefHat size={13} color="#94a3b8" />
                    <span
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 13,
                        color: "#475569",
                      }}
                    >
                      {rs.ownBy?.username ??
                        `ID: …${rs.ownBy?._id?.slice(-6) ?? "—"}`}
                    </span>
                  </div>

                  {/* License URL — show link if present */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <LinkIcon
                      size={13}
                      color="#94a3b8"
                      style={{ flexShrink: 0 }}
                    />
                    {rs.license ? (
                      <a
                        href={rs.license}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: 13,
                          color: "#0891b2",
                          textDecoration: "none",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "100%",
                        }}
                      >
                        View License
                      </a>
                    ) : (
                      <span
                        style={{
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: 13,
                          color: "#94a3b8",
                          fontStyle: "italic",
                        }}
                      >
                        No license provided
                      </span>
                    )}
                  </div>

                  {/* Created date */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Calendar size={13} color="#94a3b8" />
                    <span
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 13,
                        color: "#475569",
                      }}
                    >
                      Since {formatDate(rs.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Dishes — rs.dishes is now [{ _id, foodName }] */}
                <div style={{ marginBottom: 12 }}>
                  <p
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      margin: "0 0 7px",
                    }}
                  >
                    Menu Dishes ({rs.dishes?.length ?? 0})
                  </p>
                  {!rs.dishes?.length ? (
                    <p
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 12,
                        color: "#94a3b8",
                        fontStyle: "italic",
                        margin: 0,
                      }}
                    >
                      No dishes assigned yet
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {rs.dishes.slice(0, 4).map((d) => (
                        <Tooltip key={d._id} title={d.foodName}>
                          <span
                            style={{
                              padding: "3px 9px",
                              background: "#eff6ff",
                              border: "1px solid #bfdbfe",
                              borderRadius: 6,
                              fontFamily: "'DM Sans',sans-serif",
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#1d4ed8",
                              maxWidth: 130,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              display: "inline-block",
                            }}
                          >
                            {d.foodName}
                          </span>
                        </Tooltip>
                      ))}
                      {rs.dishes.length > 4 && (
                        <span
                          style={{
                            padding: "3px 9px",
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: 6,
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#64748b",
                          }}
                        >
                          +{rs.dishes.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Dishes count chip */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "5px 12px",
                    background: rs.dishes?.length > 0 ? "#eff6ff" : "#f8fafc",
                    border: `1px solid ${rs.dishes?.length > 0 ? "#bfdbfe" : "#e2e8f0"}`,
                    borderRadius: 20,
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    color: rs.dishes?.length > 0 ? "#1d4ed8" : "#94a3b8",
                    marginBottom: 14,
                  }}
                >
                  <Utensils size={12} />
                  {rs.dishes?.length ?? 0} dish
                  {rs.dishes?.length !== 1 ? "es" : ""} on menu
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() =>
                      toast.success(`Managing "${rs.restaurantName}"`)
                    }
                    style={{
                      flex: 1,
                      padding: "9px",
                      background: "#ecfeff",
                      border: "1px solid #a5f3fc",
                      borderRadius: 9,
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#0891b2",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                    }}
                  >
                    <BarChart2 size={13} /> Manage
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => openEdit(rs)}
                    style={{
                      flex: 1,
                      padding: "9px",
                      background: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      borderRadius: 9,
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#1d4ed8",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                    }}
                  >
                    <Edit2 size={13} /> Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setDeleteTarget(rs)}
                    style={{
                      padding: "9px 12px",
                      background: "#fff5f5",
                      border: "1px solid #fecaca",
                      borderRadius: 9,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Trash2 size={13} color="#dc2626" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      <RestaurantModal
        open={modalOpen}
        initial={editTarget}
        allReceipts={allReceipts}
        onClose={closeModal}
        onSave={handleSave}
        saving={saving}
      />

      <ConfirmModal
        open={!!deleteTarget}
        name={deleteTarget?.restaurantName}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <style>{`
        * { box-sizing: border-box; }
        @media (max-width: 900px) { .rsm-stats { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 480px) { .rsm-stats { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
