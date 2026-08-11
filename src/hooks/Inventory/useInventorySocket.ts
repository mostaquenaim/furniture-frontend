/* eslint-disable react-hooks/refs */
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import {
  StockUpdatedEvent,
  StockLowEvent,
  ReturnStartedEvent,
} from "@/types/inventory";

const SOCKET_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(
  /\/api\/?$/,
  "",
);

interface Options {
  onStockUpdated?: (payload: StockUpdatedEvent) => void;
  onStockLow?: (payload: StockLowEvent) => void;
  onReturnStarted?: (payload: ReturnStartedEvent) => void;
}

export default function useInventorySocket({
  onStockUpdated,
  onStockLow,
  onReturnStarted,
}: Options) {
  const { token } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const onStockUpdatedRef = useRef(onStockUpdated);
  const onStockLowRef = useRef(onStockLow);
  const onReturnStartedRef = useRef(onReturnStarted);

  onStockUpdatedRef.current = onStockUpdated;
  onStockLowRef.current = onStockLow;
  onReturnStartedRef.current = onReturnStarted;

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

    socket.on("return:started", (payload: ReturnStartedEvent) => {
      onReturnStartedRef.current?.(payload);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);
}
