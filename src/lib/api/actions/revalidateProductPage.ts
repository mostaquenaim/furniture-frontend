"use server";

import { revalidatePath } from "next/cache";

// The product page's JSON-LD and the homepage's product rails are ISR-cached;
// after a product is permanently deleted, mark them stale so the deleted
// product stops showing up right away. Revalidating only marks a page stale —
// the worst an anonymous caller can do is trigger one rebuild.
export async function revalidateProductPage(slug: string) {
  if (typeof slug !== "string" || !slug || slug.length > 300 || slug.includes("/")) {
    return;
  }
  revalidatePath(`/products/${slug}`);
  revalidatePath("/");
}
