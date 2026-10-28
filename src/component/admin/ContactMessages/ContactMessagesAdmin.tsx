"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  FilterSelect,
  RefreshButton,
  AdminTable,
  MetaPagination,
  PageHeader,
} from "@/component/Shared/Admin/AdminUI/AdminUI";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import { useAuth } from "@/context/AuthContext";
import { refreshAdminBadges } from "@/hooks/Admin/useAdminBadgeCounts";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  orderNumber: string | null;
  subject: string;
  message: string;
  handledAt: string | null;
  createdAt: string;
}

interface PaginatedContactMessages {
  data: ContactMessage[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

type StatusFilter = "open" | "handled";

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: "Open", value: "open" },
  { label: "Handled", value: "handled" },
];

const fmtDate = (d: string) =>
  new Date(d).toLocaleString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const LIMIT = 20;

export default function ContactMessagesAdmin() {
  const axiosSecure = useAxiosSecure();
  const { token, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<StatusFilter | "">("open");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["admin-contact-messages", page, status, token],
    queryFn: async () => {
      const res = await axiosSecure.get<PaginatedContactMessages>(
        "/contact/messages",
        { params: { page, limit: LIMIT, ...(status ? { status } : {}) } },
      );
      return res.data;
    },
    enabled: !authLoading && !!token,
  });

  const toggleHandled = useMutation({
    mutationFn: ({ id, handled }: { id: number; handled: boolean }) =>
      axiosSecure.patch(`/contact/messages/${id}`, { handled }),
    onSuccess: (_res, { handled }) => {
      toast.success(handled ? "Marked as handled" : "Moved back to open");
      queryClient.invalidateQueries({ queryKey: ["admin-contact-messages"] });
      refreshAdminBadges();
    },
    onError: () => toast.error("Could not update the message"),
  });

  const rows = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, page: 1, limit: LIMIT, totalPages: 1 };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Support" title="Contact Messages" />

      <div className="space-y-5">
        <div className="flex items-center gap-3 flex-wrap">
          <FilterSelect
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={STATUS_OPTIONS}
            placeholder="All Messages"
          />
          <RefreshButton
            onClick={() => refetch()}
            loading={isLoading || isFetching}
          />
        </div>

        <AdminTable
          headers={["Subject", "From", "Order", "Received", "Status", ""]}
          loading={isLoading || authLoading}
          empty={rows.length === 0}
        >
          {rows.map((m) => {
            const expanded = expandedId === m.id;
            const handled = !!m.handledAt;
            return (
              <React.Fragment key={m.id}>
                <tr
                  onClick={() => setExpandedId(expanded ? null : m.id)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <p className="text-xs font-medium text-gray-900 leading-tight max-w-xs truncate">
                      {m.subject}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">#{m.id}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs font-medium text-gray-900 leading-tight">
                      {m.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{m.email}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs text-gray-600">
                      {m.orderNumber ?? <span className="text-gray-400">—</span>}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs text-gray-500">{fmtDate(m.createdAt)}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                        handled
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          handled ? "bg-emerald-500" : "bg-amber-400"
                        }`}
                      />
                      {handled ? "Handled" : "Open"}
                    </span>
                  </td>
                  <td className="px-4 py-4 pr-6 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleHandled.mutate({ id: m.id, handled: !handled });
                      }}
                      disabled={toggleHandled.isPending}
                      className="text-xs font-medium text-indigo-600 hover:underline disabled:opacity-50"
                    >
                      {handled ? "Reopen" : "Mark handled"}
                    </button>
                  </td>
                </tr>
                {expanded && (
                  <tr className="bg-gray-50">
                    <td colSpan={6} className="px-6 py-4">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap wrap-break-word">
                        {m.message}
                      </p>
                      <a
                        href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}
                        className="inline-block mt-3 text-xs font-medium text-indigo-600 hover:underline"
                      >
                        Reply by email
                      </a>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </AdminTable>

        <MetaPagination
          meta={meta}
          page={page}
          onPageChange={setPage}
          limit={LIMIT}
        />
      </div>
    </div>
  );
}
