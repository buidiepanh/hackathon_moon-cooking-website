import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, Form, Input, InputNumber, Switch, Select } from "antd";
import toast from "react-hot-toast";
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  ToggleRight,
  ToggleLeft,
  Package,
  Zap,
  Crown,
  Star,
  AlertTriangle,
  X,
  BookOpen,
  Store,
  Sparkles,
} from "lucide-react";

// ─── Mock data matching BE schema ────────────────────────────────────────────
const MOCK_PLANS = [
  {
    _id: "69be2903f5f3e1c494cc61d8",
    subsciptionName: "Basic package for chef",
    subscriptionType: "CHEF_SUBSCRIPTION",
    price: 200000,
    features: [
      {
        _id: "69be233551b5616ed0b87f74",
        featName: "Create more receipt",
        featCode: "CREATE_RECEIPT",
        featValue: 10,
        featEnable: true,
        __v: 0,
      },
      {
        _id: "69be246fbec5196571137dbd",
        featName: "Create more restaurant",
        featCode: "CREATE_RESTAURANT",
        featValue: 3,
        featEnable: true,
        __v: 0,
      },
    ],
    available: true,
    createdAt: "2026-03-21T05:13:39.380Z",
    updatedAt: "2026-03-21T05:13:39.380Z",
    __v: 0,
  },
  {
    _id: "69be2903f5f3e1c494cc61d9",
    subsciptionName: "Pro package for chef",
    subscriptionType: "CHEF_SUBSCRIPTION",
    price: 500000,
    features: [
      {
        _id: "f3",
        featName: "Create more receipt",
        featCode: "CREATE_RECEIPT",
        featValue: 50,
        featEnable: true,
        __v: 0,
      },
      {
        _id: "f4",
        featName: "Create more restaurant",
        featCode: "CREATE_RESTAURANT",
        featValue: 10,
        featEnable: true,
        __v: 0,
      },
      {
        _id: "f5",
        featName: "AI nutrition advisor",
        featCode: "AI_ADVISOR",
        featValue: 1,
        featEnable: true,
        __v: 0,
      },
    ],
    available: true,
    createdAt: "2026-03-21T05:13:39.380Z",
    updatedAt: "2026-03-21T05:13:39.380Z",
    __v: 0,
  },
  {
    _id: "69be2903f5f3e1c494cc61da",
    subsciptionName: "Enterprise package",
    subscriptionType: "CHEF_SUBSCRIPTION",
    price: 1200000,
    features: [
      {
        _id: "f6",
        featName: "Create more receipt",
        featCode: "CREATE_RECEIPT",
        featValue: 999,
        featEnable: true,
        __v: 0,
      },
      {
        _id: "f7",
        featName: "Create more restaurant",
        featCode: "CREATE_RESTAURANT",
        featValue: 999,
        featEnable: true,
        __v: 0,
      },
      {
        _id: "f8",
        featName: "AI nutrition advisor",
        featCode: "AI_ADVISOR",
        featValue: 1,
        featEnable: true,
        __v: 0,
      },
      {
        _id: "f9",
        featName: "Priority support",
        featCode: "PRIORITY_SUPPORT",
        featValue: 1,
        featEnable: true,
        __v: 0,
      },
    ],
    available: true,
    createdAt: "2026-03-21T05:13:39.380Z",
    updatedAt: "2026-03-21T05:13:39.380Z",
    __v: 0,
  },
];

const FEAT_CODE_OPTIONS = [
  { label: "Create Receipt", value: "CREATE_RECEIPT" },
  { label: "Create Restaurant", value: "CREATE_RESTAURANT" },
  { label: "AI Advisor", value: "AI_ADVISOR" },
  { label: "Priority Support", value: "PRIORITY_SUPPORT" },
  { label: "Custom Branding", value: "CUSTOM_BRAND" },
];

const FEAT_ICON_MAP = {
  CREATE_RECEIPT: BookOpen,
  CREATE_RESTAURANT: Store,
  AI_ADVISOR: Sparkles,
  PRIORITY_SUPPORT: Star,
  CUSTOM_BRAND: Crown,
};

