import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        Smart Technology Information Hub Limited (&quot;Smart Technology&quot;, &quot;we&quot;,
        &quot;us&quot;) respects your privacy. This policy explains what information we collect
        through this website and how we use it.
      </p>

      <h2>Information we collect</h2>
      <p>
        When you submit a contact enquiry, request a quote, apply for training, an internship or
        a role, or subscribe to our newsletter, we collect the information you provide directly —
        such as your name, email address, phone number, organisation, and any documents you
        upload (e.g. a CV or cover letter).
      </p>

      <h2>How we use it</h2>
      <p>
        We use this information to respond to your enquiry, process your application, provide the
        products or services you&apos;ve requested, and — where you&apos;ve opted in — send you
        updates about Smart Technology.
      </p>

      <h2>How we store it</h2>
      <p>
        Submitted information is stored securely and access is restricted to authorised staff.
        Uploaded documents are stored privately and are never publicly accessible.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us to access, correct or delete your information, and you can unsubscribe
        from newsletter emails at any time via the link in those emails or by contacting us.
      </p>

      <h2>Contact</h2>
      <p>Questions about this policy can be sent through our contact page.</p>
    </LegalPage>
  );
}
