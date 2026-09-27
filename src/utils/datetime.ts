// Shared helpers for every admin start/end window (product discounts,
// coupons, flash sales, urgency banners, seasonal categories), so all of them
// take a date AND time and round-trip it the same way.

/**
 * Formats a date as "YYYY-MM-DDTHH:mm" in the admin's local time — the value
 * format <input type="datetime-local"> expects. `new Date()` on that string
 * parses it back as local time, so load → save is lossless. Never use
 * `iso.slice(0, 16)` for this: that's the UTC wall-clock, which shifts the
 * time by the UTC offset on every edit.
 */
export const toDateTimeLocal = (
  value: Date | string | null | undefined,
): string => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/** A datetime-local value back to an ISO string for the API ("" → null). */
export const fromDateTimeLocal = (value: string): string | null =>
  value ? new Date(value).toISOString() : null;

/** Today at 00:00 local, as a datetime-local value. */
export const startOfTodayLocal = (): string => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return toDateTimeLocal(d);
};

/** Today at 23:59 local, as a datetime-local value. */
export const endOfTodayLocal = (): string => {
  const d = new Date();
  d.setHours(23, 59, 0, 0);
  return toDateTimeLocal(d);
};

/** Display format for a window endpoint: "27 Sep 2026, 14:30". */
export const formatDateTime = (value: Date | string | null | undefined) => {
  if (!value) return "";
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
