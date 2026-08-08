import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsOfUsePage() {
  return (
    <LegalPage title="Terms of Use">
      <p>
        These terms govern your use of this website, operated by Smart Technology Information Hub
        Limited. By using this site, you agree to these terms.
      </p>

      <h2>Use of this site</h2>
      <p>
        This website is provided for information about Smart Technology&apos;s products, services
        and opportunities. Content is provided &quot;as is&quot; and may be updated without
        notice.
      </p>

      <h2>Enquiries, quotes and applications</h2>
      <p>
        Submitting a contact enquiry, quote request or application does not guarantee a
        particular outcome, product availability, or offer of a role. Product availability,
        pricing and specifications are confirmed directly with our team.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The Smart Technology name, logo and site content are the property of Smart Technology
        Information Hub Limited unless otherwise credited, and may not be used without permission.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        We aim to keep this site accurate and available, but we don&apos;t guarantee
        uninterrupted access and aren&apos;t liable for losses arising from its use, to the
        extent permitted by law.
      </p>

      <h2>Contact</h2>
      <p>Questions about these terms can be sent through our contact page.</p>
    </LegalPage>
  );
}
