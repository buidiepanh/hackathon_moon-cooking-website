import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  BookOpen,
  Plus,
  Search,
  Star,
  Clock,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  Video,
  ListOrdered,
  Calendar,
  Hash,
  Eye,
} from "lucide-react";
import {
  addNewReceipt,
  addNewStep,
  deleteReceipt,
  deleteStep,
  getAllMyReceipts,
  getAllSteps,
  getAuthenUser,
  updateReceipt,
  updateStep,
} from "../../../services/apiServices";
import { useNavigate } from "react-router";

// ─── Fonts ────────────────────────────────────────────────────────────────────
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const avgRating = (arr) => {
  if (!arr?.length) return null;
  return (arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(1);
};
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
const genId = () =>
  Date.now().toString(16) + Math.random().toString(16).slice(2, 8);

// ─── Sub-components ───────────────────────────────────────────────────────────
function StarRow({ value, size = 13 }) {
  const n = Math.round(Number(value));
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          color={s <= n ? "#f59e0b" : "#d1d5db"}
          fill={s <= n ? "#f59e0b" : "#f3f4f6"}
        />
      ))}
    </div>
  );
}

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
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
            zIndex: 300,
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
                {title}
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
              {message}
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

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, required, children, hint }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 13,
          fontWeight: 600,
          color: "#374151",
          display: "flex",
          gap: 4,
        }}
      >
        {label}
        {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      {children}
      {hint && (
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
    </div>
  );
}

const inputStyle = (focus) => ({
  padding: "10px 13px",
  background: focus ? "#fff" : "#f8fafc",
  border: `1.5px solid ${focus ? "#2563eb" : "#e2e8f0"}`,
  borderRadius: 10,
  fontFamily: "'DM Sans',sans-serif",
  fontSize: 14,
  color: "#1e293b",
  outline: "none",
  transition: "all 0.2s",
  boxShadow: focus ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
  width: "100%",
  boxSizing: "border-box",
});

function TextInput({ value, onChange, placeholder, type = "text" }) {
  const [f, setF] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={() => setF(true)}
      onBlur={() => setF(false)}
      style={inputStyle(f)}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }) {
  const [f, setF] = useState(false);
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      onFocus={() => setF(true)}
      onBlur={() => setF(false)}
      style={{ ...inputStyle(f), resize: "vertical" }}
    />
  );
}

const STEP_BLANK = { stepName: "", description: "", image: "", video: "" };

