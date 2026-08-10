export default function CookiesPage() {
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

  const labelStyle = {
    color: "#fff",
    fontWeight: 700,
  };

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
          Version 1.2 | Last updated: 10 August 2026
        </p>

        <p style={paragraphStyle}>
          Trimmute uses a small number of cookies, browser-storage technologies
          and related technical services to provide website functionality,
          remember choices, secure accounts and understand general website
          usage.
        </p>

        <p style={paragraphStyle}>
          Trimmute currently operates as a discovery and directory service.
          Haircut bookings are completed on external provider or third-party
          booking services rather than through Trimmute itself.
        </p>

        <p style={paragraphStyle}>
          This Notice explains what these technologies do, why we use them and
          what choices you have. It should be read together with the{" "}
          <a href="/privacy" style={{ color: "#5eead4" }}>
            Trimmute Privacy Policy
          </a>
          .
        </p>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>
            1. What are cookies and storage/access technologies?
          </h2>

          <p style={paragraphStyle}>
            Cookies are small pieces of information stored on or accessed from
            your device when you use a website. Similar technologies can
            include localStorage, sessionStorage, authentication tokens,
            scripts, device identifiers and other technologies that store
            information on, or access information from, a user's device.
          </p>

          <p style={paragraphStyle}>
            The UK Privacy and Electronic Communications Regulations (PECR)
            apply not only to conventional cookies but also to other
            technologies that store information on, or access information from,
            a user's device.
          </p>

          <p style={paragraphStyle}>
            Some uses require consent. Others may be used without consent where
            a statutory exception applies, including certain technologies that
            are necessary to provide a service requested by the user, or where
            the statutory conditions for other permitted purposes are met.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>
            2. Technologies and services currently used by Trimmute
          </h2>

          <h3>localStorage — trimmute_favorites</h3>

          <p style={paragraphStyle}>
            When you choose to save a haircut provider to your
            roster/favourites, Trimmute stores the relevant favourite
            identifiers in your browser using localStorage.
          </p>

          <p style={paragraphStyle}>
            <span style={labelStyle}>Purpose:</span> to remember the favourites
            you deliberately save and show them again on the same browser or
            device.
          </p>

          <p style={paragraphStyle}>
            <span style={labelStyle}>Storage location:</span> your browser or
            device. Trimmute does not currently store this favourites list in
            its database.
          </p>

          <p style={paragraphStyle}>
            <span style={labelStyle}>Removal:</span> remove favourites through
            Trimmute where available, or clear the site's browser storage.
          </p>

          <p style={paragraphStyle}>
            <span style={labelStyle}>Current classification:</span>{" "}
            user-requested functionality. We currently treat this storage as
            falling within an applicable PECR exception rather than using it
            for advertising or cross-site tracking.
          </p>

          <h3>Clerk authentication</h3>

          <p style={paragraphStyle}>
            Trimmute uses Clerk to provide authentication and account
            functionality.
          </p>

          <p style={paragraphStyle}>
            Clerk sets and accesses authentication or session cookies and may
            also use browser storage or other technical storage necessary to
            initialise, secure and operate its authentication service. These
            technologies are used to authenticate requests, maintain sessions,
            protect account access and support authentication functionality.
          </p>

          <p style={paragraphStyle}>
            Depending on Clerk's current configuration and infrastructure,
            additional technical cookies or storage items may be set in
            connection with authentication, security, abuse prevention or
            service operation. Their exact names may change over time as Clerk
            updates its service.
          </p>

          <p style={paragraphStyle}>
            <span style={labelStyle}>Current classification:</span>{" "}
            authentication, account and security functionality. Clerk may
            initialise certain technical cookies or browser-storage items when
            Trimmute loads, including before a user signs in. Additional
            authentication or session technologies are used if the user chooses
            to sign in. Trimmute does not use these technologies for
            advertising.
          </p>

          <h3>Vercel Web Analytics</h3>

          <p style={paragraphStyle}>
            Trimmute currently uses Vercel Web Analytics to understand general
            website usage and improve the service.
          </p>

          <p style={paragraphStyle}>
            Vercel currently states that Web Analytics does not use cookies and
            uses privacy-focused technical measures to distinguish website
            visits for analytics purposes.
          </p>

          <p style={paragraphStyle}>
            <span style={labelStyle}>Purpose:</span> statistical information
            about how Trimmute is used, such as page traffic and general usage
            patterns.
          </p>

          <p style={paragraphStyle}>
            We do not currently use Vercel Web Analytics for targeted
            advertising or cross-site advertising profiles.
          </p>

          <p style={paragraphStyle}>
            We will keep this implementation under review against the live site
            and current PECR requirements. Where a statutory exception requires
            a simple and free means of objecting, we will provide one where
            applicable.
          </p>

          <h3>Postcode search — postcodes.io</h3>

          <p style={paragraphStyle}>
            If you type a postcode into Trimmute, your browser sends that
            postcode directly to postcodes.io so that it can be converted into
            geographic coordinates.
          </p>

          <p style={paragraphStyle}>
            postcodes.io may also receive ordinary technical information
            associated with the web request, such as your IP address and
            browser or network information.
          </p>

          <p style={paragraphStyle}>
            Our current code audit did not identify postcodes.io setting a
            Trimmute cookie or localStorage item. The service is included in
            this Notice because it is part of Trimmute's browser-side
            postcode-search flow and may receive technical request information.
          </p>

          <h3>Near Me / device location</h3>

          <p style={paragraphStyle}>
            If you select the Near Me feature, your browser or device may ask
            for permission to access your location.
          </p>

          <p style={paragraphStyle}>
            If you allow this, the device provides latitude and longitude to
            Trimmute and those coordinates are sent to the Trimmute backend to
            calculate nearby haircut providers.
          </p>

          <p style={paragraphStyle}>
            Browser or device location permission is controlled through your
            browser or operating-system settings. Trimmute does not activate
            location access unless you choose the feature and grant the
            relevant permission.
          </p>

          <p style={paragraphStyle}>
            This is not currently used to set a Trimmute cookie, and Trimmute
            does not intentionally store your precise device location in its
            database as part of a user profile.
          </p>

          <h3>CARTO map tiles</h3>

          <p style={paragraphStyle}>
            Trimmute uses CARTO map tiles through the map interface.
          </p>

          <p style={paragraphStyle}>
            When a map is displayed, your browser requests map tiles directly
            from CARTO's map-tile infrastructure. CARTO may receive ordinary
            technical request information such as your IP address,
            browser or device information and the map-tile requests necessary
            to render the map.
          </p>

          <p style={paragraphStyle}>
            Our current code audit did not identify Trimmute sending names or
            account records to CARTO. Trimmute does not currently upload a
            user-account database to CARTO.
          </p>

          <h3>External booking and third-party links</h3>

          <p style={paragraphStyle}>
            Some listings link to external booking platforms, websites,
            social-media services or other third-party services.
          </p>

          <p style={paragraphStyle}>
            Trimmute does not currently process the resulting haircut booking.
            Once you leave Trimmute, those third parties may use their own
            cookies, analytics, advertising technologies or other
            storage/access technologies. Their own privacy policies, cookie
            notices and terms apply. Trimmute does not control those
            technologies.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>3. When consent is and is not required</h2>

          <p style={paragraphStyle}>
            PECR generally requires clear information and prior consent before
            storing information on, or accessing information from, a user's
            device unless a statutory exception applies.
          </p>

          <p style={paragraphStyle}>Current exceptions can include:</p>

          <ul style={listStyle}>
            <li>
              storage or access that is necessary to provide an online service
              or feature requested by the user;
            </li>
            <li>
              certain storage or access used solely to collect statistical
              information about use of a service or website with a view to
              improving it, subject to the statutory conditions;
            </li>
            <li>
              certain storage or access used to adapt how a service appears or
              functions in line with the user's preferences, subject to the
              statutory conditions.
            </li>
          </ul>

          <p style={paragraphStyle}>
            Some exceptions have additional requirements, which may include
            giving users a simple and free means of objecting.
          </p>

          <p style={paragraphStyle}>
            Trimmute's current storage technologies are intended primarily to
            provide user-requested functionality and authentication or security.
            Vercel Web Analytics currently states that it does not use cookies.
            We will confirm the final consent and objection arrangements against
            the production site before public launch.
          </p>

          <p style={paragraphStyle}>
            If Trimmute introduces non-exempt advertising, tracking, profiling
            or other storage or access technologies, we will obtain consent
            before using them where required.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>
            4. Technologies Trimmute does not currently use
          </h2>

          <p style={paragraphStyle}>
            Our current audit has not identified the following advertising or
            behavioural-tracking tools on Trimmute:
          </p>

          <ul style={listStyle}>
            <li>Google Analytics;</li>
            <li>Meta Pixel;</li>
            <li>TikTok Pixel;</li>
            <li>Hotjar;</li>
            <li>advertising or retargeting pixels.</li>
          </ul>

          <p style={paragraphStyle}>
            If this changes, we will update this Notice and implement any
            consent or objection controls required by law before the relevant
            technologies are used.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>
            5. How to control cookies, storage and permissions
          </h2>

          <p style={paragraphStyle}>
            Depending on your browser or device, you can usually:
          </p>

          <ul style={listStyle}>
            <li>block or delete cookies;</li>
            <li>clear localStorage and other site data;</li>
            <li>
              remove saved favourites through Trimmute where that functionality
              is available;
            </li>
            <li>block or withdraw device-location permission;</li>
            <li>use private or incognito browsing;</li>
            <li>
              use any Trimmute consent or objection control that is provided.
            </li>
          </ul>

          <p style={paragraphStyle}>
            Clearing browser storage may remove saved favourites and other
            locally stored preferences, and may cause you to be signed out.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>6. Retention</h2>

          <p style={paragraphStyle}>
            Browser-storage items remain on the user's device according to the
            way the relevant feature and browser operate, until they expire,
            are replaced, are removed through the service where available, or
            the user clears site or browser data.
          </p>

          <p style={paragraphStyle}>
            Clerk authentication cookies and session information are retained
            according to the authentication or session settings and Clerk's
            applicable service configuration.
          </p>

          <p style={paragraphStyle}>
            Analytics and related technical information is retained according to
            Vercel's applicable service settings and documentation.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>7. Changes to this Notice</h2>

          <p style={paragraphStyle}>
            We may update this Cookie & Storage Notice when Trimmute changes
            its features, providers or use of storage or access technologies,
            or when relevant legal requirements change.
          </p>

          <p style={paragraphStyle}>
            Where a material change affects consent or objection requirements,
            we will update the relevant controls as well as this Notice.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>8. Contact</h2>

          <p style={paragraphStyle}>
            If you have questions about Trimmute's use of cookies, browser
            storage, analytics or similar technologies, contact:
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