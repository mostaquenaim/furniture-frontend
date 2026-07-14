export type PieceStatus =
  | "CREATED"
  | "DAMAGED_INCOMING"
  | "IN_STOCK"
  | "RESERVED"
  | "PICKED"
  | "SHIPPED"
  | "DELIVERED"
  | "RETURNING"
  | "RETURNED_IN_STOCK"
  | "DAMAGED_RETURN";

export type ReceiveOutcome = "GOOD" | "DAMAGED";

export interface PieceLocation {
  id: string;
  code: string;
  zone: string;
  aisle: string;
  shelf: string;
  bin: string;
  label?: string | null;
}

export interface PieceSupplier {
  id: number;
  name: string;
}

export interface Piece {
  id: number;
  barcodeValue: string;
  productSizeId: number;
  status: PieceStatus;
  locationId: string | null;
  receiveBatchId: string | null;
  createdAt: string;
  updatedAt: string;
  supplier?: PieceSupplier | null;
  location?: PieceLocation | null;
  productSize: {
    id: number;
    sku: string | null;
    size: { name: string };
    color: {
      color: { name: string };
      product: { id: number; title: string; slug: string; sku: string | null };
    };
  };
}

export interface ReceiveBatchResult {
  receiveBatchId: string;
  succeeded: Piece[];
  failed: { barcodeValue: string; error: string }[];
}
