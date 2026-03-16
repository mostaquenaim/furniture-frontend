"use client";

import { useState, useEffect, useCallback } from "react";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type AdminRole = "SUPERADMIN" | "PRODUCTMANAGER" | "ORDERMANAGER" | "SUPPORT";

interface AdminUser {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
}

interface InviteForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: AdminRole;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const ADMIN_ROLES: {
  key: AdminRole;
  label: string;
  color: string;
  bg: string;
  dot: string;
}[] = [
  {
    key: "SUPERADMIN",
    label: "Super Admin",
    color: "text-violet-700",
    bg: "bg-violet-50 border-violet-200",
    dot: "bg-violet-500",
  },
  {
    key: "PRODUCTMANAGER",
    label: "Product Manager",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    dot: "bg-blue-500",
  },
  {
    key: "ORDERMANAGER",
    label: "Order Manager",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    dot: "bg-emerald-500",
  },
  {
    key: "SUPPORT",
    label: "Support",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
  },
];

function getRoleMeta(role: AdminRole) {
  return ADMIN_ROLES.find((r) => r.key === role) ?? ADMIN_ROLES[0];
}

function getInitials(name: string | null, email: string | null): string {
  if (name)
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  if (email) return email[0].toUpperCase();
  return "?";
}

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

function avatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

