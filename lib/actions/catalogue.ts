"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { productEnquiries, products } from "@/lib/db/schema";
import { productEnquirySchema } from "@/lib/validation/schemas";
import { verifyTurnstile } from "@/lib/turnstile";
import { notifyAdminOfProductEnquiry } from "@/lib/email";

export type ProductEnquiryState = {
  errors?: Record<string, string[]>;
  formError?: string;
};

export async function submitProductEnquiry(
  productId: number,
  _prevState: ProductEnquiryState,
  formData: FormData,
): Promise<ProductEnquiryState> {
  const parsed = productEnquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    organisation: formData.get("organisation"),
    message: formData.get("message"),
    type: formData.get("type"),
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const ip = (await headers()).get("cf-connecting-ip") ?? undefined;
  const verified = await verifyTurnstile(formData.get("cf-turnstile-response") as string | null, ip);
  if (!verified) {
    return { formError: "We couldn't verify you're human — please try again." };
  }

  const db = getDb();
  const [product] = await db
    .select({ id: products.id, name: products.name })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);
  if (!product) return { formError: "This product is no longer available." };

  await db.insert(productEnquiries).values({
    productId,
    type: parsed.data.type,
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    organisation: parsed.data.organisation || null,
    message: parsed.data.message || null,
  });

  await notifyAdminOfProductEnquiry({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    organisation: parsed.data.organisation,
    productName: product.name,
    type: parsed.data.type,
    message: parsed.data.message,
  });

  redirect("/products/enquiry-received");
}