const formatPrice = (p) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    p,
  );

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const genId = () =>
  Date.now().toString(16) + Math.random().toString(16).slice(2, 8);

// ─── Confirm delete ───────────────────────────────────────────────────────────
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
                Delete Plan
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
              cannot be undone.
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

// ─── Plan modal ───────────────────────────────────────────────────────────────
function PlanModal({ open, initial, onClose, onSave, saving }) {
  const [form] = Form.useForm();
  const [features, setFeatures] = useState([]);

  const afterOpenChange = (isOpen) => {
    if (isOpen) {
      if (initial) {
        form.setFieldsValue({
          subsciptionName: initial.subsciptionName,
          subscriptionType: initial.subscriptionType,
          price: initial.price,
          available: initial.available,
        });
        setFeatures(initial.features.map((f) => ({ ...f })));
      } else {
        form.resetFields();
        setFeatures([]);
      }
    }
  };

  const addFeature = () =>
    setFeatures((p) => [
      ...p,
      {
        _id: genId(),
        featName: "",
        featCode: "CREATE_RECEIPT",
        featValue: 1,
        featEnable: true,
      },
    ]);

  const removeFeature = (id) =>
    setFeatures((p) => p.filter((f) => f._id !== id));

  const updateFeature = (id, key, val) =>
    setFeatures((p) => p.map((f) => (f._id === id ? { ...f, [key]: val } : f)));

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSave({ ...values, features });
    } catch {
      /* antd shows inline errors */
    }
  };

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
              background: "#fff5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CreditCard size={16} color="#dc2626" />
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 18,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            {initial ? "Edit Plan" : "New Subscription Plan"}
          </span>
        </div>
      }
      okText={initial ? "Save Changes" : "Create Plan"}
      cancelText="Cancel"
      width={620}
      okButtonProps={{
        style: {
          background: "linear-gradient(135deg,#dc2626,#b91c1c)",
          border: "none",
          borderRadius: 9,
          fontFamily: "'DM Sans',sans-serif",
          fontWeight: 700,
          height: 40,
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
        <Form.Item
          name="subsciptionName"
          label={<b style={{ fontSize: 13 }}>Plan Name *</b>}
          rules={[{ required: true }]}
        >
          <Input
            placeholder="e.g. Basic package for chef"
            size="large"
            style={{ borderRadius: 9 }}
          />
        </Form.Item>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <Form.Item
            name="subscriptionType"
            label={<b style={{ fontSize: 13 }}>Type *</b>}
            rules={[{ required: true }]}
          >
            <Select
              size="large"
              style={{ borderRadius: 9 }}
              options={[
                { label: "Chef Subscription", value: "CHEF_SUBSCRIPTION" },
                { label: "User Subscription", value: "USER_SUBSCRIPTION" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="price"
            label={<b style={{ fontSize: 13 }}>Price (VND) *</b>}
            rules={[{ required: true }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%", borderRadius: 9 }}
              size="large"
              placeholder="200000"
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            />
          </Form.Item>
        </div>
        <Form.Item
          name="available"
          label={<b style={{ fontSize: 13 }}>Available</b>}
          valuePropName="checked"
        >
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </Form.Item>
      </Form>

      {/* Features editor */}
      <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: "#374151",
            }}
          >
            Features
          </span>
          <button
            onClick={addFeature}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 12px",
              background: "#fff5f5",
              border: "1px solid #fecaca",
              borderRadius: 8,
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: "#dc2626",
              cursor: "pointer",
            }}
          >
            <Plus size={12} /> Add Feature
          </button>
        </div>
        {features.length === 0 && (
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 13,
              color: "#94a3b8",
              textAlign: "center",
              padding: "12px 0",
            }}
          >
            No features added yet.
          </p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {features.map((f) => (
            <div
              key={f._id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.2fr 70px 50px 28px",
                gap: 8,
                alignItems: "center",
                padding: "8px 10px",
                background: "#f8fafc",
                borderRadius: 9,
                border: "1px solid #e2e8f0",
              }}
            >
              <input
                value={f.featName}
                onChange={(e) =>
                  updateFeature(f._id, "featName", e.target.value)
                }
                placeholder="Feature name"
                style={{
                  padding: "6px 9px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 7,
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 12,
                  color: "#1e293b",
                  outline: "none",
                }}
              />
              <select
                value={f.featCode}
                onChange={(e) =>
                  updateFeature(f._id, "featCode", e.target.value)
                }
                style={{
                  padding: "6px 9px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 7,
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 12,
                  color: "#1e293b",
                  outline: "none",
                  background: "#fff",
                }}
              >
                {FEAT_CODE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={f.featValue}
                onChange={(e) =>
                  updateFeature(f._id, "featValue", Number(e.target.value))
                }
                min={1}
                style={{
                  padding: "6px 9px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 7,
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 12,
                  color: "#1e293b",
                  outline: "none",
                  width: "100%",
                }}
              />
              <Switch
                size="small"
                checked={f.featEnable}
                onChange={(v) => updateFeature(f._id, "featEnable", v)}
              />
              <button
                onClick={() => removeFeature(f._id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#dc2626",
                  display: "flex",
                }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

// ─── SubscriptionManagement ───────────────────────────────────────────────────
export default function SubscriptionManagement() {
  const [plans, setPlans] = useState(MOCK_PLANS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openNew = () => {
    setEditTarget(null);
    setModalOpen(true);
  };
  const openEdit = (p) => {
    setEditTarget(p);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleSave = (values) => {
    setSaving(true);
    setTimeout(() => {
      if (editTarget) {
        setPlans((prev) =>
          prev.map((p) =>
            p._id === editTarget._id
              ? { ...p, ...values, updatedAt: new Date().toISOString() }
              : p,
          ),
        );
        toast.success(`"${values.subsciptionName}" updated!`);
      } else {
        setPlans((prev) => [
          {
            _id: genId(),
            ...values,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            __v: 0,
          },
          ...prev,
        ]);
        toast.success(`"${values.subsciptionName}" created!`);
      }
      setSaving(false);
      closeModal();
    }, 600);
  };

  const toggleAvailable = (id) => {
    setPlans((prev) =>
      prev.map((p) => (p._id === id ? { ...p, available: !p.available } : p)),
    );
    const plan = plans.find((p) => p._id === id);
    toast.success(
      `"${plan.subsciptionName}" ${plan.available ? "disabled" : "enabled"}.`,
    );
  };

  const confirmDelete = () => {
    setPlans((prev) => prev.filter((p) => p._id !== deleteTarget._id));
    toast.success(`"${deleteTarget.subsciptionName}" deleted.`);
    setDeleteTarget(null);
  };

  const totalRevenue = 0; // placeholder

  return (
    <div>
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
            Subscription Management
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 14,
              color: "#64748b",
              margin: "4px 0 0",
            }}
          >
            Create and manage subscription plans
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
            background: "linear-gradient(135deg,#dc2626,#b91c1c)",
            border: "none",
            borderRadius: 12,
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(220,38,38,0.35)",
          }}
        >
          <Plus size={16} /> New Plan
        </motion.button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {[
          {
            icon: CreditCard,
            label: "Total Plans",
            value: plans.length,
            color: "#dc2626",
            bg: "#fff5f5",
          },
          {
            icon: ToggleRight,
            label: "Active Plans",
            value: plans.filter((p) => p.available).length,
            color: "#16a34a",
            bg: "#f0fdf4",
          },
          {
            icon: ToggleLeft,
            label: "Inactive Plans",
            value: plans.filter((p) => !p.available).length,
            color: "#64748b",
            bg: "#f8fafc",
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
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
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

      {/* Plan cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
          gap: 20,
        }}
      >
        {plans.map((plan, i) => (
          <motion.div
            key={plan._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              background: "#fff",
              border: `1.5px solid ${plan.available ? "#f1f5f9" : "#e2e8f0"}`,
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
              opacity: plan.available ? 1 : 0.7,
            }}
          >
            {/* Header */}
            <div
              style={{
                background: plan.available
                  ? "linear-gradient(135deg,#1c1917,#dc2626)"
                  : "linear-gradient(135deg,#374151,#6b7280)",
                padding: "18px 20px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -15,
                  right: -15,
                  width: 80,
                  height: 80,
                  background: "rgba(255,255,255,0.06)",
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
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#fff",
                      margin: "0 0 6px",
                      lineHeight: 1.25,
                    }}
                  >
                    {plan.subsciptionName}
                  </h3>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "2px 8px",
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: 6,
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#fff",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      flexShrink: 0,
                    }}
                  >
                    {plan.available ? (
                      <ToggleRight size={8} />
                    ) : (
                      <ToggleLeft size={8} />
                    )}
                    {plan.available ? "Active" : "Inactive"}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#fff",
                    margin: "4px 0 0",
                  }}
                >
                  {formatPrice(plan.price)}
                  <span
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 12,
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.65)",
                      marginLeft: 4,
                    }}
                  >
                    /month
                  </span>
                </p>
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    background: "rgba(255,255,255,0.12)",
                    borderRadius: 5,
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#fca5a5",
                    textTransform: "uppercase",
                    marginTop: 6,
                  }}
                >
                  {plan.subscriptionType.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {/* Features */}
            <div style={{ padding: "14px 18px 6px" }}>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: "0 0 8px",
                }}
              >
                Features ({plan.features.length})
              </p>
              {plan.features.map((f) => {
                const Icon = FEAT_ICON_MAP[f.featCode] ?? Package;
                const valLabel =
                  f.featValue === 1
                    ? "✓"
                    : f.featValue >= 999
                      ? "Unlimited"
                      : `Up to ${f.featValue}`;
                return (
                  <div
                    key={f._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "5px 0",
                      opacity: f.featEnable ? 1 : 0.45,
                    }}
                  >
                    <Icon
                      size={12}
                      color={f.featEnable ? "#dc2626" : "#94a3b8"}
                    />
                    <span
                      style={{
                        flex: 1,
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 12,
                        color: "#374151",
                      }}
                    >
                      {f.featName}
                    </span>
                    <span
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 10,
                        fontWeight: 700,
                        color: f.featEnable ? "#dc2626" : "#94a3b8",
                        background: f.featEnable ? "#fff5f5" : "#f8fafc",
                        border: `1px solid ${f.featEnable ? "#fecaca" : "#e2e8f0"}`,
                        borderRadius: 4,
                        padding: "1px 6px",
                      }}
                    >
                      {f.featEnable ? valLabel : "Off"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Meta */}
            <div style={{ padding: "8px 18px 6px" }}>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 11,
                  color: "#94a3b8",
                  margin: 0,
                }}
              >
                Created {formatDate(plan.createdAt)}
              </p>
            </div>

            {/* Actions */}
            <div style={{ padding: "12px 18px 16px", display: "flex", gap: 8 }}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openEdit(plan)}
                style={{
                  flex: 1,
                  padding: "9px",
                  background: "#fff5f5",
                  border: "1px solid #fecaca",
                  borderRadius: 9,
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#dc2626",
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
                onClick={() => toggleAvailable(plan._id)}
                style={{
                  flex: 1,
                  padding: "9px",
                  background: plan.available ? "#fff5f5" : "#f0fdf4",
                  border: `1px solid ${plan.available ? "#fecaca" : "#86efac"}`,
                  borderRadius: 9,
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: plan.available ? "#dc2626" : "#16a34a",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                }}
              >
                {plan.available ? (
                  <>
                    <ToggleLeft size={13} /> Disable
                  </>
                ) : (
                  <>
                    <ToggleRight size={13} /> Enable
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setDeleteTarget(plan)}
                style={{
                  padding: "9px 12px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 9,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Trash2 size={13} color="#64748b" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <PlanModal
        open={modalOpen}
        initial={editTarget}
        onClose={closeModal}
        onSave={handleSave}
        saving={saving}
      />
      <ConfirmModal
        open={!!deleteTarget}
        name={deleteTarget?.subsciptionName}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
