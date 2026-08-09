"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { trainingApplications, trainingProgrammes } from "@/lib/db/schema";
import { trainingApplicationSchema } from "@/lib/validation/schemas";
import { verifyTurnstile } from "@/lib/turnstile";
import { uploadToR2 } from "@/lib/storage/r2";
import { notifyAdminOfTrainingApplication, sendApplicantConfirmation } from "@/lib/email";

export type TrainingApplicationState = {
  errors?: Record<string, string[]>;
  formError?: string;
  values?: Record<string, string>;
};

export async function submitTrainingApplication(
  programmeId: number,
  _prevState: TrainingApplicationState,
  formData: FormData,
): Promise<TrainingApplicationState> {
  const raw = Object.fromEntries(
    Array.from(formData.entries()).filter(([, v]) => typeof v === "string"),
  ) as Record<string, string>;

  const parsed = trainingApplicationSchema.safeParse({
    fullName: raw.fullName,
    email: raw.email,
    phone: raw.phone,
    currentSkillLevel: raw.currentSkillLevel,
    educationalBackground: raw.educationalBackground,
    motivation: raw.motivation,
    preferredFormat: raw.preferredFormat,
    additionalInfo: raw.additionalInfo,
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
  const [programme] = await db
    .select({ id: trainingProgrammes.id, name: trainingProgrammes.name, status: trainingProgrammes.status })
    .from(trainingProgrammes)
    .where(eq(trainingProgrammes.id, programmeId))
    .limit(1);
  if (!programme || programme.status !== "open") {
    return { formError: "This programme is no longer accepting applications." };
  }

  let cvKey: string | null = null;
  const cv = formData.get("cv");
  if (cv instanceof File && cv.size > 0) {
    const result = await uploadToR2(cv, { prefix: "training-cvs", kind: "document" });
    if ("error" in result) return { formError: result.error, values: raw };
    cvKey = result.key;
  }

  await db.insert(trainingApplications).values({
    programmeId,
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    currentSkillLevel: parsed.data.currentSkillLevel || null,
    educationalBackground: parsed.data.educationalBackground || null,
    motivation: parsed.data.motivation,
    preferredFormat: parsed.data.preferredFormat || null,
    cvKey,
    additionalInfo: parsed.data.additionalInfo || null,
  });

  await Promise.all([
    notifyAdminOfTrainingApplication({
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      programmeName: programme.name,
    }),
    sendApplicantConfirmation({
      to: parsed.data.email,
      applicantName: parsed.data.fullName,
      applicationType: "training",
      itemName: programme.name,
    }),
  ]);

  redirect("/opportunities/application-received?type=training");
}
