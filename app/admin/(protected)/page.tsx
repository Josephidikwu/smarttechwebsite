import type { Metadata } from "next";
import { count, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import {
  contactSubmissions,
  trainingApplications,
  internshipApplications,
  jobApplications,
  generalApplications,
  jobs,
  trainingProgrammes,
  internships,
  productEnquiries,
} from "@/lib/db/schema";

export const metadata: Metadata = { title: "Admin Overview", robots: { index: false } };

async function getCounts() {
  const db = getDb();

  const [
    totalEnquiries,
    newEnquiries,
    trainingApps,
    internshipApps,
    jobApps,
    generalApps,
    activeJobs,
    activeTraining,
    activeInternships,
    productEnqs,
  ] = await Promise.all([
    db.select({ n: count() }).from(contactSubmissions),
    db.select({ n: count() }).from(contactSubmissions).where(eq(contactSubmissions.status, "new")),
    db.select({ n: count() }).from(trainingApplications),
    db.select({ n: count() }).from(internshipApplications),
    db.select({ n: count() }).from(jobApplications),
    db.select({ n: count() }).from(generalApplications),
    db.select({ n: count() }).from(jobs).where(eq(jobs.status, "open")),
    db.select({ n: count() }).from(trainingProgrammes).where(eq(trainingProgrammes.status, "open")),
    db.select({ n: count() }).from(internships).where(eq(internships.status, "open")),
    db.select({ n: count() }).from(productEnquiries),
  ]);

  return {
    totalEnquiries: totalEnquiries[0].n,
    newEnquiries: newEnquiries[0].n,
    trainingApplications: trainingApps[0].n,
    internshipApplications: internshipApps[0].n,
    careerApplications: jobApps[0].n + generalApps[0].n,
    activeJobVacancies: activeJobs[0].n,
    activeTrainingProgrammes: activeTraining[0].n,
    activeInternships: activeInternships[0].n,
    productEnquiries: productEnqs[0].n,
  };
}

export default async function AdminOverviewPage() {
  const c = await getCounts();

  const stats = [
    { label: "Total enquiries", value: c.totalEnquiries },
    { label: "New enquiries", value: c.newEnquiries },
    { label: "Training applications", value: c.trainingApplications },
    { label: "Internship applications", value: c.internshipApplications },
    { label: "Career applications", value: c.careerApplications },
    { label: "Active job vacancies", value: c.activeJobVacancies },
    { label: "Active training programmes", value: c.activeTrainingProgrammes },
    { label: "Active internships", value: c.activeInternships },
    { label: "Product enquiries", value: c.productEnquiries },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">Overview</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
        A snapshot of activity across the platform.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-5"
          >
            <p className="text-3xl font-bold tracking-tight text-[var(--color-ink)]">{s.value}</p>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{s.label}</p>
          </div>
        ))}

        <div className="rounded-lg border border-dashed border-[var(--color-border)] p-5">
          <p className="text-sm font-medium text-[var(--color-ink)]">Website traffic</p>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
            Connects once GA4 is wired up (M9).
          </p>
        </div>
      </div>
    </div>
  );
}