function StepModal({ open, initial, onClose, onSave }) {
  const [form, setForm] = useState(STEP_BLANK);

  // ── FIX: sync form whenever `initial` or `open` changes ──────────────────
  useEffect(() => {
    if (open) {
      if (initial) {
        setForm({
          stepName: initial.stepName ?? "",
          description: initial.description ?? "",
          image: initial.image ?? "",
          video: initial.video ?? "",
        });
      } else {
        setForm(STEP_BLANK);
      }
    }
  }, [open, initial]);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSave = () => {
    if (!form.stepName.trim()) {
      toast.error("Step name is required.");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Description is required.");
      return;
    }
    onSave({ ...form, image: form.image || null, video: form.video || null });
  };

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
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
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
              maxWidth: 520,
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "22px 24px 18px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "sticky",
                top: 0,
                background: "#fff",
                zIndex: 1,
                borderRadius: "22px 22px 0 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ListOrdered size={17} color="#2563eb" />
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
                  {initial ? "Edit Step" : "New Step"}
                </h2>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={16} color="#64748b" />
              </button>
            </div>

            {/* Form body */}
            <div
              style={{
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <Field label="Step Name" required>
                <TextInput
                  value={form.stepName}
                  onChange={set("stepName")}
                  placeholder="e.g. Wash ingredients"
                />
              </Field>

              <Field label="Description" required>
                <TextArea
                  value={form.description}
                  onChange={set("description")}
                  placeholder="Describe this step in detail..."
                  rows={4}
                />
              </Field>

              <Field
                label="Image URL"
                hint="Optional — paste a direct image link (jpg, png, webp)"
              >
                <div style={{ position: "relative" }}>
                  <ImageIcon
                    size={14}
                    color="#94a3b8"
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                  <input
                    value={form.image}
                    onChange={set("image")}
                    placeholder="https://example.com/image.jpg"
                    style={{ ...inputStyle(false), paddingLeft: 34 }}
                  />
                </div>
                {form.image && (
                  <img
                    src={form.image}
                    alt="preview"
                    style={{
                      marginTop: 6,
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                    }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
              </Field>

              <Field
                label="Video URL"
                hint="Optional — paste a direct video link (mp4, youtube, etc.)"
              >
                <div style={{ position: "relative" }}>
                  <Video
                    size={14}
                    color="#94a3b8"
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                  <input
                    value={form.video}
                    onChange={set("video")}
                    placeholder="https://example.com/video.mp4"
                    style={{ ...inputStyle(false), paddingLeft: 34 }}
                  />
                </div>
              </Field>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "16px 24px 22px",
                borderTop: "1px solid #f1f5f9",
                display: "flex",
                gap: 10,
                position: "sticky",
                bottom: 0,
                background: "#fff",
                borderRadius: "0 0 22px 22px",
              }}
            >
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 11,
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                style={{
                  flex: 2,
                  padding: "11px",
                  background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                  border: "none",
                  borderRadius: 11,
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
                }}
              >
                <CheckCircle2 size={15} />
                {initial ? "Save Changes" : "Create Step"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ReceiptModal({ open, initial, allSteps, onClose, onSave }) {
  const [form, setForm] = useState({ foodName: "", steps: [] });
  const [stepSearch, setStepSearch] = useState("");

  useEffect(() => {
    if (open) {
      if (initial) {
        // Edit mode: populate ALL fields from the receipt being edited
        setForm({
          foodName: initial.foodName ?? "",
          steps: Array.isArray(initial.steps) ? [...initial.steps] : [],
        });
      } else {
        // Create mode: blank form, pre-select first available step
        setForm({
          foodName: "",
          steps: allSteps.length > 0 ? [allSteps[0]._id] : [],
        });
      }
      setStepSearch("");
    }
  }, [open, initial]); // eslint-disable-line react-hooks/exhaustive-deps

  const addStep = (id) => {
    if (!form.steps.includes(id))
      setForm((p) => ({ ...p, steps: [...p.steps, id] }));
  };

  const removeStep = (id) =>
    setForm((p) => ({ ...p, steps: p.steps.filter((s) => s !== id) }));

  const availableSteps = allSteps.filter(
    (s) =>
      !form.steps.includes(s._id) &&
      s.stepName.toLowerCase().includes(stepSearch.toLowerCase()),
  );

  const handleSave = () => {
    if (!form.foodName.trim()) {
      toast.error("Food name is required.");
      return;
    }
    if (!form.steps.length) {
      toast.error("At least one step is required.");
      return;
    }
    onSave(form);
  };

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
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
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
              maxWidth: 560,
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "22px 24px 18px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "sticky",
                top: 0,
                background: "#fff",
                zIndex: 1,
                borderRadius: "22px 22px 0 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BookOpen size={17} color="#2563eb" />
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
                  {initial ? "Edit Recipe" : "New Recipe"}
                </h2>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={16} color="#64748b" />
              </button>
            </div>

            {/* Form body */}
            <div
              style={{
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {/* Food Name */}
              <Field label="Food Name" required>
                <TextInput
                  value={form.foodName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, foodName: e.target.value }))
                  }
                  placeholder="e.g. Mixed Salad"
                />
              </Field>

              {/* Current steps in recipe */}
              <Field
                label="Steps in Recipe"
                required
                hint="These step IDs will be saved to the recipe"
              >
                <div
                  style={{
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  {form.steps.length === 0 ? (
                    <div
                      style={{
                        padding: "16px",
                        textAlign: "center",
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 13,
                        color: "#94a3b8",
                      }}
                    >
                      No steps added yet. Add from below.
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: 10,
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      {form.steps.map((sid, idx) => {
                        const s = allSteps.find((st) => st._id === sid);
                        return (
                          <div
                            key={sid}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: "9px 12px",
                              background: "#eff6ff",
                              border: "1px solid #bfdbfe",
                              borderRadius: 9,
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "'DM Sans',sans-serif",
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#2563eb",
                                minWidth: 22,
                                textAlign: "center",
                                background: "#dbeafe",
                                borderRadius: 5,
                                padding: "1px 5px",
                              }}
                            >
                              {idx + 1}
                            </span>
                            <span
                              style={{
                                flex: 1,
                                fontFamily: "'DM Sans',sans-serif",
                                fontSize: 13,
                                fontWeight: 500,
                                color: "#1e293b",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {s ? (
                                s.stepName
                              ) : (
                                <span
                                  style={{
                                    color: "#94a3b8",
                                    fontStyle: "italic",
                                  }}
                                >
                                  Unknown step ({sid.slice(-6)})
                                </span>
                              )}
                            </span>
                            <button
                              onClick={() => removeStep(sid)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#dc2626",
                                padding: 2,
                                display: "flex",
                              }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Field>

              {/* Add step selector */}
              <Field
                label="Add Steps"
                hint="Search and click to add steps to this recipe"
              >
                <div style={{ position: "relative", marginBottom: 8 }}>
                  <Search
                    size={14}
                    color="#94a3b8"
                    style={{
                      position: "absolute",
                      left: 11,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                  <input
                    value={stepSearch}
                    onChange={(e) => setStepSearch(e.target.value)}
                    placeholder="Search steps..."
                    style={{
                      ...inputStyle(false),
                      paddingLeft: 32,
                      padding: "8px 13px 8px 32px",
                    }}
                  />
                </div>
                <div
                  style={{
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 10,
                    maxHeight: 180,
                    overflowY: "auto",
                  }}
                >
                  {availableSteps.length === 0 ? (
                    <div
                      style={{
                        padding: "14px",
                        textAlign: "center",
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 13,
                        color: "#94a3b8",
                      }}
                    >
                      {stepSearch
                        ? "No steps match your search"
                        : "All steps already added"}
                    </div>
                  ) : (
                    availableSteps.map((s) => (
                      <button
                        key={s._id}
                        onClick={() => addStep(s._id)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 14px",
                          background: "none",
                          border: "none",
                          borderBottom: "1px solid #f1f5f9",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#f0f9ff")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "none")
                        }
                      >
                        <Plus size={14} color="#2563eb" />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontFamily: "'DM Sans',sans-serif",
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#0f172a",
                              margin: 0,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {s.stepName}
                          </p>
                          <p
                            style={{
                              fontFamily: "'DM Sans',sans-serif",
                              fontSize: 11,
                              color: "#94a3b8",
                              margin: 0,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {s.description}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </Field>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "14px 24px 22px",
                borderTop: "1px solid #f1f5f9",
                display: "flex",
                gap: 10,
                position: "sticky",
                bottom: 0,
                background: "#fff",
                borderRadius: "0 0 22px 22px",
              }}
            >
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 11,
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                style={{
                  flex: 2,
                  padding: "11px",
                  background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                  border: "none",
                  borderRadius: 11,
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
                }}
              >
                <CheckCircle2 size={15} />
                {initial ? "Save Changes" : "Create Recipe"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ReceiptsTab({ receipts, setReceipts, allSteps }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = receipts.filter((r) =>
    r.foodName.toLowerCase().includes(search.toLowerCase()),
  );

  const fetchAuthenUser = async () => {
    try {
      const res = await getAuthenUser();
      setUser(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAuthenUser();
  }, []);

  const openNew = () => {
    setEditTarget(null);
    setModalOpen(true);
  };
  const openEdit = (r) => {
    setEditTarget(r);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleSave = async (form) => {
    if (editTarget) {
      const payload = {
        foodName: form.foodName,
        steps: form.steps,
        updatedAt: new Date().toISOString(),
      };
      const res = await updateReceipt(editTarget._id, payload);
      if (res) {
        toast.success(`${form.foodName} updated successfully!`);
      } else {
        toast.error(`${form.foodName} updated failed!`);
      }
    } else {
      const newR = {
        _id: genId(),
        foodName: form.foodName,
        createdByChef: user._id,
        steps: form.steps,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
        rating: [],
      };
      const res = await addNewReceipt(newR);
      if (res) {
        toast.success(`${form.foodName} created successfully!`);
      } else {
        toast.error(`${form.foodName} created failed!`);
      }
    }
    closeModal();
  };

  const confirmDelete = async () => {
    try {
      const res = await deleteReceipt(deleteTarget._id);

      if (res) {
        toast.success(`${deleteTarget.foodName} deleted success!`);
      } else {
        toast.error(`${deleteTarget.foodName} deleted failed!.`);
      }

      setDeleteTarget(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          gap: 14,
          flexWrap: "wrap",
        }}
      >
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
            placeholder="Search recipes..."
            style={{
              ...inputStyle(false),
              paddingLeft: 36,
              padding: "10px 13px 10px 36px",
            }}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={openNew}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "10px 20px",
            background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
            border: "none",
            borderRadius: 11,
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
            whiteSpace: "nowrap",
          }}
        >
          <Plus size={15} /> New Recipe
        </motion.button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 14,
          marginBottom: 24,
        }}
        className="rm-stats"
      >
        {[
          {
            icon: BookOpen,
            label: "Total Recipes",
            value: receipts.length,
            color: "#2563eb",
            bg: "#eff6ff",
          },
          {
            icon: Star,
            label: "Avg. Rating",
            value: (() => {
              const all = receipts.flatMap((r) => r.rating);
              return all.length
                ? (all.reduce((s, v) => s + v, 0) / all.length).toFixed(1)
                : "—";
            })(),
            color: "#d97706",
            bg: "#fffbeb",
          },
          {
            icon: Eye,
            label: "Total Reviews",
            value: receipts.reduce((s, r) => s + r.rating.length, 0),
            color: "#16a34a",
            bg: "#f0fdf4",
          },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div
            key={label}
            style={{
              background: "#fff",
              border: "1.5px solid #e0e7ff",
              borderRadius: 14,
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
                  fontSize: 12,
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

      {/* Cards */}
      {filtered.length === 0 ? (
        <div
          style={{ textAlign: "center", padding: "56px 0", color: "#94a3b8" }}
        >
          <BookOpen
            size={42}
            color="#cbd5e1"
            style={{ margin: "0 auto 12px", display: "block" }}
          />
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15 }}>
            No recipes found
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 18,
          }}
        >
          {filtered.map((r, i) => {
            const avg = avgRating(r.rating);
            const stepObjs = r.steps
              .map((sid) => allSteps.find((s) => s._id === sid))
              .filter(Boolean);

            return (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  background: "#fff",
                  border: "1.5px solid #e0e7ff",
                  borderRadius: 18,
                  overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(30,58,138,0.07)",
                }}
              >
                <div style={{ padding: "16px 18px 18px" }}>
                  {/* Title + rating */}
                  <div style={{ marginBottom: 12 }}>
                    <h3
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#0f172a",
                        margin: "0 0 5px",
                      }}
                    >
                      {r.foodName}
                    </h3>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      {avg ? (
                        <>
                          <StarRow value={avg} />
                          <span
                            style={{
                              fontFamily: "'DM Sans',sans-serif",
                              fontSize: 12,
                              color: "#64748b",
                            }}
                          >
                            {avg} · {r.rating.length} ratings
                          </span>
                        </>
                      ) : (
                        <span
                          style={{
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 12,
                            color: "#94a3b8",
                          }}
                        >
                          No ratings yet
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Meta chips */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                      marginBottom: 14,
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 12,
                        color: "#64748b",
                      }}
                    >
                      <ListOrdered size={12} color="#94a3b8" />
                      {r.steps.length} step{r.steps.length !== 1 ? "s" : ""}
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 12,
                        color: "#64748b",
                      }}
                    >
                      <Calendar size={12} color="#94a3b8" />
                      {formatDate(r.createdAt)}
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 12,
                        color: "#64748b",
                      }}
                    >
                      <Hash size={12} color="#94a3b8" />
                      {r._id.slice(-6)}
                    </span>
                  </div>

                  {/* Steps preview */}
                  <div style={{ marginBottom: 14 }}>
                    <p
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        margin: "0 0 6px",
                      }}
                    >
                      Steps
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      {stepObjs.slice(0, 3).map((s, idx) => (
                        <div
                          key={s._id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            padding: "5px 9px",
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: 7,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'DM Sans',sans-serif",
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#2563eb",
                              background: "#dbeafe",
                              borderRadius: 4,
                              padding: "1px 5px",
                            }}
                          >
                            {idx + 1}
                          </span>
                          <span
                            style={{
                              fontFamily: "'DM Sans',sans-serif",
                              fontSize: 12,
                              color: "#374151",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {s.stepName}
                          </span>
                        </div>
                      ))}
                      {stepObjs.length > 3 && (
                        <p
                          style={{
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 11,
                            color: "#94a3b8",
                            margin: "2px 0 0",
                            paddingLeft: 4,
                          }}
                        >
                          +{stepObjs.length - 3} more steps
                        </p>
                      )}
                      {stepObjs.length === 0 && (
                        <p
                          style={{
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 12,
                            color: "#94a3b8",
                            fontStyle: "italic",
                          }}
                        >
                          No steps linked
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => openEdit(r)}
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
                      onClick={() => setDeleteTarget(r)}
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
                      <Trash2 size={13} /> Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <ReceiptModal
        open={modalOpen}
        initial={editTarget}
        allSteps={allSteps}
        onClose={closeModal}
        onSave={handleSave}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Recipe"
        message={`Are you sure you want to delete "${deleteTarget?.foodName}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function StepsTab({ steps, setSteps }) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = steps.filter(
    (s) =>
      s.stepName.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()),
  );

  const openNew = () => {
    setEditTarget(null);
    setModalOpen(true);
  };
  const openEdit = (s) => {
    setEditTarget(s);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleSave = async (form) => {
    if (editTarget) {
      const payload = {
        stepName: form.stepName,
        description: form.description,
        image: form.image,
        video: form.video,
        updatedAt: new Date().toISOString(),
      };

      const res = await updateStep(editTarget._id, payload);
      if (res) {
        toast.success(`${form.stepName} updated successfull!`);
      } else {
        toast.error(`${form.stepName} updated failed!`);
      }
    } else {
      const res = await addNewStep(form);
      if (res) {
        toast.success(`${form.stepName} created successfull!`);
      } else {
        toast.error(`${form.stepName} created failed!`);
      }
    }
    closeModal();
  };

  const confirmDelete = async () => {
    try {
      const res = await deleteStep(deleteTarget._id);

      if (res) {
        toast.success(`${deleteTarget.stepName} deleted successfull!`);
      } else {
        toast.error(`${deleteTarget.stepName} deleted failed!`);
      }

      setDeleteTarget(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          gap: 14,
          flexWrap: "wrap",
        }}
      >
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
            placeholder="Search steps..."
            style={{
              ...inputStyle(false),
              paddingLeft: 36,
              padding: "10px 13px 10px 36px",
            }}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={openNew}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "10px 20px",
            background: "linear-gradient(135deg,#0891b2,#0e7490)",
            border: "none",
            borderRadius: 11,
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(8,145,178,0.35)",
            whiteSpace: "nowrap",
          }}
        >
          <Plus size={15} /> New Step
        </motion.button>
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          border: "1.5px solid #e0e7ff",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(30,58,138,0.07)",
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr auto auto auto",
            gap: 0,
            background: "#f8fafc",
            borderBottom: "1.5px solid #e0e7ff",
            padding: "12px 18px",
          }}
        >
          {["Step Name", "Description", "Image", "Video", "Actions"].map(
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
            style={{
              textAlign: "center",
              padding: "48px 0",
              color: "#94a3b8",
            }}
          >
            <ListOrdered
              size={36}
              color="#cbd5e1"
              style={{ margin: "0 auto 10px", display: "block" }}
            />
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>
              No steps found
            </p>
          </div>
        ) : (
          filtered.map((s, i) => (
            <motion.div
              key={s._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr auto auto auto",
                gap: 0,
                padding: "14px 18px",
                borderBottom:
                  i < filtered.length - 1 ? "1px solid #f1f5f9" : "none",
                alignItems: "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fafbff")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <div style={{ paddingRight: 12 }}>
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
                  {s.stepName}
                </p>
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 10,
                    color: "#94a3b8",
                    margin: "2px 0 0",
                  }}
                >
                  #{s._id.slice(-6)}
                </p>
              </div>

              <div style={{ paddingRight: 12 }}>
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 13,
                    color: "#475569",
                    margin: 0,
                    lineHeight: 1.45,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {s.description}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingRight: 16,
                }}
              >
                {s.image ? (
                  <a href={s.image} target="_blank" rel="noreferrer">
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 7,
                        overflow: "hidden",
                        border: "1.5px solid #e0e7ff",
                      }}
                    >
                      <img
                        src={s.image}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) =>
                          (e.target.parentElement.innerHTML =
                            '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:#f1f5f9;font-size:11px">✓</div>')
                        }
                      />
                    </div>
                  </a>
                ) : (
                  <span
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 11,
                      color: "#cbd5e1",
                    }}
                  >
                    —
                  </span>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingRight: 16,
                }}
              >
                {s.video ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                      padding: "2px 7px",
                      background: "#ecfeff",
                      border: "1px solid #a5f3fc",
                      borderRadius: 5,
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#0891b2",
                    }}
                  >
                    <Video size={10} /> Yes
                  </span>
                ) : (
                  <span
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 11,
                      color: "#cbd5e1",
                    }}
                  >
                    —
                  </span>
                )}
              </div>

              <div style={{ display: "flex", gap: 6 }}>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => openEdit(s)}
                  style={{
                    width: 32,
                    height: 32,
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Edit2 size={14} color="#1d4ed8" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setDeleteTarget(s)}
                  style={{
                    width: 32,
                    height: 32,
                    background: "#fff5f5",
                    border: "1px solid #fecaca",
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Trash2 size={14} color="#dc2626" />
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <StepModal
        open={modalOpen}
        initial={editTarget}
        onClose={closeModal}
        onSave={handleSave}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Step"
        message={`Are you sure you want to delete "${deleteTarget?.stepName}"? Steps removed here will still remain in any recipes that reference them.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default function ReceiptManagement() {
  const [activeTab, setActiveTab] = useState("receipts");
  const [receipts, setReceipts] = useState([]);
  const [steps, setSteps] = useState([]);

  const fetchData = async () => {
    try {
      const res1 = await getAllMyReceipts();
      setReceipts(res1);
      const res2 = await getAllSteps();
      setSteps(res2);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const tabs = [
    { id: "receipts", label: "Recipes", icon: BookOpen },
    { id: "steps", label: "Step Management", icon: ListOrdered },
  ];

  return (
    <>
      <FontLink />

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 28,
            fontWeight: 800,
            color: "#0f172a",
            margin: 0,
          }}
        >
          Recipe Management
        </h1>
        <p
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 14,
            color: "#64748b",
            margin: "4px 0 0",
          }}
        >
          Manage your recipes and cooking steps
        </p>
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 26,
          background: "#f1f5f9",
          borderRadius: 14,
          padding: 5,
          width: "fit-content",
        }}
      >
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <motion.button
              key={id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "9px 20px",
                background: active ? "#ffffff" : "transparent",
                border: "none",
                borderRadius: 10,
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 14,
                fontWeight: active ? 700 : 500,
                color: active ? "#1d4ed8" : "#64748b",
                cursor: "pointer",
                boxShadow: active ? "0 2px 8px rgba(30,58,138,0.1)" : "none",
                transition: "all 0.2s",
              }}
            >
              <Icon size={15} color={active ? "#1d4ed8" : "#94a3b8"} />
              {label}
            </motion.button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
        >
          {activeTab === "receipts" && (
            <ReceiptsTab
              receipts={receipts}
              setReceipts={setReceipts}
              allSteps={steps}
            />
          )}
          {activeTab === "steps" && (
            <StepsTab steps={steps} setSteps={setSteps} />
          )}
        </motion.div>
      </AnimatePresence>

      <style>{`
        * { box-sizing: border-box; }
        @media (max-width: 640px) {
          .rm-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