// ─────────────────────────────────────────────────────────────────────────────
// Small components
// ─────────────────────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: AdminRole }) {
  const meta = getRoleMeta(role);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${meta.bg} ${meta.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
        active
          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
          : "bg-slate-50 border-slate-200 text-slate-500"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Invite Modal
// ─────────────────────────────────────────────────────────────────────────────
function InviteModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const axiosSecure = useAxiosSecure();
  const [form, setForm] = useState<InviteForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "PRODUCTMANAGER",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof InviteForm, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  async function submit() {
    if (!form.email || !form.password || !form.role) {
      setError("Email, password and role are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await axiosSecure.post("/admin/users", form);
      onSuccess();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Create admin user
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              New user will be able to log in immediately
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-400"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Full name"
              value={form.name}
              onChange={(v) => set("name", v)}
              placeholder="Jane Doe"
            />
            <Field
              label="Phone"
              value={form.phone}
              onChange={(v) => set("phone", v)}
              placeholder="+880..."
            />
          </div>
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => set("email", v)}
            placeholder="jane@example.com"
            required
          />
          <Field
            label="Password"
            type="password"
            value={form.password}
            onChange={(v) => set("password", v)}
            placeholder="Min. 8 characters"
            required
          />

          {/* Role selector */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ADMIN_ROLES.filter((r) => r.key !== "SUPERADMIN").map((r) => (
                <button
                  key={r.key}
                  onClick={() => set("role", r.key)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all text-sm ${
                    form.role === r.key
                      ? `${r.bg} ${r.color} ring-2 ring-offset-1 ring-amber-400 font-semibold`
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${r.dot}`} />
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="px-5 py-2 text-sm font-medium bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 transition"
          >
            {saving ? "Creating…" : "Create user"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder:text-slate-300"
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Role Change Dropdown (inline)
// ─────────────────────────────────────────────────────────────────────────────
function RoleDropdown({
  user,
  onUpdate,
}: {
  user: AdminUser;
  onUpdate: (id: number, role: AdminRole) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function pick(role: AdminRole) {
    if (role === user.role) return setOpen(false);
    setLoading(true);
    setOpen(false);
    await onUpdate(user.id, role);
    setLoading(false);
  }

  if (user.role === "SUPERADMIN") return <RoleBadge role={user.role} />;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        disabled={loading}
        className="flex items-center gap-1 group"
      >
        <RoleBadge role={user.role} />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`w-3 h-3 text-slate-400 transition-transform ${open ? "rotate-180" : ""} ${loading ? "animate-spin" : ""}`}
        >
          {loading ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0 1 15-4.5M20 15a9 9 0 0 1-15 4.5"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          )}
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1.5 z-20 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden min-w-[160px]">
            {ADMIN_ROLES.filter((r) => r.key !== "SUPERADMIN").map((r) => (
              <button
                key={r.key}
                onClick={() => pick(r.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition hover:bg-slate-50 ${
                  r.key === user.role
                    ? `${r.color} font-semibold`
                    : "text-slate-600"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${r.dot}`} />
                {r.label}
                {r.key === user.role && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    className="w-3 h-3 ml-auto"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Confirm modal (deactivate / reset password)
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmModal({
  title,
  description,
  confirmLabel,
  danger,
  onConfirm,
  onClose,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handle() {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="px-6 py-5">
          <h2 className="text-base font-semibold text-slate-800">{title}</h2>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handle}
            disabled={loading}
            className={`px-5 py-2 text-sm font-medium rounded-lg disabled:opacity-50 transition ${
              danger
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-slate-800 text-white hover:bg-slate-700"
            }`}
          >
            {loading ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Row action menu
// ─────────────────────────────────────────────────────────────────────────────
function ActionMenu({
  user,
  onDeactivate,
  onResetPassword,
}: {
  user: AdminUser;
  onDeactivate: () => void;
  onResetPassword: () => void;
}) {
  const [open, setOpen] = useState(false);

  if (user.role === "SUPERADMIN") return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-4 h-4"
        >
          <circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 z-20 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden min-w-[180px]">
            <button
              onClick={() => {
                setOpen(false);
                onResetPassword();
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z"
                />
              </svg>
              Reset password
            </button>
            <div className="border-t border-slate-100" />
            <button
              onClick={() => {
                setOpen(false);
                onDeactivate();
              }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition ${
                user.isActive
                  ? "text-red-600 hover:bg-red-50"
                  : "text-emerald-600 hover:bg-emerald-50"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-4 h-4"
              >
                {user.isActive ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                  />
                )}
              </svg>
              {user.isActive ? "Deactivate user" : "Reactivate user"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminUsersComponent() {
  const axiosSecure = useAxiosSecure();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<AdminRole | "ALL">("ALL");
  const [showInvite, setShowInvite] = useState(false);

  // Confirm modals
  const [deactivateTarget, setDeactivateTarget] = useState<AdminUser | null>(
    null,
  );
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);

  // ── Load ──────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/admin/users");
      setUsers(res.data);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    load();
  }, [load]);

  // ── Actions ───────────────────────────────────────────────────────────────
  async function changeRole(id: number, role: AdminRole) {
    await axiosSecure.patch(`/admin/users/${id}/role`, { role });
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  }

  async function toggleActive(user: AdminUser) {
    await axiosSecure.patch(`/admin/users/${user.id}/status`, {
      isActive: !user.isActive,
    });
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u)),
    );
  }

  async function resetPassword(user: AdminUser) {
    await axiosSecure.post(`/admin/users/${user.id}/reset-password`);
    // Backend sends reset email — nothing to update locally
  }

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = ADMIN_ROLES.map((r) => ({
    ...r,
    count: users.filter((u) => u.role === r.key).length,
  }));

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Admin Users</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage admin accounts and their roles
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Create user
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto space-y-5">
        {/* ── Role stat cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((r) => (
            <button
              key={r.key}
              onClick={() =>
                setRoleFilter((prev) => (prev === r.key ? "ALL" : r.key))
              }
              className={`rounded-xl border p-4 text-left transition-all shadow-sm hover:shadow-md ${
                roleFilter === r.key
                  ? r.bg + " ring-2 ring-offset-1 ring-amber-400"
                  : "bg-white border-slate-100"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${r.dot}`} />
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest ${roleFilter === r.key ? r.color : "text-slate-400"}`}
                >
                  {r.label}
                </span>
              </div>
              <p
                className={`text-2xl font-bold ${roleFilter === r.key ? r.color : "text-slate-700"}`}
              >
                {r.count}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">users</p>
            </button>
          ))}
        </div>

        {/* ── Search + filter ── */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-sm"
            />
          </div>
          {roleFilter !== "ALL" && (
            <button
              onClick={() => setRoleFilter("ALL")}
              className="text-xs px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            >
              ✕ Clear filter
            </button>
          )}
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-20 text-center">
              <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center text-slate-400 text-sm">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/60 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      User
                    </th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Role
                    </th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Status
                    </th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Joined
                    </th>
                    <th className="px-5 py-3 w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* User info */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor(user.id)}`}
                          >
                            {getInitials(user.name, user.email)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 text-[13px] leading-tight">
                              {user.name ?? (
                                <span className="text-slate-400 italic">
                                  No name
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {user.email ?? user.phone ?? "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role — inline dropdown */}
                      <td className="px-5 py-3.5">
                        <RoleDropdown user={user} onUpdate={changeRole} />
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <StatusBadge active={user.isActive} />
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-3.5 text-[12px] text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <ActionMenu
                          user={user}
                          onDeactivate={() => setDeactivateTarget(user)}
                          onResetPassword={() => setResetTarget(user)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {showInvite && (
        <InviteModal onClose={() => setShowInvite(false)} onSuccess={load} />
      )}

      {deactivateTarget && (
        <ConfirmModal
          title={
            deactivateTarget.isActive ? "Deactivate user" : "Reactivate user"
          }
          description={
            deactivateTarget.isActive
              ? `${deactivateTarget.name ?? deactivateTarget.email} will lose access to the admin panel immediately.`
              : `${deactivateTarget.name ?? deactivateTarget.email} will regain access to the admin panel.`
          }
          confirmLabel={deactivateTarget.isActive ? "Deactivate" : "Reactivate"}
          danger={deactivateTarget.isActive}
          onConfirm={() => toggleActive(deactivateTarget)}
          onClose={() => setDeactivateTarget(null)}
        />
      )}

      {resetTarget && (
        <ConfirmModal
          title="Reset password"
          description={`A password reset email will be sent to ${resetTarget.email ?? "this user"}.`}
          confirmLabel="Send reset email"
          onConfirm={() => resetPassword(resetTarget)}
          onClose={() => setResetTarget(null)}
        />
      )}
    </div>
  );
}
