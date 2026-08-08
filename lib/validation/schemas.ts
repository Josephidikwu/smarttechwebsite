import { z } from "zod";

// docs/content-deck.md §22 — "What can we help you with?"
export const contactSubjectOptions = [
  "Technology Products",
  "Technology Procurement",
  "Software Development",
  "Artificial Intelligence",
  "Data & Analytics",
  "IT Infrastructure",
  "Web & Digital Solutions",
  "Training",
  "Internship",
  "Careers",
  "Other",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(200),
  organisation: z.string().trim().max(200).optional().or(z.literal("")),
  email: z.email("Enter a valid email address").max(320),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.enum(contactSubjectOptions, { error: "Choose what you need help with" }),
  message: z.string().trim().min(10, "Tell us a bit more (at least 10 characters)").max(5000),
  turnstileToken: z.string().optional(),
});

export const quoteRequestSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(200),
  organisation: z.string().trim().max(200).optional().or(z.literal("")),
  email: z.email("Enter a valid email address").max(320),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  whatDoYouNeed: z.string().trim().min(2, "Tell us what you need").max(300),
  budgetRange: z.string().trim().max(100).optional().or(z.literal("")),
  description: z.string().trim().max(5000).optional().or(z.literal("")),
  preferredContactMethod: z.string().trim().max(100).optional().or(z.literal("")),
  turnstileToken: z.string().optional(),
});

export const newsletterSchema = z.object({
  email: z.email("Enter a valid email address").max(320),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email address").max(320),
  password: z.string().min(1, "Enter your password").max(200),
});

export const userRoleOptions = ["super_admin", "admin", "editor"] as const;

export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Enter a full name").max(200),
  email: z.email("Enter a valid email address").max(320),
  password: z.string().min(12, "Use at least 12 characters").max(200),
  role: z.enum(userRoleOptions, { error: "Choose a role" }),
});

// ---------------------------------------------------------------- Training

export const programmeStatusOptions = ["draft", "open", "closed"] as const;

export const trainingProgrammeSchema = z.object({
  name: z.string().trim().min(2, "Enter a programme name").max(200),
  description: z.string().trim().max(5000).optional().or(z.literal("")),
  category: z.string().trim().max(100).optional().or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  duration: z.string().trim().max(100).optional().or(z.literal("")),
  format: z.string().trim().max(100).optional().or(z.literal("")),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  applicationDeadline: z.string().optional().or(z.literal("")),
  capacity: z.string().optional().or(z.literal("")),
  status: z.enum(programmeStatusOptions, { error: "Choose a status" }),
  requirements: z.string().trim().max(3000).optional().or(z.literal("")),
});

export const trainingApplicationSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(200),
  email: z.email("Enter a valid email address").max(320),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  currentSkillLevel: z.string().trim().max(100).optional().or(z.literal("")),
  educationalBackground: z.string().trim().max(1000).optional().or(z.literal("")),
  motivation: z.string().trim().min(10, "Tell us a bit more (at least 10 characters)").max(3000),
  preferredFormat: z.string().trim().max(100).optional().or(z.literal("")),
  additionalInfo: z.string().trim().max(2000).optional().or(z.literal("")),
});

// -------------------------------------------------------------- Internship

export const internshipSchema = z.object({
  position: z.string().trim().min(2, "Enter a position name").max(200),
  department: z.string().trim().max(100).optional().or(z.literal("")),
  description: z.string().trim().max(5000).optional().or(z.literal("")),
  responsibilities: z.string().trim().max(3000).optional().or(z.literal("")),
  requirements: z.string().trim().max(3000).optional().or(z.literal("")),
  duration: z.string().trim().max(100).optional().or(z.literal("")),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  workArrangement: z.string().trim().max(100).optional().or(z.literal("")),
  applicationDeadline: z.string().optional().or(z.literal("")),
  positionsAvailable: z.string().optional().or(z.literal("")),
  status: z.enum(programmeStatusOptions, { error: "Choose a status" }),
});

export const internshipApplicationSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(200),
  email: z.email("Enter a valid email address").max(320),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  institution: z.string().trim().max(200).optional().or(z.literal("")),
  courseOfStudy: z.string().trim().max(200).optional().or(z.literal("")),
  graduationYear: z.string().optional().or(z.literal("")),
  areaOfInterest: z.string().trim().max(200).optional().or(z.literal("")),
  skills: z.string().trim().max(1000).optional().or(z.literal("")),
  portfolio: z.string().trim().max(500).optional().or(z.literal("")),
  github: z.string().trim().max(500).optional().or(z.literal("")),
  linkedin: z.string().trim().max(500).optional().or(z.literal("")),
  coverLetter: z.string().trim().max(3000).optional().or(z.literal("")),
  availability: z.string().trim().max(300).optional().or(z.literal("")),
});

// ------------------------------------------------------------------ Careers

export const jobSchema = z.object({
  title: z.string().trim().min(2, "Enter a job title").max(200),
  department: z.string().trim().max(100).optional().or(z.literal("")),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  employmentType: z.string().trim().max(100).optional().or(z.literal("")),
  experienceLevel: z.string().trim().max(100).optional().or(z.literal("")),
  salary: z.string().trim().max(200).optional().or(z.literal("")),
  description: z.string().trim().max(5000).optional().or(z.literal("")),
  responsibilities: z.string().trim().max(3000).optional().or(z.literal("")),
  requirements: z.string().trim().max(3000).optional().or(z.literal("")),
  niceToHave: z.string().trim().max(2000).optional().or(z.literal("")),
  applicationDeadline: z.string().optional().or(z.literal("")),
  status: z.enum(programmeStatusOptions, { error: "Choose a status" }),
});

export const jobApplicationSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(200),
  email: z.email("Enter a valid email address").max(320),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  portfolio: z.string().trim().max(500).optional().or(z.literal("")),
  linkedin: z.string().trim().max(500).optional().or(z.literal("")),
  additionalInfo: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const generalApplicationSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(200),
  email: z.email("Enter a valid email address").max(320),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  portfolio: z.string().trim().max(500).optional().or(z.literal("")),
  linkedin: z.string().trim().max(500).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a bit more (at least 10 characters)").max(3000),
});
