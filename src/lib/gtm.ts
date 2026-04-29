export type GTMEvent =
  | { event: "view_item"; item_id: string; item_name: string; price: number }
  | {
      event: "add_to_wishlist";
      item_id: string;
      item_name: string;
      price: number;
    }
  | { event: "remove_from_wishlist"; item_id: string; item_name: string }
  | { event: "page_view"; page_path: string } 
  //now here 
  //now here 
  //now here 
  | { event: "sign_up"; method: "phone" | "google" }
  | { event: "login"; method: "phone" | "email" | "google" }
  | { event: "add_to_cart"; item_id: string; item_name: string; price: number }
  | { event: "remove_from_cart"; item_id: string }
  | { event: "begin_checkout"; value: number; currency: "BDT" }
  | {
      event: "purchase";
      transaction_id: string;
      value: number;
      currency: "BDT";
    }
  | { event: "search"; search_term: string };

export function pushGTMEvent(data: GTMEvent) {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_GTM_ID) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}
