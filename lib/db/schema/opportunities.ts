import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

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

export const trainingProgrammes = pgTable("training_programmes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  category: text("category"), // software dev, web dev, AI, data, digital skills, freelancing...
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  duration: text("duration"),
  format: text("format"), // in-person / online / hybrid
  location: text("location"),
  applicationDeadline: timestamp("application_deadline"),
  capacity: integer("capacity"),
  status: text("status").$type<ProgrammeStatus>().notNull().default("draft"),
  featuredImageKey: text("featured_image_key"),
  requirements: text("requirements"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const trainingApplications = pgTable("training_applications", {
  id: serial("id").primaryKey(),
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
  cvKey: text("cv_key"), // Blob object key, never a public/predictable path
  additionalInfo: text("additional_info"),
  status: text("status").$type<TrainingAppStatus>().notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// -------------------------------------------------------------- Internship

export const internships = pgTable("internships", {
  id: serial("id").primaryKey(),
  position: text("position").notNull(),
  slug: text("slug").notNull().unique(),
  department: text("department"),
  description: text("description"),
  responsibilities: text("responsibilities"),
  requirements: text("requirements"),
  duration: text("duration"),
  location: text("location"),
  workArrangement: text("work_arrangement"), // remote / onsite / hybrid
  applicationDeadline: timestamp("application_deadline"),
  positionsAvailable: integer("positions_available"),
  status: text("status").$type<ProgrammeStatus>().notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const internshipApplications = pgTable("internship_applications", {
  id: serial("id").primaryKey(),
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
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ------------------------------------------------------------------ Careers

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
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
  applicationDeadline: timestamp("application_deadline"),
  status: text("status").$type<ProgrammeStatus>().notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
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
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/** "Don't see the right role?" — kept separate from job-tied applications per spec. */
export const generalApplications = pgTable("general_applications", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  cvKey: text("cv_key"),
  coverLetterKey: text("cover_letter_key"),
  portfolio: text("portfolio"),
  linkedin: text("linkedin"),
  message: text("message"), // "how you could contribute"
  status: text("status").$type<JobAppStatus>().notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
