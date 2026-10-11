"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import { revalidateProductPage } from "@/lib/api/actions/revalidateProductPage";

type DeletePreview = {
  product: { id: number; title: string; slug: string };
  canDelete: boolean;
  blockers: string[];
  willRemove: {
    cartItems: number;
    wishlists: number;
    unusedPieces: number;
    flashSales: number;
  };
};

interface ProductDeleteModalProps {
  product: { slug: string; title: string };
  onClose: () => void;
  onDeleted: () => void;
}

const errorMessage = (err: unknown, fallback: string) => {
  const msg = (err as { response?: { data?: { message?: string | string[] } } })
    ?.response?.data?.message;
  return (Array.isArray(msg) ? msg.join(", ") : msg) || fallback;
};

// Permanent delete. The backend refuses products that were ordered or have
// physical stock; the preview surfaces that before the admin types anything.
export default function ProductDeleteModal({
  product,
  onClose,
  onDeleted,
}: ProductDeleteModalProps) {
  const axiosSecure = useAxiosSecure();
  const [preview, setPreview] = useState<DeletePreview | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    axiosSecure
      .get<DeletePreview>(
        `/product/${encodeURIComponent(product.slug)}/delete-preview`,
      )
      .then(({ data }) => {
        if (!cancelled) setPreview(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(errorMessage(err, "Couldn't check this product."));
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.slug]);

  const title = preview?.product.title ?? product.title;
  const confirmed = typed.trim() === title.trim();

  const handleDelete = async () => {
    if (!preview?.canDelete || !confirmed || isDeleting) return;
    setIsDeleting(true);
    try {
      await axiosSecure.delete(`/product/${encodeURIComponent(product.slug)}`);
      revalidateProductPage(product.slug).catch(() => {});
      toast.success(`"${title}" permanently deleted`);
      onDeleted();
    } catch (err) {
      toast.error(errorMessage(err, "Delete failed"));
      setIsDeleting(false);
    }
  };

  const removals = preview
    ? [
        [preview.willRemove.cartItems, "cart line(s)"],
        [preview.willRemove.wishlists, "wishlist item(s)"],
        [preview.willRemove.unusedPieces, "unreceived/voided barcode label(s)"],
        [preview.willRemove.flashSales, "flash sale listing(s)"],
      ].filter(([n]) => (n as number) > 0)
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={() => !isDeleting && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-delete-title"
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
          {preview && !preview.canDelete ? (
            <AlertTriangle size={24} />
          ) : (
            <Trash2 size={24} />
          )}
        </div>

        <h3
          id="product-delete-title"
          className="text-xl font-semibold text-gray-900 text-center mb-2"
        >
          {preview && !preview.canDelete
            ? "This product can't be deleted"
            : "Permanently delete product?"}
        </h3>

        {!preview && !loadError && (
          <p className="text-sm text-gray-500 text-center mb-6">Checking…</p>
        )}

        {loadError && (
          <p className="text-sm text-red-600 text-center mb-6">{loadError}</p>
        )}

        {preview && !preview.canDelete && (
          <div className="text-sm text-gray-600 mb-6 space-y-2">
            <p>
              <span className="font-medium text-gray-900">{title}</span> has
              history that must be kept:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              {preview.blockers.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <p>Disable it instead to hide it from customers.</p>
          </div>
        )}

        {preview?.canDelete && (
          <div className="text-sm text-gray-600 mb-6 space-y-3">
            <p>
              <span className="font-medium text-gray-900">{title}</span> and
              all its images, colors and sizes will be removed. This cannot be
              undone.
            </p>
            {removals.length > 0 && (
              <ul className="list-disc pl-5 space-y-1">
                {removals.map(([n, label]) => (
                  <li key={label as string}>
                    Also removes {n} {label}
                  </li>
                ))}
              </ul>
            )}
            <label className="block">
              <span className="block mb-1">
                Type <span className="font-semibold text-gray-900">{title}</span>{" "}
                to confirm
              </span>
              <input
                type="text"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                disabled={isDeleting}
                autoFocus
                className="w-full gray-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </label>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {preview?.canDelete ? "Cancel" : "Close"}
          </button>
          {preview?.canDelete && (
            <button
              onClick={handleDelete}
              disabled={!confirmed || isDeleting}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete forever"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
