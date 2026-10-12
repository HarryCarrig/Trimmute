import type { ReactNode } from "react";

export default function CookiesPage() {
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
    minWidth: "850px",
  };

  const cellStyle = {
    border: "1px solid rgba(255,255,255,0.16)",
    padding: "0.7rem",
    verticalAlign: "top" as const,
    textAlign: "left" as const,
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
          Trimmute Cookie & Storage Notice
        </h1>

        <p style={{ color: "#77777f", marginTop: 0 }}>
          Last updated: 12 October 2026
        </p>

        <p style={paragraphStyle}>
          Trimmute uses a small number of cookies, browser-storage technologies
          and related technical services to provide website functionality,
          remember user choices, secure accounts and understand general website
          usage.
        </p>

        <p style={paragraphStyle}>
          Trimmute currently operates as a discovery and directory service.
          Haircut bookings are completed with external providers or through
          third-party booking platforms rather than through Trimmute itself.
        </p>

        <p style={paragraphStyle}>
          This Notice explains the storage and access technologies currently
          identified in Trimmute&apos;s implementation, why they are used, and
          the choices available to users. It should be read together with the{" "}
          <a href="/privacy" style={linkStyle}>
            Trimmute Privacy Policy
          </a>
          , which explains how personal data is handled under UK data protection
          law and provides further information about the third-party services
          referred to below.
        </p>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>1. Scope of this Notice</h2>

          <Clause number="1.1">
            This Notice covers cookies, localStorage, session storage,
            authentication tokens and similar storage or access technologies
            used in connection with the Trimmute website (“the Service”).
          </Clause>

          <Clause number="1.2">
            This Notice does not cover the privacy practices of third-party
            websites or booking platforms a user visits after leaving Trimmute.
            Those third parties&apos; own cookie notices, privacy policies and
            terms apply once a user leaves the Service.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>
            2. What are cookies and storage/access technologies?
          </h2>

          <Clause number="2.1">
            Cookies are small pieces of information stored on, or accessed from,
            a user&apos;s device when the Service is used. Similar technologies
            include localStorage, sessionStorage, authentication tokens, scripts,
            device identifiers and other technologies that store information
            on, or access information from, a user&apos;s device.
          </Clause>

          <Clause number="2.2">
            The UK Privacy and Electronic Communications Regulations (“PECR”)
            apply to storage and access technologies generally, not only to
            conventional cookies.
          </Clause>

          <Clause number="2.3">
            Some uses require prior consent from the user. Other uses may fall
            within a statutory exception where the relevant legal conditions are
            met, as explained in Section 5 below.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>3. Summary table</h2>

          <p style={paragraphStyle}>
            The table below summarises the storage and access technologies
            currently identified on the Service. It is supplemented by the
            detailed descriptions in Section 4.
          </p>

          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={cellStyle}>Name / Provider</th>
                  <th style={cellStyle}>Type</th>
                  <th style={cellStyle}>Purpose</th>
                  <th style={cellStyle}>Duration</th>
                  <th style={cellStyle}>PECR basis</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td style={cellStyle}>
                    trimmute_favorites
                    <br />
                    (localStorage)
                  </td>
                  <td style={cellStyle}>Functional — first party</td>
                  <td style={cellStyle}>
                    Remembers haircut providers a user saves to their favourites
                    on that browser
                  </td>
                  <td style={cellStyle}>
                    Until removed by the user or browser storage is cleared
                  </td>
                  <td style={cellStyle}>
                    Strictly necessary for a service requested by the user
                  </td>
                </tr>

                <tr>
                  <td style={cellStyle}>Clerk session/auth cookies</td>
                  <td style={cellStyle}>
                    Strictly necessary — first/third party (Clerk)
                  </td>
                  <td style={cellStyle}>
                    Signs users in, maintains sessions, and supports account
                    security and abuse prevention
                  </td>
                  <td style={cellStyle}>Per Clerk&apos;s session configuration</td>
                  <td style={cellStyle}>Strictly necessary</td>
                </tr>

                <tr>
                  <td style={cellStyle}>Vercel Web Analytics</td>
                  <td style={cellStyle}>Analytics — third party (Vercel)</td>
                  <td style={cellStyle}>
                    Aggregate, non-advertising analysis of website usage to
                    improve the service
                  </td>
                  <td style={cellStyle}>
                    Request-derived analytics hash discarded after 24 hours;
                    other analytics data retained in accordance with
                    Vercel&apos;s applicable service configuration and retention
                    practices
                  </td>
                  <td style={cellStyle}>
                    Statistical-purposes exception, subject to the applicable
                    conditions including clear information and a simple, free
                    means of objection
                  </td>
                </tr>

                <tr>
                  <td style={cellStyle}>postcodes.io requests</td>
                  <td style={cellStyle}>Technical request — third party</td>
                  <td style={cellStyle}>
                    Converts a postcode a user enters into map coordinates
                  </td>
                  <td style={cellStyle}>
                    Not stored by Trimmute as part of a user profile;
                    postcodes.io has confirmed that submitted postcodes, IP
                    addresses and associated HTTP request information may be
                    retained in server logs for 28 days
                  </td>
                  <td style={cellStyle}>
                    No Trimmute cookie or localStorage item is set; technical
                    request and personal-data processing is described in the
                    Privacy Policy
                  </td>
                </tr>

                <tr>
                  <td style={cellStyle}>
                    Device location
                    <br />
                    (Use my location)
                  </td>
                  <td style={cellStyle}>
                    Browser/OS permission — first party
                  </td>
                  <td style={cellStyle}>
                    Calculates nearby haircut providers if the user grants
                    location permission
                  </td>
                  <td style={cellStyle}>
                    Controlled by browser/OS permission settings
                  </td>
                  <td style={cellStyle}>
                    User-granted browser/device permission; no persistent
                    Trimmute cookie or localStorage item is set for location
                  </td>
                </tr>

                <tr>
                  <td style={cellStyle}>OpenFreeMap map tiles</td>
                  <td style={cellStyle}>
                    Technical request — third party (OpenFreeMap)
                  </td>
                  <td style={cellStyle}>
                    Loads and displays map tiles when a map is shown
                  </td>
                  <td style={cellStyle}>
                    Not stored by Trimmute; governed by OpenFreeMap
                  </td>
                  <td style={cellStyle}>
                    No Trimmute cookie or localStorage item is set; technical
                    request and personal-data processing is described in the
                    Privacy Policy
                  </td>
                </tr>

                <tr>
                  <td style={cellStyle}>
                    trimmute_analytics_opt_out
                    <br />
                    (localStorage)
                  </td>
                  <td style={cellStyle}>Preference/control — first party</td>
                  <td style={cellStyle}>
                    Remembers whether the user has disabled Vercel Web Analytics
                    on that browser/device so their choice persists
                  </td>
                  <td style={cellStyle}>
                    Until the user changes the Analytics setting or browser
                    storage is cleared
                  </td>
                  <td style={cellStyle}>
                    Strictly necessary to remember the user&apos;s analytics
                    preference/objection
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>4. Technologies and services in detail</h2>

          <h3 style={subheadingStyle}>4.1 trimmute_favorites (localStorage)</h3>

          <p style={paragraphStyle}>
            <strong>Purpose:</strong> remembers haircut providers a user
            deliberately saves to their favourites, so they appear again on the
            same browser and device.
          </p>

          <p style={paragraphStyle}>
            <strong>Storage location:</strong> the user&apos;s browser/device.
            Trimmute does not currently store this favourites list in its own
            database.
          </p>

          <p style={paragraphStyle}>
            <strong>Removal:</strong> users can remove favourites through
            Trimmute where that functionality is available, or by clearing the
            site&apos;s browser storage.
          </p>

          <p style={paragraphStyle}>
            <strong>Classification:</strong> user-requested functionality. Not
            used for advertising or cross-site tracking.
          </p>

          <h3 style={subheadingStyle}>4.2 Clerk authentication</h3>

          <p style={paragraphStyle}>
            Trimmute uses Clerk to provide authentication and account
            functionality. Clerk may set or access authentication and session
            cookies and may use browser storage or other technical storage
            necessary to initialise, secure and operate authentication.
          </p>

          <p style={paragraphStyle}>
            Depending on Clerk&apos;s configuration and infrastructure,
            additional technical cookies or storage items may be used for
            authentication, security, abuse prevention or service operation.
            Exact names may change as Clerk updates its service.
          </p>

          <p style={paragraphStyle}>
            <strong>Classification:</strong> authentication, account and
            security functionality. Not used for advertising.
          </p>

          <h3 style={subheadingStyle}>4.3 Vercel Web Analytics</h3>

          <p style={paragraphStyle}>
            Trimmute uses Vercel Web Analytics to understand general website
            usage and improve the Service. Vercel Web Analytics is used for
            aggregate, non-advertising analytics and is not used by Trimmute for
            targeted advertising, behavioural profiling or cross-site tracking.
          </p>

          <p style={paragraphStyle}>
            Vercel Web Analytics does not rely on conventional analytics cookies
            to identify individual visitors. Vercel states that it uses a
            request-derived hash for first-party analytics, that this cannot be
            used to track a visitor across different websites or applications,
            and that the hash data is discarded after 24 hours.
          </p>

          <p style={paragraphStyle}>
            Trimmute provides an Analytics setting that allows users to disable
            Vercel Web Analytics on their browser/device. That preference is
            stored locally so the user&apos;s choice persists.
          </p>

          <h3 style={subheadingStyle}>4.4 Postcode search — postcodes.io</h3>

          <p style={paragraphStyle}>
            If a user enters a postcode, the browser sends that postcode
            directly to postcodes.io so it can be converted into geographic
            coordinates. postcodes.io may receive ordinary technical request
            information such as an IP address and browser or network
            information. postcodes.io has confirmed that submitted postcodes, IP
            addresses and associated HTTP request information may be recorded in
            server logs and retained for 28 days.
          </p>

          <p style={paragraphStyle}>
            No Trimmute cookie or localStorage item is set by postcodes.io.
          </p>

          <h3 style={subheadingStyle}>
            4.5 Device location / Use my location
          </h3>

          <p style={paragraphStyle}>
            If a user chooses to use their device location, the browser or
            device may request location permission. If permission is granted,
            latitude and longitude are sent to Trimmute&apos;s backend to
            calculate nearby haircut providers.
          </p>

          <p style={paragraphStyle}>
            This feature is controlled through browser or operating-system
            permissions. Trimmute does not intentionally store precise device
            location in its database as part of a user profile.
          </p>

          <h3 style={subheadingStyle}>4.6 OpenFreeMap map tiles</h3>

          <p style={paragraphStyle}>
            When a map is displayed, the browser requests map tiles directly
            from OpenFreeMap&apos;s infrastructure. OpenFreeMap may receive
            ordinary technical request information such as an IP address,
            browser/device information and the map-tile requests needed to
            render the map.
          </p>

          <p style={paragraphStyle}>
            No names or account records are sent to OpenFreeMap by Trimmute.
          </p>

          <h3 style={subheadingStyle}>
            4.7 External booking and third-party links
          </h3>

          <p style={paragraphStyle}>
            Some listings link to external booking platforms, websites, maps,
            social media services or other third-party services. Trimmute does
            not process the resulting haircut booking.
          </p>

          <p style={paragraphStyle}>
            After a user leaves Trimmute, those third parties may use their own
            cookies, analytics, advertising technologies or other storage/access
            technologies. Their own privacy policies, cookie notices and terms
            apply.
          </p>

          <h3 style={subheadingStyle}>
            4.8 Analytics preference (localStorage)
          </h3>

          <p style={paragraphStyle}>
            Trimmute stores the user&apos;s Analytics setting in localStorage so
            that a choice to disable or re-enable Vercel Web Analytics persists
            on that browser/device.
          </p>

          <p style={paragraphStyle}>
            <strong>Storage location:</strong> the user&apos;s browser/device.
          </p>

          <p style={paragraphStyle}>
            <strong>Removal:</strong> the preference is changed when the user
            changes the Analytics setting and may also be removed by clearing
            the site&apos;s browser storage.
          </p>

          <p style={paragraphStyle}>
            <strong>Classification:</strong> preference storage used to remember
            the user&apos;s analytics choice. It is not used for advertising,
            profiling or cross-site tracking.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>5. PECR basis and consent</h2>

          <Clause number="5.1">
            PECR generally requires clear information and prior consent before
            information is stored on, or accessed from, a user&apos;s device,
            unless a statutory exception applies.
          </Clause>

          <Clause number="5.2">
            Statutory exceptions that may apply include storage or access that
            is:
          </Clause>

          <ul style={listStyle}>
            <li>
              strictly necessary to provide an online service or feature
              requested by the user;
            </li>
            <li>
              used solely to collect statistical information about use of the
              Service with a view to improving it, subject to statutory
              conditions; or
            </li>
            <li>
              used to adapt how the Service appears or functions in line with
              the user&apos;s preferences, subject to statutory conditions.
            </li>
          </ul>

          <Clause number="5.3">
            Some statutory exceptions carry additional conditions, which may
            include giving users a simple and free means of objecting to the
            relevant storage or access.
          </Clause>

          <Clause number="5.4">
            Trimmute&apos;s current position is that its storage and access
            technologies are used for user-requested functionality,
            authentication and security, saved preferences, and aggregate
            statistical analytics. Trimmute does not currently use non-exempt
            advertising, behavioural-tracking or profiling technologies. Where
            the statistical-purposes exception is relied on for analytics,
            Trimmute provides clear information and a simple, free means for
            users to object through its Analytics setting.
          </Clause>

          <Clause number="5.5">
            If Trimmute introduces advertising, tracking, profiling or other
            non-exempt storage or access technologies, Trimmute will obtain
            consent before such technologies are used, and this Notice will be
            updated accordingly.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>6. Technologies not currently in use</h2>

          <p style={paragraphStyle}>
            Trimmute&apos;s technical audit has not identified the use of the
            following categories of advertising or behavioural-tracking tool on
            the Service:
          </p>

          <ul style={listStyle}>
            <li>Google Analytics</li>
            <li>Meta Pixel</li>
            <li>TikTok Pixel</li>
            <li>Hotjar or comparable session-recording tools</li>
            <li>Advertising or retargeting pixels</li>
          </ul>

          <p style={paragraphStyle}>
            If this changes, this Notice and any required consent or objection
            controls will be updated before the relevant technology is used.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>
            7. How users can control storage and permissions
          </h2>

          <p style={paragraphStyle}>
            Depending on the browser and device, users can usually:
          </p>

          <ul style={listStyle}>
            <li>block or delete cookies through their browser settings;</li>
            <li>
              clear localStorage and other site data through their browser
              settings;
            </li>
            <li>
              remove saved favourites through Trimmute, where that functionality
              is available;
            </li>
            <li>
              block or withdraw device-location permission through browser or
              operating-system settings;
            </li>
            <li>use private or incognito browsing; and</li>
            <li>
              use Trimmute&apos;s Analytics setting to disable or re-enable
              Vercel Web Analytics on that browser/device.
            </li>
          </ul>

          <p style={paragraphStyle}>
            The Analytics setting is stored locally in the user&apos;s browser
            so that the choice persists until it is changed or the relevant
            browser storage is cleared.
          </p>

          <p style={paragraphStyle}>
            Clearing browser storage may remove saved favourites and other
            locally stored preferences, and may sign the user out of their
            account.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>8. Retention</h2>

          <Clause number="8.1">
            Browser-storage items remain on the user&apos;s device according to
            the relevant feature and browser settings, until they expire, are
            replaced, are removed through the Service where available, or the
            user clears browser data.
          </Clause>

          <Clause number="8.2">
            Clerk authentication cookies and session information are retained
            according to the applicable authentication and session settings and
            Clerk&apos;s applicable service configuration.
          </Clause>

          <Clause number="8.3">
            Vercel Web Analytics data is retained in accordance with
            Vercel&apos;s applicable service configuration and retention
            practices. Vercel states that the request-derived hash used for
            first-party analytics is discarded after 24 hours. Trimmute does
            not use analytics data to maintain persistent individual visitor
            profiles.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>9. International transfers</h2>

          <p style={paragraphStyle}>
            Some providers referred to in this Notice may process, access or
            store personal data outside the United Kingdom. Further information
            about international transfers of personal data, including the
            safeguards that may apply, is set out in the{" "}
            <a href="/privacy" style={linkStyle}>
              Trimmute Privacy Policy
            </a>
            .
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>10. Your rights and how to complain</h2>

          <Clause number="10.1">
            Further information about your rights in relation to personal data
            processed in connection with cookies, browser storage and similar
            technologies is set out in the{" "}
            <a href="/privacy" style={linkStyle}>
              Trimmute Privacy Policy
            </a>
            .
          </Clause>

          <Clause number="10.2">
            If you are unhappy with how Trimmute uses cookies, browser storage
            or similar technologies, you can contact Trimmute using the details
            in Section 13 or lodge a complaint with the UK Information
            Commissioner&apos;s Office (ICO) at ico.org.uk. Concerns about a
            third party&apos;s own use of cookies or similar technologies should
            also be raised directly with that third party where appropriate.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>11. Children</h2>

          <p style={paragraphStyle}>
            Trimmute is solely for use by adults aged 18 and over and is not
            specifically directed at children. Trimmute does not knowingly
            collect information from children through the storage and access
            technologies described in this Notice.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>12. Changes to this Notice</h2>

          <Clause number="12.1">
            Trimmute may update this Notice when features, providers,
            storage/access technologies or legal requirements change.
          </Clause>

          <Clause number="12.2">
            Where a material change affects the consent or objection mechanisms
            available to users, Trimmute will update those controls as well as
            this Notice.
          </Clause>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>13. Contact</h2>

          <p style={paragraphStyle}>
            Harry Carrig, trading as Trimmute (sole trader)
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