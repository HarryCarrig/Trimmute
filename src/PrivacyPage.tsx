import type { ReactNode } from "react";

export default function PrivacyPage() {
  const sectionStyle = {
    marginTop: "2.25rem",
  };

  const headingStyle = {
    marginBottom: "0.8rem",
    fontSize: "1.4rem",
  };

  const subheadingStyle = {
    marginTop: "1.4rem",
    marginBottom: "0.45rem",
    fontSize: "1.05rem",
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

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse" as const,
    marginTop: "1rem",
    marginBottom: "1rem",
    color: "#d4d4d8",
  };

  const cellStyle = {
    border: "1px solid rgba(255,255,255,0.16)",
    padding: "0.75rem",
    verticalAlign: "top" as const,
  };

  const Clause = ({
    number,
    children,
  }: {
    number?: string;
    children: ReactNode;
  }) => (
    <p style={paragraphStyle}>
      {number && <strong>{number} </strong>}
      {children}
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
          Trimmute Privacy Policy
        </h1>

        <p style={{ color: "#77777f", marginTop: 0 }}>
          Version 1.0 | 12 October 2026
        </p>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>1. About Trimmute and this Privacy Policy</h2>

          <p style={paragraphStyle}>
            Trimmute is a website that helps people find barbers, salons and
            haircut providers who are open to quieter, low-conversation haircut
            experiences.
          </p>

          <p style={paragraphStyle}>
            Trimmute operates as a discovery and directory service. Trimmute
            does not process haircut bookings itself. Where a listing contains
            an external booking link, the user is directed to the relevant
            provider or third-party booking service to make their booking.
          </p>

          <p style={paragraphStyle}>
            This Privacy Policy explains what personal information Trimmute
            collects or otherwise processes, how it is used, who it may be
            shared with, how international transfers are handled, how long
            information is kept, and the rights available to individuals.
          </p>

          <p style={paragraphStyle}>
            Trimmute is operated by Harry Carrig, trading as Trimmute, who is
            the controller of the personal information described in this
            Privacy Policy.
          </p>

          <p style={paragraphStyle}>
            <strong>Email:</strong> trimmute@gmail.com
            <br />
            <strong>Postal address:</strong> Lytchett House, 13 Freeland Park,
            Wareham Road, Poole, Dorset, BH16 6FA
          </p>

          <p style={paragraphStyle}>
            For privacy questions, data rights requests or data protection
            complaints, please contact Trimmute using the details above.
          </p>

          <p style={paragraphStyle}>
            Trimmute is registered with the Information Commissioner’s Office as
            a data controller under registration number <strong>ZC194719</strong>.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>2. Status of this Privacy Policy</h2>

          <Clause number="2.1">
            This Privacy Policy is an information notice provided to comply with
            UK data protection law. It is not a contract and does not create
            contractual rights or obligations.
          </Clause>

          <Clause number="2.2">
            Use of the Trimmute website is governed by the{" "}
            <a href="/terms" style={linkStyle}>
              Trimmute Terms of Use
            </a>
            , which include the limitations and exclusions of liability that
            apply between Trimmute and users of the website. This Privacy Policy
            is referred to in, and read alongside, those Terms of Use. Cookie
            and browser-storage detail is set out in the{" "}
            <a href="/cookies" style={linkStyle}>
              Trimmute Cookie & Storage Notice
            </a>
            .
          </Clause>

          <Clause number="2.3">
            Where this Privacy Policy describes what Trimmute does with personal
            information and the Terms of Use address the contractual
            relationship and liability between Trimmute and users, each document
            applies to its own subject matter.
          </Clause>

          <Clause number="2.4">
            Nothing in this Privacy Policy reduces, waives or limits the
            statutory rights of individuals under UK data protection law,
            including the right to complain to the Information Commissioner’s
            Office and the right to compensation under Article 82 UK GDPR.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>
            3. What personal information Trimmute collects or processes
          </h2>

          <Clause number="3.1">
            Information we collect or process when you use Trimmute or contact
            us:
          </Clause>

          <ul style={listStyle}>
            <li>
              <strong>Identity information:</strong> your name, where provided;
            </li>
            <li>
              <strong>Contact details:</strong> your email address where you
              create or use a Trimmute account, or contact Trimmute directly;
            </li>
            <li>
              <strong>Location information:</strong> your postcode, or device
              location coordinates when you choose to enable location access,
              used to help identify nearby businesses. The accuracy of device
              location may vary depending on your device, browser and settings;
            </li>
            <li>
              <strong>Communication content:</strong> the content of messages,
              emails or enquiries you send directly to Trimmute;
            </li>
            <li>
              <strong>Technical and usage information:</strong> information
              generated when you use Trimmute, including through website
              requests, server logs, analytics services and cookies, browser
              storage or similar technologies where applicable.
            </li>
          </ul>

          <p style={paragraphStyle}>
            Please do not send medical information, diagnoses, disability
            information or other special category personal data.
          </p>

          <p style={paragraphStyle}>
            Trimmute does not use a person’s interest in quiet or
            low-conversation haircuts to infer or record a medical diagnosis,
            disability or health condition.
          </p>

          <h3 style={subheadingStyle}>Account and sign-in information</h3>

          <p style={paragraphStyle}>
            Trimmute allows users to sign in or create an account through Clerk.
            When you create or use a Trimmute account, Clerk processes account
            and authentication information such as your email address, name
            where provided, authentication or session identifiers, and related
            technical information.
          </p>

          <p style={paragraphStyle}>
            Trimmute does not use account information for advertising or
            profiling.
          </p>

          <h3 style={subheadingStyle}>Saved favourites</h3>

          <p style={paragraphStyle}>
            Trimmute allows users to save favourite shops. Favourites are stored
            in your browser using localStorage and are not saved to Trimmute’s
            database.
          </p>

          <h3 style={subheadingStyle}>External booking services</h3>

          <p style={paragraphStyle}>
            Trimmute does not process haircut bookings itself. Where a provider
            has an external booking link, Trimmute may direct a user to that
            provider’s website or to a third-party booking platform.
          </p>

          <p style={paragraphStyle}>
            The resulting booking is made outside Trimmute and is subject to the
            privacy policy, terms and data-handling practices of the external
            provider or booking service. Trimmute does not collect appointment
            dates, appointment times, booking notes or booking details from
            those external services as part of the normal booking-link process.
          </p>

          <h3 style={subheadingStyle}>Technical and usage information</h3>

          <p style={paragraphStyle}>
            When Trimmute is used, Trimmute or its service providers may process
            technical and usage information including:
          </p>

          <ul style={listStyle}>
            <li>IP address;</li>
            <li>browser and device information;</li>
            <li>pages visited and general usage events;</li>
            <li>error and diagnostic information;</li>
            <li>server and security logs;</li>
            <li>analytics information.</li>
          </ul>

          <p style={paragraphStyle}>
            Trimmute uses Vercel Web Analytics to understand general website
            usage and improve the service.
          </p>

          <h3 style={subheadingStyle}>Business and partner information</h3>

          <p style={paragraphStyle}>
            If you are a barber, salon or other business listed on Trimmute,
            information used may include:
          </p>

          <ul style={listStyle}>
            <li>business name, address and postcode;</li>
            <li>business contact details;</li>
            <li>external booking or contact link;</li>
            <li>shop images or logos;</li>
            <li>service and pricing information;</li>
            <li>
              whether the business has agreed to relevant listing or
              quiet-friendly wording;
            </li>
            <li>communications and permission records.</li>
          </ul>

          <p style={paragraphStyle}>
            Some business information may be obtained from publicly available
            sources, such as the business’s own website, public booking page or
            public social-media profile, while other information may be
            collected directly from the business or its representatives.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>
            4. How Trimmute uses personal information
          </h2>

          <p style={paragraphStyle}>Personal information may be used to:</p>

          <ul style={listStyle}>
            <li>show nearby haircut providers and calculate distances;</li>
            <li>provide postcode and location-based search;</li>
            <li>
              display shop details, maps, prices and external booking or contact
              links, including as part of postcode or location-based search
              results;
            </li>
            <li>remember favourites in your browser;</li>
            <li>help users find quiet or low-conversation haircut options;</li>
            <li>
              manage partner listings, permissions and business communications;
            </li>
            <li>respond to users and businesses;</li>
            <li>improve the website and user experience;</li>
            <li>
              use technical and usage information, including error, diagnostic,
              server and security information, to monitor website performance,
              identify bugs and protect the service;
            </li>
            <li>prevent misuse, spam, fraud or unauthorised access;</li>
            <li>maintain appropriate business and compliance records;</li>
            <li>comply with legal obligations.</li>
          </ul>

          <p style={paragraphStyle}>
            Trimmute does not sell personal information.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>
            5. Lawful bases for processing personal information
          </h2>

          <p style={paragraphStyle}>
            Under UK data protection law, Trimmute needs an appropriate lawful
            basis for processing personal information.
          </p>

          <p style={paragraphStyle}>
            The main processing activities and the lawful basis relied on for
            each are as follows:
          </p>

          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={cellStyle}>Processing Activities</th>
                  <th style={cellStyle}>Lawful Basis</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td style={cellStyle}>
                    Displaying the website, shop listings, prices and maps
                  </td>
                  <td style={cellStyle}>Legitimate interests</td>
                </tr>

                <tr>
                  <td style={cellStyle}>Postcode search</td>
                  <td style={cellStyle}>Legitimate interests</td>
                </tr>

                <tr>
                  <td style={cellStyle}>
                    Device location for location-based search
                  </td>
                  <td style={cellStyle}>
                    Consent
                    <br />
                    <br />
                    Consent is relied on where a user chooses to allow browser or
                    device location access for location-based search. Location
                    permission can be refused or withdrawn through browser or
                    device settings at any time, without affecting processing
                    carried out before withdrawal. Location access is requested
                    only when the user chooses to use their location and is a
                    separate, affirmative choice made by the user. It is not a
                    condition of using Trimmute, is not bundled with any other
                    permission, and may be declined without losing access to the
                    rest of the website, since postcode search remains available
                    as an alternative.
                  </td>
                </tr>

                <tr>
                  <td style={cellStyle}>Creating and using an account</td>
                  <td style={cellStyle}>
                    Contract where processing is necessary to provide the
                    requested account functionality; legitimate interests for
                    account and service security.
                  </td>
                </tr>

                <tr>
                  <td style={cellStyle}>
                    Website analytics, performance monitoring and security
                  </td>
                  <td style={cellStyle}>Legitimate interests</td>
                </tr>

                <tr>
                  <td style={cellStyle}>Responding to enquiries</td>
                  <td style={cellStyle}>
                    Legitimate interests; contract where processing is necessary
                    to administer or support an existing Trimmute account.
                  </td>
                </tr>

                <tr>
                  <td style={cellStyle}>
                    Managing business listings, permissions and partner
                    relationships
                  </td>
                  <td style={cellStyle}>Legitimate interests</td>
                </tr>

                <tr>
                  <td style={cellStyle}>Keeping records required by law</td>
                  <td style={cellStyle}>Legal obligation</td>
                </tr>

                <tr>
                  <td style={cellStyle}>
                    Developing and improving the Trimmute service
                  </td>
                  <td style={cellStyle}>
                    Legitimate interests in refining and improving the service
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={paragraphStyle}>
            Saved favourites are stored locally in your browser using
            localStorage and are not stored in Trimmute’s database or associated
            with your Trimmute account. The use of browser storage is addressed
            in section 9. Where legitimate interests are relied on, Trimmute
            considers the purpose and necessity of the processing, the potential
            impact on individuals, and whether Trimmute’s interests are
            overridden by the individual’s rights and freedoms. You may object
            to processing based on legitimate interests as described in section
            12.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>6. Who information may be shared with</h2>

          <p style={paragraphStyle}>
            Personal information may be shared where necessary with service
            providers and other recipients including:
          </p>

          <ul style={listStyle}>
            <li>frontend hosting providers;</li>
            <li>backend and API hosting providers;</li>
            <li>database and storage providers;</li>
            <li>authentication providers;</li>
            <li>analytics providers;</li>
            <li>postcode and location lookup services;</li>
            <li>map and tile providers;</li>
            <li>email and communication providers;</li>
            <li>professional advisers;</li>
            <li>regulators or authorities where required by law.</li>
          </ul>

          <p style={paragraphStyle}>
            Where a service provider acts as a processor for Trimmute,
            appropriate data-processing terms or other contractual protections
            are used where required by law.
          </p>

          <p style={paragraphStyle}>
            Not every third party listed below acts in the same capacity. Some
            providers process personal information on Trimmute’s behalf as
            processors, while other services may receive information directly
            from a user’s browser and process that information under their own
            applicable privacy terms. The role of each provider depends on the
            particular service and processing involved.
          </p>

          <h3 style={subheadingStyle}>Current third-party services</h3>

          <p style={paragraphStyle}>
            <strong>Vercel</strong> – frontend hosting and Web Analytics. When
            Trimmute is accessed, Vercel may process technical request
            information such as IP address, browser or device information and
            site-traffic information. Where Vercel Web Analytics is enabled for
            a user, analytics events are also sent to Vercel.
          </p>

          <p style={paragraphStyle}>
            <strong>Render</strong> – backend and API hosting. When Trimmute’s
            backend is used, Render may process API request information such as
            IP address, request details and, where location-based search is
            used, location coordinates included in the request. Render also
            maintains associated server or request logs.
          </p>

          <p style={paragraphStyle}>
            <strong>Supabase</strong> – database and storage services. Supabase
            may process business and listing records and other application data
            stored by Trimmute. Trimmute’s primary production database is hosted
            in West EU (Ireland), eu-west-1.
          </p>

          <p style={paragraphStyle}>
            <strong>Clerk</strong> – sign-in, authentication and related account
            functionality. Where a user creates or uses an account, Clerk may
            process information such as the user’s email address, name where
            provided, authentication and session identifiers, and related
            device, request and security information.
          </p>

          <p style={paragraphStyle}>
            <strong>postcodes.io</strong> – external postcode and geocoding
            service. When you use postcode search, the postcode is sent directly
            from your browser to postcodes.io. The provider has confirmed that
            submitted postcodes, IP addresses and associated HTTP request
            information may be recorded in server logs and retained for 28
            days.
          </p>

          <p style={paragraphStyle}>
            <strong>OpenFreeMap</strong> – external map-tile service. Map tiles
            are loaded directly by your browser. When map tiles are requested,
            OpenFreeMap may receive technical request information such as your
            IP address, browser information and request details.
          </p>

          <p style={paragraphStyle}>
            <strong>Google (Gmail)</strong> – email and business communications.
            Where you contact Trimmute by email, Google may process information
            contained in or associated with that communication, including your
            email address, message content and related technical information.
          </p>

          <p style={paragraphStyle}>
            <strong>External provider websites and booking platforms</strong> –
            where you follow an external booking or contact link, you leave
            Trimmute and interact directly with the relevant third party. Any
            personal information you then provide is processed under that third
            party’s own privacy terms. Trimmute does not operate or receive the
            resulting booking as part of the normal redirect process.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>7. International transfers</h2>

          <p style={paragraphStyle}>
            Some service providers may process, access or store personal
            information outside the UK. Where UK data protection law treats a
            transfer as a restricted transfer, an appropriate transfer
            mechanism or safeguard is used or relied on where required.
          </p>

          <p style={paragraphStyle}>
            Depending on the provider and transfer, safeguards may include UK
            adequacy regulations, the UK Extension to the EU–U.S. Data Privacy
            Framework where applicable, the UK Addendum to the EU Standard
            Contractual Clauses, or another safeguard or exception permitted by
            UK law.
          </p>

          <p style={paragraphStyle}>
            Trimmute’s primary Supabase database is hosted in Ireland. Other
            providers may use infrastructure, support teams or subprocessors
            outside the UK.
          </p>

          <p style={paragraphStyle}>
            You may request further information about the safeguards applied to
            a particular transfer by contacting Trimmute using the details in
            section 16.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>8. Retention</h2>

          <p style={paragraphStyle}>
            Trimmute keeps personal information only for as long as reasonably
            needed for the purpose for which it was collected, or to meet legal,
            security, accounting, dispute or regulatory requirements.
          </p>

          <p style={paragraphStyle}>
            <strong>Location data:</strong> used temporarily to calculate nearby
            results and not stored in Trimmute’s database as part of a user
            profile. Device location coordinates sent to Trimmute’s backend may
            also appear in associated server or request logs, which under
            Trimmute’s current Render configuration are retained for
            approximately 7 days.
          </p>

          <p style={paragraphStyle}>
            <strong>Postcode searches:</strong> used to generate nearby results
            and are not stored by Trimmute as part of a user profile. When a
            postcode is sent to postcodes.io, the provider has confirmed that
            the submitted postcode, IP address and associated HTTP request
            information may be recorded in server logs and retained for 28 days.
          </p>

          <p style={paragraphStyle}>
            <strong>Saved favourites:</strong> stored in your browser until
            favourites are removed or relevant browser data is cleared.
          </p>

          <p style={paragraphStyle}>
            <strong>Partner and business records:</strong> retained while
            relevant to the listing or business relationship and afterwards for
            as long as reasonably necessary for record-keeping, permissions,
            compliance, legal claims or disputes. These records are reviewed
            periodically and deleted when no longer required.
          </p>

          <p style={paragraphStyle}>
            <strong>Messages and emails:</strong> retained for as long as
            reasonably necessary to respond to the communication, maintain
            appropriate business or compliance records, and deal with any
            related legal or dispute matters. They are reviewed periodically and
            deleted when no longer required.
          </p>

          <p style={paragraphStyle}>
            <strong>Analytics and technical logs:</strong> backend and request
            logs may be retained by Trimmute’s service providers for
            operational, security and diagnostic purposes. Under Trimmute’s
            current Render service configuration, backend/server logs are
            retained for approximately 7 days. Vercel Web Analytics and other
            provider-generated technical data are retained in accordance with
            the relevant provider’s service settings and retention practices.
          </p>

          <p style={paragraphStyle}>
            <strong>Account and authentication information:</strong> where a
            user creates a Trimmute account, account and authentication
            information is retained through Clerk while the account remains
            active. Where an account is deleted, Trimmute can delete the
            corresponding user account through Clerk. Any residual information
            retained by Clerk following deletion is subject to Clerk’s
            applicable deletion, backup, security and legal retention practices.
          </p>

          <p style={paragraphStyle}>
            <strong>OpenFreeMap technical logs:</strong> OpenFreeMap states that
            its normal access logs do not store IP addresses. Error logs that
            may contain an IP address are deleted after 7 days. Where temporary
            IP logging is enabled in response to a security incident or misuse,
            those logs are deleted when the investigation ends or after a
            maximum of 30 days, whichever is sooner.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>
            9. Cookies, analytics and browser storage
          </h2>

          <p style={paragraphStyle}>
            Trimmute uses cookies, localStorage and similar storage and access
            technologies where needed for website functionality,
            authentication and security, saved preferences and other
            functionality.
          </p>

          <p style={paragraphStyle}>
            These technologies may be used to provide sign-in and security
            functionality, remember saved favourites, and support website
            functionality and reliability.
          </p>

          <p style={paragraphStyle}>
            Trimmute uses Vercel Web Analytics to understand general website
            usage and improve the service. Vercel Web Analytics is configured
            without advertising or cross-site tracking and does not use cookies
            to identify individual visitors. Trimmute also provides an Analytics
            setting that allows users to disable Vercel Web Analytics on their
            device. That preference is stored in the user’s browser.
          </p>

          <p style={paragraphStyle}>
            Trimmute does not use advertising pixels such as Meta Pixel or
            TikTok Pixel, and does not use Google Analytics or Hotjar.
          </p>

          <p style={paragraphStyle}>
            For more information, see the{" "}
            <a href="/cookies" style={linkStyle}>
              Trimmute Cookie & Storage Notice
            </a>
            .
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>10. Security</h2>

          <p style={paragraphStyle}>
            Trimmute takes reasonable technical and organisational steps
            designed to protect personal information from unauthorised access,
            loss, misuse, alteration or disclosure, including controls over
            administrative access and the use of reputable hosting, database and
            authentication providers.
          </p>

          <p style={paragraphStyle}>
            No website, database or online service can be guaranteed to be
            completely secure.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>
            11. External sites, providers and booking services
          </h2>

          <p style={paragraphStyle}>
            Trimmute links to external barbers, salons, provider websites and
            third-party booking platforms. Those organisations are independent
            of Trimmute and are responsible for their own privacy practices,
            content, security and the services they provide.
          </p>

          <p style={paragraphStyle}>
            When you follow a link to an external provider or booking platform,
            that organisation’s own privacy policy and terms apply to
            information you provide to it. This Privacy Policy continues to
            apply to personal information processed by Trimmute, but does not
            govern the receiving organisation’s separate processing.
          </p>

          <p style={paragraphStyle}>
            Listing information may be provided or confirmed by the relevant
            business, or obtained from publicly available sources. However,
            Trimmute will only describe a business as quiet-friendly,
            low-conversation or similar where the business has confirmed or
            otherwise expressly agreed that it is open to accommodating such
            requests. Trimmute does not guarantee that other listing information
            will always be accurate or current, or that an individual user’s
            experience will match the information shown.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>12. Your rights</h2>

          <p style={paragraphStyle}>
            Depending on the circumstances, individuals may have rights under
            data protection law, including rights to:
          </p>

          <ul style={listStyle}>
            <li>ask for a copy of personal information;</li>
            <li>
              ask for inaccurate or incomplete information to be corrected;
            </li>
            <li>ask for information to be deleted in certain circumstances;</li>
            <li>object to certain uses of information;</li>
            <li>restrict processing in certain circumstances;</li>
            <li>request data portability where the right applies;</li>
            <li>
              withdraw consent where processing relies on consent, without
              affecting processing before withdrawal;
            </li>
            <li>
              make a data protection complaint to Trimmute and to the
              Information Commissioner’s Office (ICO).
            </li>
          </ul>

          <p style={paragraphStyle}>
            To exercise a data protection right, contact trimmute@gmail.com.
            Trimmute may need to verify identity before responding to certain
            requests and will respond within the time limits required by
            applicable law. There is normally no charge for exercising these
            rights.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>13. Data protection complaints</h2>

          <p style={paragraphStyle}>
            If you have a concern about how Trimmute has used or handled your
            personal information, you can make a data protection complaint by
            contacting trimmute@gmail.com.
          </p>

          <p style={paragraphStyle}>
            When Trimmute receives a data protection complaint, it will:
          </p>

          <ul style={listStyle}>
            <li>acknowledge receipt within 30 days;</li>
            <li>
              without undue delay, take appropriate steps to investigate and
              respond;
            </li>
            <li>
              make appropriate enquiries and keep the complainant informed where
              necessary;
            </li>
            <li>without undue delay, tell the complainant the outcome.</li>
          </ul>

          <p style={paragraphStyle}>
            If you remain unhappy with the way your complaint has been handled,
            you may complain to the Information Commissioner’s Office (ICO). You
            may complain to the ICO at any time, whether or not you have
            complained to Trimmute first.
          </p>

          <p style={paragraphStyle}>
            <strong>ICO postal address:</strong> Wycliffe House, Water Lane,
            Wilmslow, Cheshire, SK9 5AF
            <br />
            <strong>ICO website:</strong> ico.org.uk
            <br />
            <strong>ICO telephone:</strong> 0303 123 1113
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>14. Children</h2>

          <p style={paragraphStyle}>
            Trimmute is solely for use by adults aged 18 and over. Trimmute is
            not specifically directed at children and does not design its
            account or data-collection features specifically for children.
          </p>

          <p style={paragraphStyle}>
            If Trimmute becomes aware that it is processing a child’s personal
            information in circumstances requiring additional protections, it
            will assess the processing and take appropriate steps under
            applicable data protection law.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>15. Changes to this Privacy Policy</h2>

          <p style={paragraphStyle}>
            Trimmute may update this Privacy Policy when its services,
            providers, data flows or legal obligations change. If significant
            changes are made, the version number and date at the top of this
            policy will be updated and clearer notice will be provided where
            appropriate.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>16. Contact</h2>

          <p style={paragraphStyle}>Harry Carrig trading as Trimmute</p>

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