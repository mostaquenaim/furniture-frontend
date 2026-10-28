import { Trash2 } from "lucide-react";
import { FC, ReactNode, useEffect, useState } from "react";

interface ConfirmationModalProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  // When set, the confirm button stays disabled until this exact text is typed.
  requireTypedText?: string;
  cancelText?: string;
  icon?: ReactNode;
  isLoading?: boolean;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal: FC<ConfirmationModalProps> = ({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  requireTypedText,
  cancelText = "Cancel",
  icon,
  isLoading,
  variant = "danger",
  onConfirm,
  onCancel,
}) => {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    setTyped("");
  }, [open, requireTypedText]);

  if (!open) return null;

  const typedOk =
    !requireTypedText || typed.trim() === requireTypedText.trim();

  const confirmStyle =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-slate-900 hover:bg-slate-800";

  const iconStyle =
    variant === "danger"
      ? "bg-red-100 text-red-600"
      : "bg-slate-100 text-slate-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
        {/* Icon */}
        <div
          className={`w-12 h-12 ${iconStyle} rounded-full flex items-center justify-center mb-4 mx-auto`}
        >
          {icon ?? <Trash2 size={24} />}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-sm text-gray-500 text-center mb-6">{message}</p>

        {requireTypedText && (
          <label className="block text-sm text-gray-600 mb-6">
            <span className="block mb-1">
              Type{" "}
              <span className="font-semibold text-gray-900">
                {requireTypedText}
              </span>{" "}
              to confirm
            </span>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && typedOk && !isLoading) onConfirm();
              }}
              disabled={isLoading}
              autoFocus
              className="w-full gray-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </label>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading || !typedOk}
            className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${confirmStyle}`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
