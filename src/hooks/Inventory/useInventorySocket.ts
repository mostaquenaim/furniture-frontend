/* eslint-disable react-hooks/refs */
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { StockUpdatedEvent, StockLowEvent } from "@/types/inventory";

const SOCKET_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(
  /\/api\/?$/,
  "",
);

interface Options {
  onStockUpdated?: (payload: StockUpdatedEvent) => void;
  onStockLow?: (payload: StockLowEvent) => void;
}

export default function useInventorySocket({
  onStockUpdated,
  onStockLow,
}: Options) {
  const { token } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const onStockUpdatedRef = useRef(onStockUpdated);
  const onStockLowRef = useRef(onStockLow);

  onStockUpdatedRef.current = onStockUpdated;
  onStockLowRef.current = onStockLow;

  useEffect(() => {
    if (!token) return;

    const socket = io(`${SOCKET_BASE}/inventory`, {
      auth: { token },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("stock:updated", (payload: StockUpdatedEvent) => {
      onStockUpdatedRef.current?.(payload);
    });

    socket.on("stock:low", (payload: StockLowEvent) => {
      onStockLowRef.current?.(payload);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);
}
