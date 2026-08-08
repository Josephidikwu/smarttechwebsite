import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";

export const metadata: Metadata = { title: "Cookie Policy" };

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Cookie Policy">
      <p>
        This site uses a small number of cookies and similar technologies to make the site work
        and to understand how it&apos;s used.
      </p>

      <h2>Essential cookies</h2>
      <p>
        Used for core functionality such as security (e.g. Cloudflare Turnstile, which helps keep
        our forms free of spam). These can&apos;t be switched off.
      </p>

      <h2>Analytics cookies</h2>
      <p>
        Once enabled, Google Analytics helps us understand how visitors use this site — pages
        viewed, traffic sources, and which content is useful — so we can improve it. This is
        aggregated and doesn&apos;t identify you personally.
      </p>

      <h2>Managing cookies</h2>
      <p>
        You can control or delete cookies through your browser settings. Blocking some cookies
        may affect how parts of this site work.
      </p>

      <h2>Contact</h2>
      <p>Questions about this policy can be sent through our contact page.</p>
    </LegalPage>
  );
}
