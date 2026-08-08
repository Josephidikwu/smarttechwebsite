import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/sections/admin/login-form";

export const metadata: Metadata = { title: "Admin Login", robots: { index: false } };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-subtle)] px-6">
      <div className="w-full max-w-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-8">
        <div className="flex items-center gap-2.5">
          <Image src="/brand/smart-icon.svg" alt="" width={28} height={28} />
          <span className="text-base font-bold tracking-tight text-[var(--color-ink)]">
            Smart<span className="text-[var(--color-brand-blue)]">Technology</span>
          </span>
        </div>
        <h1 className="mt-6 text-xl font-semibold text-[var(--color-ink)]">Admin sign in</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          Staff access only.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
