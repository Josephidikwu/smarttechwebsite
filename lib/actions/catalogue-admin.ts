"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import type { z } from "zod";
import { getDb } from "@/lib/db/client";
import {
  brands,
  categories,
  products,
  productEnquiries,
  statusHistory,
  type EnquiryStatus,
} from "@/lib/db/schema";
import { brandSchema, categorySchema, productSchema } from "@/lib/validation/schemas";
import { requireUser } from "@/lib/auth/rbac";
import { slugify } from "@/lib/utils/slugify";

async function uniqueSlug(db: ReturnType<typeof getDb>, table: typeof brands | typeof categories | typeof products, name: string) {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let n = 1;
  for (;;) {
    const [existing] = await db.select({ id: table.id }).from(table).where(eq(table.slug, slug));
    if (!existing) return slug;
    slug = `${baseSlug}-${++n}`;
  }
}

// ------------------------------------------------------------------- Brands

export type SimpleFormState = { errors?: Record<string, string[]>; formError?: string };

export async function createBrand(_prevState: SimpleFormState, formData: FormData): Promise<SimpleFormState> {
  await requireUser("admin");
  const parsed = brandSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const db = getDb();
  const slug = await uniqueSlug(db, brands, parsed.data.name);
  await db.insert(brands).values({ name: parsed.data.name, slug });

  revalidatePath("/admin/brands");
  return {};
}

export async function deleteBrand(id: number) {
  await requireUser("admin");
  await getDb().delete(brands).where(eq(brands.id, id));
  revalidatePath("/admin/brands");
}

// --------------------------------------------------------------- Categories

export async function createCategory(_prevState: SimpleFormState, formData: FormData): Promise<SimpleFormState> {
  await requireUser("admin");
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const db = getDb();
  const slug = await uniqueSlug(db, categories, parsed.data.name);
  await db.insert(categories).values({
    name: parsed.data.name,
    slug,
    description: parsed.data.description || null,
  });

  revalidatePath("/admin/categories");
  return {};
}

export async function deleteCategory(id: number) {
  await requireUser("admin");
  await getDb().delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/categories");
}

// ----------------------------------------------------------------- Products

export type ProductFormState = { errors?: Record<string, string[]>; formError?: string };

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    brandId: formData.get("brandId"),
    sku: formData.get("sku"),
    price: formData.get("price"),
    currency: formData.get("currency"),
    stockStatus: formData.get("stockStatus"),
    description: formData.get("description"),
    featured: formData.get("featured"),
    status: formData.get("status"),
    specProcessor: formData.get("specProcessor"),
    specMemory: formData.get("specMemory"),
    specStorage: formData.get("specStorage"),
    specDisplay: formData.get("specDisplay"),
    specConnectivity: formData.get("specConnectivity"),
    specBattery: formData.get("specBattery"),
    specOs: formData.get("specOs"),
    specOther: formData.get("specOther"),
  });
}

function buildSpecifications(data: z.infer<typeof productSchema>) {
  const specs: Record<string, string> = {};
  if (data.specProcessor) specs.Processor = data.specProcessor;
  if (data.specMemory) specs.Memory = data.specMemory;
  if (data.specStorage) specs.Storage = data.specStorage;
  if (data.specDisplay) specs.Display = data.specDisplay;
  if (data.specConnectivity) specs.Connectivity = data.specConnectivity;
  if (data.specBattery) specs.Battery = data.specBattery;
  if (data.specOs) specs["Operating System"] = data.specOs;
  if (data.specOther) specs.Other = data.specOther;
  return specs;
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireUser("admin");
  const parsed = parseProductForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const db = getDb();
  const slug = await uniqueSlug(db, products, parsed.data.name);

  await db.insert(products).values({
    name: parsed.data.name,
    slug,
    categoryId: parsed.data.categoryId ? Number(parsed.data.categoryId) : null,
    brandId: parsed.data.brandId ? Number(parsed.data.brandId) : null,
    sku: parsed.data.sku || null,
    price: parsed.data.price ? Number(parsed.data.price) : null,
    currency: parsed.data.currency || "NGN",
    stockStatus: parsed.data.stockStatus,
    specifications: buildSpecifications(parsed.data),
    description: parsed.data.description || null,
    images: [],
    featured: parsed.data.featured === "on",
    status: parsed.data.status,
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(
  id: number,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireUser("admin");
  const parsed = parseProductForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const db = getDb();
  await db
    .update(products)
    .set({
      name: parsed.data.name,
      categoryId: parsed.data.categoryId ? Number(parsed.data.categoryId) : null,
      brandId: parsed.data.brandId ? Number(parsed.data.brandId) : null,
      sku: parsed.data.sku || null,
      price: parsed.data.price ? Number(parsed.data.price) : null,
      currency: parsed.data.currency || "NGN",
      stockStatus: parsed.data.stockStatus,
      specifications: buildSpecifications(parsed.data),
      description: parsed.data.description || null,
      featured: parsed.data.featured === "on",
      status: parsed.data.status,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: number) {
  await requireUser("admin");
  await getDb().delete(products).where(eq(products.id, id));
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

// --------------------------------------------------------- Product Enquiries

const ENTITY_TYPE = "product_enquiry";

export async function updateProductEnquiryStatus(id: number, newStatus: EnquiryStatus, note: string) {
  const user = await requireUser();
  const db = getDb();
  const [enquiry] = await db
    .select({ status: productEnquiries.status })
    .from(productEnquiries)
    .where(eq(productEnquiries.id, id))
    .limit(1);
  if (!enquiry) return;

  await db.update(productEnquiries).set({ status: newStatus }).where(eq(productEnquiries.id, id));
  await db.insert(statusHistory).values({
    entityType: ENTITY_TYPE,
    entityId: id,
    fromStatus: enquiry.status,
    toStatus: newStatus,
    changedBy: user.id,
    note: note || null,
  });

  revalidatePath(`/admin/product-enquiries/${id}`);
  revalidatePath("/admin/product-enquiries");
}

export async function addProductEnquiryNote(id: number, note: string) {
  const user = await requireUser();
  if (!note.trim()) return;
  const db = getDb();
  const [enquiry] = await db
    .select({ status: productEnquiries.status })
    .from(productEnquiries)
    .where(eq(productEnquiries.id, id))
    .limit(1);
  if (!enquiry) return;

  await db.insert(statusHistory).values({
    entityType: ENTITY_TYPE,
    entityId: id,
    fromStatus: enquiry.status,
    toStatus: enquiry.status,
    changedBy: user.id,
    note,
  });

  revalidatePath(`/admin/product-enquiries/${id}`);
}
