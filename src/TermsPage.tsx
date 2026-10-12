import type { ReactNode } from "react";

export default function TermsPage() {
  const sectionStyle = {
    marginTop: "2.25rem",
  };

  const headingStyle = {
    marginBottom: "0.8rem",
    fontSize: "1.4rem",
  };

  const paragraphStyle = {
    color: "#d4d4d8",
    margin: "0.65rem 0",
  };

  const listStyle = {
    color: "#d4d4d8",
    paddingLeft: "1.25rem",
    margin: "0.75rem 0",
  };

  const linkStyle = {
    color: "#5eead4",
  };

  const Clause = ({
    number,
    children,
  }: {
    number: string;
    children: ReactNode;
  }) => (
    <p style={paragraphStyle}>
      <strong>{number}</strong> {children}
    </p>
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: "3rem 1.25rem",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          lineHeight: 1.7,
        }}
      >
        <a
          href="/"
          style={{
            color: "#5eead4",
            textDecoration: "none",
          }}
        >
          ← Back to Trimmute
        </a>

        <h1 style={{ marginTop: "2rem", marginBottom: "0.5rem" }}>
          Trimmute Terms of Use
        </h1>

        <p style={{ color: "#77777f", marginTop: 0 }}>
          Version 1.0 | 12 October 2026
        </p>

        <p style={paragraphStyle}>
          These Terms of Use (“Terms”) explain the rules that apply when you
          access or use Trimmute (the “Service”).
        </p>

        <p style={paragraphStyle}>
          Trimmute helps adults aged 18 and over find barbers, salons and
          haircut providers who are open to quieter, low-conversation haircut
          experiences. Trimmute currently operates as a discovery, directory
          and listing service only. We do not currently process haircut
          bookings ourselves.
        </p>

        <p style={paragraphStyle}>
          The Service is operated by Harry Carrig, trading as Trimmute
          (“Trimmute”, “we”, “us” or “our”), of Lytchett House, 13 Freeland
          Park, Wareham Road, Poole, Dorset, BH16 6FA. Email:
          {" "}trimmute@gmail.com.
        </p>

        <p style={paragraphStyle}>
          By accessing or using the Service, you agree to these Terms. If you do
          not agree, please do not use the Service.
        </p>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>1. Introduction and acceptance</h2>

          <Clause number="1.1">
            These Terms explain the rules that apply when you access or use the
            Service.
          </Clause>

          <Clause number="1.2">
            By accessing or using the Service, you agree to be bound by these
            Terms. If you do not agree to these Terms, please do not use the
            Service.
          </Clause>

          <Clause number="1.3">
            These Terms are written in plain language as far as possible. If
            anything is unclear, please contact us using the details in clause
            22.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>2. About the Service</h2>

          <Clause number="2.1">
            Trimmute helps adults aged 18 and over find barbers, salons and
            haircut providers who are open to quieter, low-conversation haircut
            experiences.
          </Clause>

          <Clause number="2.2">
            Trimmute currently operates as a discovery, directory and listing
            service only. We do not currently process haircut bookings
            ourselves.
          </Clause>

          <Clause number="2.3">
            We do not provide barbering, hairdressing, salon, grooming, medical,
            therapeutic or professional accessibility services.
          </Clause>

          <Clause number="2.4">
            Haircut appointments are made directly with the relevant barber,
            salon or third-party booking service. We are not currently the
            booking provider.
          </Clause>

          <Clause number="2.5">
            Trimmute does not itself provide, administer or control haircut
            services, appointments, payments, cancellations, refunds,
            customer-service issues or in-shop experiences. Those matters are
            handled by the relevant provider or external booking service.
          </Clause>

          <Clause number="2.6">
            Nothing in these Terms removes any statutory right you have against
            us or against a haircut provider.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>3. Using the Service</h2>

          <Clause number="3.1">You may use the Service to:</Clause>

          <ul style={listStyle}>
            <li>search for haircut providers;</li>
            <li>view quiet-friendly or low-conversation listings;</li>
            <li>
              view shop information, prices, locations and external
              booking/contact links;
            </li>
            <li>use location or postcode features to find nearby providers;</li>
            <li>save listings using browser/device storage features; and</li>
            <li>
              follow external links to contact or book directly with a provider
              or third-party booking service.
            </li>
          </ul>

          <Clause number="3.2">
            You must not misuse the Service. In particular, you must not:
          </Clause>

          <ul style={listStyle}>
            <li>use the Service for unlawful, fraudulent or abusive purposes;</li>
            <li>
              interfere with, damage, overload, disable or circumvent the
              Service or its security;
            </li>
            <li>attempt to access data, accounts or systems without permission;</li>
            <li>
              submit false, misleading, abusive, discriminatory or harmful
              information;
            </li>
            <li>introduce malware or other harmful code; or</li>
            <li>
              use automated tools to scrape, copy or extract substantial parts
              of the Service without permission, except where the law permits
              this.
            </li>
          </ul>

          <Clause number="3.3">
            We may suspend or restrict your access if we reasonably believe you
            have breached clause 3.2 (see also clause 15).
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>
            4. Quiet-friendly and low-conversation listings
          </h2>

          <Clause number="4.1">
            We use terms such as “quiet-friendly”, “low-conversation”,
            “minimal-conversation”, “silent cut” or similar wording to describe
            haircut providers who are open to quieter or lower-conversation
            haircut experiences.
          </Clause>

          <Clause number="4.2">These terms do not mean that:</Clause>

          <ul style={listStyle}>
            <li>the whole shop or salon will be silent;</li>
            <li>there will be no background noise;</li>
            <li>other customers or staff will be quiet;</li>
            <li>a particular staff member will always be available;</li>
            <li>
              the provider has been medically, clinically or professionally
              certified by us; or
            </li>
            <li>
              the service is guaranteed to meet any particular sensory,
              accessibility, anxiety-related, disability-related or health need.
            </li>
          </ul>

          <Clause number="4.3">
            Quiet-friendly or similar wording means only that the provider has
            confirmed or otherwise expressly agreed that it is open to
            reasonable requests for quieter or lower-conversation haircut
            experiences.
          </Clause>

          <Clause number="4.4">
            If you have specific accessibility, sensory, medical or other
            requirements, you should contact the provider directly before
            travelling or booking.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>5. Verified and partner listings</h2>

          <Clause number="5.1">
            A verified listing means we have received confirmation from the
            business, or from a person reasonably understood to be authorised to
            act on its behalf, that it is open to being listed on Trimmute. A
            Partner listing means the business has formally agreed to
            participate in Trimmute’s Partner programme under the applicable
            Partner terms.
          </Clause>

          <Clause number="5.2">
            Where a business is described as quiet-friendly, low-conversation,
            minimal-conversation, silent-cut friendly or using similar wording,
            we will only use that description where the business has confirmed
            or otherwise expressly agreed that it is open to accommodating such
            requests, including through acceptance of applicable Partner terms.
          </Clause>

          <Clause number="5.3">
            A verified or partner label does not mean we have inspected,
            audited, trained, certified, accredited or quality-assured the
            business.
          </Clause>

          <Clause number="5.4">
            Listed businesses remain responsible for their own acts, omissions,
            services, prices, availability, staff, accessibility, legal
            compliance and customer experience.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>6. Accuracy of information</h2>

          <Clause number="6.1">
            We take reasonable steps to keep information accurate and up to
            date, but business information may change without us being notified.
            We do not guarantee that every listing is complete, accurate or
            current at all times.
          </Clause>

          <Clause number="6.2">
            Listing information may include business names, addresses,
            postcodes, prices, external booking/contact links, opening or
            walk-in arrangements, services, quiet-friendly or low-conversation
            status, photos, logos and images.
          </Clause>

          <Clause number="6.3">
            You should check important details directly with the relevant
            provider before travelling, booking, paying, relying on
            availability, or making decisions based on a listing.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>
            7. Location, maps and third-party technical services
          </h2>

          <Clause number="7.1">
            We use third-party technical services to provide features including
            location search, postcode lookup, maps, hosting, authentication,
            analytics and database services.
          </Clause>

          <Clause number="7.2">
            For example, a postcode you enter may be sent to postcodes.io for
            geocoding, map tiles may be loaded from OpenFreeMap, and
            location-based searches may send device coordinates to our backend
            when you choose to use your location.
          </Clause>

          <Clause number="7.3">
            These services may process technical request information in
            accordance with their own legal terms and privacy notices. See our{" "}
            <a href="/privacy" style={linkStyle}>
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/cookies" style={linkStyle}>
              Cookie & Storage Notice
            </a>{" "}
            for more information.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>
            8. External bookings and third-party links
          </h2>

          <Clause number="8.1">
            Some listings may link to external websites, booking platforms,
            maps, social-media pages or other third-party services.
          </Clause>

          <Clause number="8.2">
            We do not currently process haircut bookings ourselves. If you click
            an external booking or contact link, you leave the Service and deal
            directly with the relevant provider or third party.
          </Clause>

          <Clause number="8.3">
            You may then become subject to that third party’s own terms, privacy
            policy, booking rules, cancellation policy and payment process.
          </Clause>

          <Clause number="8.4">
            External websites and booking platforms are not controlled by us. We
            are not responsible for third-party websites, third-party content or
            services provided by third parties, except to the extent applicable
            law makes us responsible.
          </Clause>

          <Clause number="8.5">
            Unless clearly stated otherwise, we are not a party to the haircut
            service itself and do not act as a haircut provider’s agent for the
            provision of the haircut service.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>9. Payments, cancellations and refunds</h2>

          <Clause number="9.1">
            We do not currently take payment from you for haircut appointments.
          </Clause>

          <Clause number="9.2">
            Any payment for a haircut, deposit, cancellation fee, refund,
            missed-appointment fee or other appointment-related charge is
            handled by the relevant provider or external booking platform.
          </Clause>

          <Clause number="9.3">
            You should check the provider’s or booking platform’s own payment,
            cancellation, refund and appointment policies before booking.
          </Clause>

          <Clause number="9.4">
            Nothing in these Terms removes any consumer right or legal remedy
            that applies directly against us.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>10. Accounts and saved information</h2>

          <Clause number="10.1">
            Trimmute offers account, sign-in and saved-listing functionality and
            may introduce similar features from time to time.
          </Clause>

          <Clause number="10.2">
            You are responsible for taking reasonable steps to keep your account
            credentials and device access secure. If you believe someone has
            accessed your account without permission, please contact us
            promptly.
          </Clause>

          <Clause number="10.3">
            Some saved features rely on local browser or device storage. If you
            clear your browser data, change device, or use another browser,
            saved information may no longer be available.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>11. Information you submit to us</h2>

          <Clause number="11.1">
            If you submit information to us directly, for example through
            messages, feedback, account functionality or business
            communications, it must be accurate, lawful and not misleading.
          </Clause>

          <Clause number="11.2">
            You must not submit information that is abusive, discriminatory,
            unlawful, harmful, fraudulent, infringes another person’s rights, or
            contains malicious code.
          </Clause>

          <Clause number="11.3">
            You should not submit medical diagnoses, disability information or
            other special category personal data.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>
            12. Business listings and partner businesses
          </h2>

          <Clause number="12.1">
            Businesses listed on Trimmute are responsible for their own
            services, staff, prices, appointments, customer communications,
            legal compliance and customer experience.
          </Clause>

          <Clause number="12.2">
            A listed business may contact us to update, correct or remove its
            listing.
          </Clause>

          <Clause number="12.3">
            Businesses must not claim to be certified, endorsed, guaranteed,
            medically approved or professionally accredited by us unless we
            have expressly agreed to that wording in writing.
          </Clause>

          <Clause number="12.4">
            We may update, suspend or remove a listing where information appears
            inaccurate, outdated, misleading, unlawful or unsuitable, or where
            we reasonably consider removal necessary to protect users,
            ourselves or third parties.
          </Clause>

          <Clause number="12.5">
            Separate Partner terms or agreements may apply to businesses that
            formally participate in Trimmute’s Partner programme or enter into a
            separate commercial arrangement with us.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>13. Images, logos and business content</h2>

          <Clause number="13.1">
            We may display business names, logos, images, photographs,
            descriptions, links and other listing content to identify and
            describe listed haircut providers.
          </Clause>

          <Clause number="13.2">
            We may use content supplied or expressly approved by the relevant
            business, or otherwise licensed or permitted for use by the relevant
            rights-holder.
          </Clause>

          <Clause number="13.3">
            Rights-holders who believe content is being used without appropriate
            permission should contact us so the issue can be investigated and,
            where appropriate, the content removed or amended.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>14. Intellectual property</h2>

          <Clause number="14.1">
            Our name, branding, website design, original text, layout, software
            and original content belong to us or our licensors unless stated
            otherwise.
          </Clause>

          <Clause number="14.2">
            You may use the Service for lawful personal use.
          </Clause>

          <Clause number="14.3">
            You must not reproduce, sell, commercially exploit, modify,
            distribute, scrape or reuse a substantial part of the Service
            without our permission, except where applicable law permits this.
            Normal linking to Trimmute or individual listings is permitted.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>
            15. Availability, changes and suspension
          </h2>

          <Clause number="15.1">
            We aim to keep the Service available and functioning but do not
            guarantee that it, or any feature, will always be available,
            uninterrupted, secure or error-free.
          </Clause>

          <Clause number="15.2">
            We may update, modify, suspend or withdraw features or parts of the
            Service where reasonably necessary, including for maintenance,
            security, legal compliance, business changes or technical reasons.
          </Clause>

          <Clause number="15.3">
            We may suspend or restrict your access where we reasonably believe
            the Service is being misused, security is at risk, or continued
            access could harm us, other users or third parties.
          </Clause>

          <Clause number="15.4">
            Nothing in this clause 15 excludes responsibility that cannot
            lawfully be excluded.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>16. Liability</h2>

          <Clause number="16.1">
            Nothing in these Terms excludes or limits liability for: (a) death
            or personal injury caused by negligence; (b) fraud or fraudulent
            misrepresentation; or (c) any other liability that cannot lawfully
            be excluded or limited, including your statutory rights under the
            Consumer Rights Act 2015.
          </Clause>

          <Clause number="16.2">
            We will supply the Service, the discovery, directory and listing
            platform itself, with reasonable care and skill, as required by
            section 49 of the Consumer Rights Act 2015. Nothing in this clause
            16 excludes that obligation. Clause 16.5 instead limits, to the
            extent reasonable and permitted by section 57 of that Act, the
            amount we may be required to pay if we fail to do so.
          </Clause>

          <Clause number="16.3">
            We are a discovery and listing platform and do not ourselves provide
            the haircut services supplied by listed businesses. Except as set
            out in these Terms, we are not responsible for the acts or omissions
            of a haircut provider, or for the quality, safety, suitability,
            accessibility, availability or outcome of a haircut service supplied
            by a third party.
          </Clause>

          <Clause number="16.4">
            Subject to clauses 16.1, 16.2 and 16.8, and to the extent permitted
            by applicable law, we are not liable for any indirect or
            consequential loss, or for loss or corruption of data, arising out
            of or in connection with your use of the Service, whether in
            contract, tort (including negligence), breach of statutory duty or
            otherwise.
          </Clause>

          <Clause number="16.5">
            Subject to clauses 16.1 to 16.4, and to the extent permitted by
            applicable law, our total aggregate liability to you arising out of
            or in connection with your use of the Service will not exceed £500
            or, if higher, the total amount (if any) you have paid us for use of
            the Service in the twelve (12) months before the event giving rise
            to the claim. Nothing in this clause limits any minimum recovery or
            other remedy that applicable consumer law requires to remain
            available to you.
          </Clause>

          <Clause number="16.6">
            Subject to applicable law and to clauses 16.1 and 16.2, we are not
            responsible for loss or damage that results solely from: (a)
            inaccurate, outdated or incomplete listing information where we have
            taken reasonable care; (b) third-party websites or external booking
            platforms outside our control; (c) the acts or omissions of a
            haircut provider; (d) the quality, safety, suitability,
            accessibility, availability or outcome of a haircut service supplied
            by a third party; or (e) events that were not reasonably foreseeable
            when you agreed to these Terms.
          </Clause>

          <Clause number="16.7">
            If you use the Service for business or commercial purposes rather
            than as a consumer, then, to the fullest extent permitted by law, we
            will not be liable to you for loss of profit, loss of business,
            business interruption or loss of business opportunity, and the
            reasonableness of this clause 16 as it applies to you will, where
            relevant, be assessed under the Unfair Contract Terms Act 1977
            rather than the Consumer Rights Act 2015.
          </Clause>

          <Clause number="16.8">
            Nothing in this clause 16 affects your statutory rights as a
            consumer, including any right or remedy that cannot lawfully be
            limited or excluded.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>
            17. Privacy, cookies and personal information
          </h2>

          <Clause number="17.1">
            Use of the Service may involve the collection and use of personal
            information and the use of browser storage or similar technologies.
            Please read our{" "}
            <a href="/privacy" style={linkStyle}>
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/cookies" style={linkStyle}>
              Cookie & Storage Notice
            </a>{" "}
            for further information.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>18. Children and young users</h2>

          <Clause number="18.1">
            Trimmute is solely for use by adults aged 18 and over.
          </Clause>

          <Clause number="18.2">
            Trimmute is not specifically directed at children and we do not
            knowingly collect personal information from children.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>19. Changes to these Terms</h2>

          <Clause number="19.1">
            We may update these Terms where our features, business model,
            third-party services or legal obligations change.
          </Clause>

          <Clause number="19.2">
            If we make a material change, we will update the version/date and
            provide clearer notice where appropriate. Where the law requires
            your agreement to a material contractual change, we will seek that
            agreement rather than relying only on your continued use.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>20. Governing law and jurisdiction</h2>

          <Clause number="20.1">
            These Terms are governed by the laws of England and Wales.
          </Clause>

          <Clause number="20.2">
            If you are a consumer resident in Scotland or Northern Ireland, you
            may also be entitled to rely on mandatory consumer protections that
            apply where you live, and to bring proceedings in the courts
            available to you under applicable law.
          </Clause>

          <Clause number="20.3">
            Subject to clause 20.2, the courts of England and Wales have
            non-exclusive jurisdiction over any dispute arising out of or in
            connection with these Terms.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>21. General</h2>

          <Clause number="21.1">
            If a court or competent authority finds part of these Terms unlawful
            or unenforceable, the remaining provisions will continue to apply.
          </Clause>

          <Clause number="21.2">
            A delay or failure by us to enforce a provision does not by itself
            waive our right to enforce it later.
          </Clause>

          <Clause number="21.3">
            These Terms do not give a third party a right to enforce them under
            the Contracts (Rights of Third Parties) Act 1999, unless applicable
            law provides otherwise.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>22. Contact</h2>

          <p style={paragraphStyle}>
            Harry Carrig, trading as Trimmute
          </p>

          <p style={paragraphStyle}>
            <strong>Email:</strong> trimmute@gmail.com
            <br />
            <strong>Postal address:</strong> Lytchett House, 13 Freeland Park,
            Wareham Road, Poole, Dorset, BH16 6FA
          </p>
        </section>

        <div
          style={{
            marginTop: "3rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            color: "#77777f",
            fontSize: "0.9rem",
          }}
        >
          <p>Harry Carrig trading as Trimmute</p>
          <p>trimmute@gmail.com</p>
          <p>
            Lytchett House, 13 Freeland Park, Wareham Road, Poole, Dorset,
            BH16 6FA
          </p>
        </div>
      </div>
    </main>
  );
}