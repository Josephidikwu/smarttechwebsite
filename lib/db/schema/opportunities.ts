import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export type ProgrammeStatus = "draft" | "open" | "closed";
export type TrainingAppStatus = "new" | "reviewing" | "shortlisted" | "accepted" | "rejected";
export type InternshipAppStatus =
  | "new"
  | "reviewing"
  | "shortlisted"
  | "interview"
  | "accepted"
  | "rejected";
export type JobAppStatus =
  | "new"
  | "reviewing"
  | "shortlisted"
  | "interview"
  | "offer"
  | "hired"
  | "rejected";

// ---------------------------------------------------------------- Training

export const trainingProgrammes = sqliteTable("training_programmes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  category: text("category"), // software dev, web dev, AI, data, digital skills, freelancing...
  startDate: integer("start_date", { mode: "timestamp" }),
  endDate: integer("end_date", { mode: "timestamp" }),
  duration: text("duration"),
  format: text("format"), // in-person / online / hybrid
  location: text("location"),
  applicationDeadline: integer("application_deadline", { mode: "timestamp" }),
  capacity: integer("capacity"),
  status: text("status").$type<ProgrammeStatus>().notNull().default("draft"),
  featuredImageKey: text("featured_image_key"),
  requirements: text("requirements"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const trainingApplications = sqliteTable("training_applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  programmeId: integer("programme_id")
    .notNull()
    .references(() => trainingProgrammes.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  currentSkillLevel: text("current_skill_level"),
  educationalBackground: text("educational_background"),
  motivation: text("motivation"), // "Why do you want to join this programme?"
  preferredFormat: text("preferred_format"),
  cvKey: text("cv_key"), // R2 object key, never a public/predictable path
  additionalInfo: text("additional_info"),
  status: text("status").$type<TrainingAppStatus>().notNull().default("new"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// -------------------------------------------------------------- Internship

export const internships = sqliteTable("internships", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  position: text("position").notNull(),
  slug: text("slug").notNull().unique(),
  department: text("department"),
  description: text("description"),
  responsibilities: text("responsibilities"),
  requirements: text("requirements"),
  duration: text("duration"),
  location: text("location"),
  workArrangement: text("work_arrangement"), // remote / onsite / hybrid
  applicationDeadline: integer("application_deadline", { mode: "timestamp" }),
  positionsAvailable: integer("positions_available"),
  status: text("status").$type<ProgrammeStatus>().notNull().default("draft"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const internshipApplications = sqliteTable("internship_applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  internshipId: integer("internship_id")
    .notNull()
    .references(() => internships.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  institution: text("institution"),
  courseOfStudy: text("course_of_study"),
  graduationYear: integer("graduation_year"),
  areaOfInterest: text("area_of_interest"),
  skills: text("skills"),
  portfolio: text("portfolio"), // URL
  github: text("github"), // URL
  linkedin: text("linkedin"), // URL
  cvKey: text("cv_key"),
  coverLetter: text("cover_letter"),
  availability: text("availability"),
  status: text("status").$type<InternshipAppStatus>().notNull().default("new"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ------------------------------------------------------------------ Careers

export const jobs = sqliteTable("jobs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  department: text("department"),
  location: text("location"),
  employmentType: text("employment_type"), // full-time / part-time / contract
  experienceLevel: text("experience_level"),
  salary: text("salary"), // optional, free text (range/currency vary)
  description: text("description"),
  responsibilities: text("responsibilities"),
  requirements: text("requirements"),
  niceToHave: text("nice_to_have"),
  applicationDeadline: integer("application_deadline", { mode: "timestamp" }),
  status: text("status").$type<ProgrammeStatus>().notNull().default("draft"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const jobApplications = sqliteTable("job_applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  jobId: integer("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  cvKey: text("cv_key"),
  coverLetterKey: text("cover_letter_key"),
  portfolio: text("portfolio"),
  linkedin: text("linkedin"),
  additionalInfo: text("additional_info"),
  status: text("status").$type<JobAppStatus>().notNull().default("new"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/** "Don't see the right role?" — kept separate from job-tied applications per spec. */
export const generalApplications = sqliteTable("general_applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  cvKey: text("cv_key"),
  coverLetterKey: text("cover_letter_key"),
  portfolio: text("portfolio"),
  linkedin: text("linkedin"),
  message: text("message"), // "how you could contribute"
  status: text("status").$type<JobAppStatus>().notNull().default("new"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
