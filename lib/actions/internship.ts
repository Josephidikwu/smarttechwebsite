"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { internshipApplications, internships } from "@/lib/db/schema";
import { internshipApplicationSchema } from "@/lib/validation/schemas";
import { verifyTurnstile } from "@/lib/turnstile";
import { uploadToBlob } from "@/lib/storage/blob";
import { notifyAdminOfInternshipApplication, sendApplicantConfirmation } from "@/lib/email";

export type InternshipApplicationState = {
  errors?: Record<string, string[]>;
  formError?: string;
  values?: Record<string, string>;
};

export async function submitInternshipApplication(
  internshipId: number,
  _prevState: InternshipApplicationState,
  formData: FormData,
): Promise<InternshipApplicationState> {
  const raw = Object.fromEntries(
    Array.from(formData.entries()).filter(([, v]) => typeof v === "string"),
  ) as Record<string, string>;

  const parsed = internshipApplicationSchema.safeParse({
    fullName: raw.fullName,
    email: raw.email,
    phone: raw.phone,
    institution: raw.institution,
    courseOfStudy: raw.courseOfStudy,
    graduationYear: raw.graduationYear,
    areaOfInterest: raw.areaOfInterest,
    skills: raw.skills,
    portfolio: raw.portfolio,
    github: raw.github,
    linkedin: raw.linkedin,
    coverLetter: raw.coverLetter,
    availability: raw.availability,
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, values: raw };
  }

  const ip = (await headers()).get("cf-connecting-ip") ?? undefined;
  const verified = await verifyTurnstile(raw["cf-turnstile-response"] ?? null, ip);
  if (!verified) {
    return { formError: "We couldn't verify you're human — please try again.", values: raw };
  }

  const db = getDb();
  const [internship] = await db
    .select({ id: internships.id, position: internships.position, status: internships.status })
    .from(internships)
    .where(eq(internships.id, internshipId))
    .limit(1);
  if (!internship || internship.status !== "open") {
    return { formError: "This internship is no longer accepting applications." };
  }

  let cvKey: string | null = null;
  const cv = formData.get("cv");
  if (cv instanceof File && cv.size > 0) {
    const result = await uploadToBlob(cv, { prefix: "internship-cvs", kind: "document" });
    if ("error" in result) return { formError: result.error, values: raw };
    cvKey = result.key;
  }

  await db.insert(internshipApplications).values({
    internshipId,
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    institution: parsed.data.institution || null,
    courseOfStudy: parsed.data.courseOfStudy || null,
    graduationYear: parsed.data.graduationYear ? Number(parsed.data.graduationYear) : null,
    areaOfInterest: parsed.data.areaOfInterest || null,
    skills: parsed.data.skills || null,
    portfolio: parsed.data.portfolio || null,
    github: parsed.data.github || null,
    linkedin: parsed.data.linkedin || null,
    cvKey,
    coverLetter: parsed.data.coverLetter || null,
    availability: parsed.data.availability || null,
  });

  await Promise.all([
    notifyAdminOfInternshipApplication({
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      positionName: internship.position,
    }),
    sendApplicantConfirmation({
      to: parsed.data.email,
      applicantName: parsed.data.fullName,
      applicationType: "internship",
      itemName: internship.position,
    }),
  ]);

  redirect("/opportunities/application-received?type=internship");
}
