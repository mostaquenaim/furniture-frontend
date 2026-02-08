/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type Ticket = {
  id: number;
  subject: string;
  message: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
};

const statusStyles: Record<Ticket["status"], string> = {
  OPEN: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  RESOLVED: "bg-green-100 text-green-800",
};

const Tickets = () => {
  const axiosSecure = useAxiosSecure();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axiosSecure.get("/support/my-tickets");

        // Only show active tickets
        const activeTickets = res.data.filter(
          (t: Ticket) => t.status !== "RESOLVED",
        );

        setTickets(activeTickets);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [axiosSecure]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-semibold mb-2">My Support Tickets</h1>
          <p className="text-sm text-gray-500">
            Track your open support requests
          </p>
        </header>

        {/* Tickets */}
        {tickets.length === 0 ? (
          <div className="text-center text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg py-16">
            You have no open support tickets.
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white border border-gray-200 rounded-lg p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">
                      {ticket.subject}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {ticket.message}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${statusStyles[ticket.status]}`}
                  >
                    {ticket.status.replace("_", " ")}
                  </span>
                </div>

                <div className="mt-3 text-xs text-gray-400">
                  Created on {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;
