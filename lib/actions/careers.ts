"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { jobApplications, jobs, generalApplications } from "@/lib/db/schema";
import { jobApplicationSchema, generalApplicationSchema } from "@/lib/validation/schemas";
import { verifyTurnstile } from "@/lib/turnstile";
import { uploadToR2 } from "@/lib/storage/r2";
import {
  notifyAdminOfJobApplication,
  notifyAdminOfGeneralApplication,
  sendApplicantConfirmation,
} from "@/lib/email";

export type JobApplicationState = {
  errors?: Record<string, string[]>;
  formError?: string;
  values?: Record<string, string>;
};

async function uploadIfPresent(formData: FormData, field: string, prefix: string) {
  const file = formData.get(field);
  if (file instanceof File && file.size > 0) {
    const result = await uploadToR2(file, { prefix, kind: "document" });
    if ("error" in result) return { error: result.error };
    return { key: result.key };
  }
  return { key: null };
}

export async function submitJobApplication(
  jobId: number,
  _prevState: JobApplicationState,
  formData: FormData,
): Promise<JobApplicationState> {
  const raw = Object.fromEntries(
    Array.from(formData.entries()).filter(([, v]) => typeof v === "string"),
  ) as Record<string, string>;

  const parsed = jobApplicationSchema.safeParse({
    fullName: raw.fullName,
    email: raw.email,
    phone: raw.phone,
    portfolio: raw.portfolio,
    linkedin: raw.linkedin,
    additionalInfo: raw.additionalInfo,
  });
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors, values: raw };

  const ip = (await headers()).get("cf-connecting-ip") ?? undefined;
  const verified = await verifyTurnstile(raw["cf-turnstile-response"] ?? null, ip);
  if (!verified) {
    return { formError: "We couldn't verify you're human — please try again.", values: raw };
  }

  const db = getDb();
  const [job] = await db
    .select({ id: jobs.id, title: jobs.title, status: jobs.status })
    .from(jobs)
    .where(eq(jobs.id, jobId))
    .limit(1);
  if (!job || job.status !== "open") {
    return { formError: "This role is no longer accepting applications." };
  }

  const cv = await uploadIfPresent(formData, "cv", "job-cvs");
  if (cv.error) return { formError: cv.error, values: raw };
  const coverLetter = await uploadIfPresent(formData, "coverLetterFile", "job-cover-letters");
  if (coverLetter.error) return { formError: coverLetter.error, values: raw };

  await db.insert(jobApplications).values({
    jobId,
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    cvKey: cv.key,
    coverLetterKey: coverLetter.key,
    portfolio: parsed.data.portfolio || null,
    linkedin: parsed.data.linkedin || null,
    additionalInfo: parsed.data.additionalInfo || null,
  });

  await Promise.all([
    notifyAdminOfJobApplication({
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      jobTitle: job.title,
    }),
    sendApplicantConfirmation({
      to: parsed.data.email,
      applicantName: parsed.data.fullName,
      applicationType: "job",
      itemName: job.title,
    }),
  ]);

  redirect("/opportunities/application-received?type=job");
}

export type GeneralApplicationState = {
  errors?: Record<string, string[]>;
  formError?: string;
  values?: Record<string, string>;
};

export async function submitGeneralApplication(
  _prevState: GeneralApplicationState,
  formData: FormData,
): Promise<GeneralApplicationState> {
  const raw = Object.fromEntries(
    Array.from(formData.entries()).filter(([, v]) => typeof v === "string"),
  ) as Record<string, string>;

  const parsed = generalApplicationSchema.safeParse({
    fullName: raw.fullName,
    email: raw.email,
    phone: raw.phone,
    portfolio: raw.portfolio,
    linkedin: raw.linkedin,
    message: raw.message,
  });
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors, values: raw };

  const ip = (await headers()).get("cf-connecting-ip") ?? undefined;
  const verified = await verifyTurnstile(raw["cf-turnstile-response"] ?? null, ip);
  if (!verified) {
    return { formError: "We couldn't verify you're human — please try again.", values: raw };
  }

  const cv = await uploadIfPresent(formData, "cv", "general-cvs");
  if (cv.error) return { formError: cv.error, values: raw };
  const coverLetter = await uploadIfPresent(formData, "coverLetterFile", "general-cover-letters");
  if (coverLetter.error) return { formError: coverLetter.error, values: raw };

  const db = getDb();
  await db.insert(generalApplications).values({
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    cvKey: cv.key,
    coverLetterKey: coverLetter.key,
    portfolio: parsed.data.portfolio || null,
    linkedin: parsed.data.linkedin || null,
    message: parsed.data.message,
  });

  await Promise.all([
    notifyAdminOfGeneralApplication({
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
    }),
    sendApplicantConfirmation({
      to: parsed.data.email,
      applicantName: parsed.data.fullName,
      applicationType: "general",
      itemName: "General Application",
    }),
  ]);

  redirect("/opportunities/application-received?type=general");
}
