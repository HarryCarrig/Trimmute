export default function PrivacyPage() {
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
          Version 1.1 | Last updated: 10 August 2026
        </p>

        <p style={paragraphStyle}>
          Trimmute is a website that helps people find barbers, salons and
          haircut providers who are open to quieter, low-conversation haircut
          experiences.
        </p>

        <p style={paragraphStyle}>
          This Privacy Policy explains what personal information Trimmute
          collects, how we use it, who we share it with, how international
          transfers are handled, and what rights you have.
        </p>

        <p style={paragraphStyle}>
          <strong>Trimmute is operated by Harry Carrig, trading as Trimmute.</strong>
        </p>

        <p style={paragraphStyle}>
          <strong>Email:</strong> trimmute@gmail.com
          <br />
          <strong>Postal address:</strong> Lytchett House, 13 Freeland Park,
          Wareham Road, Poole, Dorset, BH16 6FA
        </p>

        <p style={paragraphStyle}>
          For privacy questions, data requests, or data protection complaints,
          please contact us using the details above.
        </p>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>1. What information we collect</h2>

          <p style={paragraphStyle}>
            We only collect personal information where it is needed to run
            Trimmute, provide requested or optional features, improve and
            secure the service, manage business relationships, or comply with
            legal obligations.
          </p>

          <h3>Information you provide directly</h3>

          <ul style={listStyle}>
            <li>your name, if you make or request a booking through Trimmute;</li>
            <li>your selected barber, salon, or haircut provider;</li>
            <li>appointment date and time;</li>
            <li>whether you request a quiet or low-conversation appointment;</li>
            <li>
              any booking notes or requirements you choose to provide, if this
              feature is available;
            </li>
            <li>
              information you provide when contacting us by email, message,
              social media, or other communication channels.
            </li>
          </ul>

          <p style={paragraphStyle}>
            Please do not include medical information, diagnoses, disability
            information, or other sensitive personal information in booking
            notes or messages unless we specifically ask for it and explain
            why. A quiet or low-conversation request is not, by itself, used
            by Trimmute to infer a medical diagnosis, disability, or health
            condition.
          </p>

          <p style={paragraphStyle}>
            If you voluntarily provide sensitive information that we did not
            request, we will handle it only as reasonably necessary to deal
            with your request, protect the service, comply with law, or delete
            it as appropriate.
          </p>

          <h3>Location and postcode information</h3>

          <p style={paragraphStyle}>
            If you press “Near Me”, your browser or device may ask for
            permission to access your location.
          </p>

          <p style={paragraphStyle}>
            If you allow this, Trimmute receives the latitude and longitude
            provided by your device and sends those coordinates to the
            Trimmute backend so that nearby haircut providers and distances
            can be calculated. The backend is hosted using Render. We do not
            intentionally store your precise device location in our database
            as part of a user profile.
          </p>

          <p style={paragraphStyle}>
            If you search using a postcode, the postcode you enter is sent
            directly from your browser to postcodes.io so that it can be
            converted into geographic coordinates. postcodes.io may also
            receive ordinary technical request information associated with
            that request, such as your IP address and browser/network
            information. The returned coordinates are then used by Trimmute
            to request nearby haircut providers.
          </p>

          <p style={paragraphStyle}>
            When you view maps on Trimmute, your browser loads map tiles
            directly from CARTO’s map-tile infrastructure. CARTO may therefore
            receive ordinary technical request data such as your IP address,
            browser/device information and the map-tile requests needed to
            display the map. Trimmute does not currently upload its customer or
            booking database to CARTO.
          </p>

          <h3>Account and sign-in information</h3>

          <p style={paragraphStyle}>
            Trimmute may allow users to sign in or create an account through
            Clerk.
          </p>

          <p style={paragraphStyle}>
            If you use sign-in features, Clerk may process account and
            authentication information such as your email address, name, login
            or authentication identifiers, and related technical information.
            Clerk generally acts as a processor for end-user authentication
            data provided through Trimmute, while acting separately as an
            independent controller for certain Clerk account information.
          </p>

          <p style={paragraphStyle}>
            At this stage, Trimmute does not use account information for
            advertising or profiling.
          </p>

          <h3>Saved favourites / roster</h3>

          <p style={paragraphStyle}>
            Trimmute allows you to save favourite shops to your roster. Your
            roster/favourites are currently stored in your browser using
            localStorage. This means the saved roster is stored on your
            device/browser and is not currently saved to Trimmute’s database.
          </p>

          <h3>Booking information</h3>

          <p style={paragraphStyle}>
            If booking features are available through Trimmute, we may collect
            and store booking information such as:
          </p>

          <ul style={listStyle}>
            <li>your name;</li>
            <li>the selected haircut provider;</li>
            <li>booking date and time;</li>
            <li>whether a quiet or low-conversation request was made;</li>
            <li>any booking notes or requirements you provide;</li>
            <li>a booking token used to retrieve or manage your booking.</li>
          </ul>

          <p style={paragraphStyle}>
            A booking token may be stored in your browser using localStorage
            so bookings can be shown again on the same device.
          </p>

          <h3>Technical and usage information</h3>

          <p style={paragraphStyle}>
            When you use Trimmute, we or our service providers may process
            technical and usage information, including:
          </p>

          <ul style={listStyle}>
            <li>IP address;</li>
            <li>browser type;</li>
            <li>device type;</li>
            <li>pages visited;</li>
            <li>approximate usage events;</li>
            <li>error logs;</li>
            <li>server logs;</li>
            <li>analytics information.</li>
          </ul>

          <p style={paragraphStyle}>
            We currently use Vercel Web Analytics to understand general site
            usage and improve the website. Vercel states that its Web Analytics
            product stores anonymised analytics data and does not use cookies
            for Web Analytics.
          </p>

          <h3>Business and partner information</h3>

          <p style={paragraphStyle}>
            If you are a barber, salon, or business listed on Trimmute, we may
            collect and use business information such as:
          </p>

          <ul style={listStyle}>
            <li>business name;</li>
            <li>address;</li>
            <li>postcode;</li>
            <li>contact details;</li>
            <li>booking link;</li>
            <li>shop images or logos;</li>
            <li>whether you have agreed to be listed as quiet-friendly;</li>
            <li>service and pricing information;</li>
            <li>communication history with us.</li>
          </ul>

          <p style={paragraphStyle}>
            Some of this information may already be publicly available, but we
            may also collect it directly from you.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>2. How we use your information</h2>

          <p style={paragraphStyle}>We use personal information to:</p>

          <ul style={listStyle}>
            <li>operate and display the Trimmute website;</li>
            <li>show nearby haircut providers;</li>
            <li>allow postcode and location-based searches;</li>
            <li>display shop details, maps, prices, and booking links;</li>
            <li>allow users to save favourites to their roster;</li>
            <li>provide optional booking features, where available;</li>
            <li>help users request quiet or low-conversation appointments;</li>
            <li>manage verified partner listings and permissions;</li>
            <li>communicate with users, shops, and partners;</li>
            <li>improve the website and user experience;</li>
            <li>monitor performance, bugs, and security;</li>
            <li>prevent misuse, spam, fraud, or unauthorised access;</li>
            <li>maintain appropriate business and compliance records;</li>
            <li>comply with legal obligations.</li>
          </ul>

          <p style={paragraphStyle}>
            We do not sell your personal information.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>3. Lawful bases for using your information</h2>

          <p style={paragraphStyle}>
            Under UK data protection law, we need a lawful basis to use
            personal information. The lawful basis depends on the particular
            processing activity.
          </p>

          <h3>Consent</h3>

          <p style={paragraphStyle}>
            We rely on consent where you choose to allow browser/device
            location access for the Near Me feature, where consent is the
            appropriate lawful basis. You can refuse location access or
            withdraw the relevant browser/device permission through your
            settings.
          </p>

          <h3>Contract or steps before a contract</h3>

          <p style={paragraphStyle}>
            We may rely on this basis where processing is necessary for a
            contract between you and Trimmute, or to take steps at your request
            before entering into such a contract. We do not rely on this basis
            merely because you click through to a third-party haircut provider
            or booking platform.
          </p>

          <h3>Legitimate interests</h3>

          <p style={paragraphStyle}>We may rely on legitimate interests to:</p>

          <ul style={listStyle}>
            <li>run and improve Trimmute;</li>
            <li>provide search, directory and related platform functionality;</li>
            <li>understand general site usage;</li>
            <li>keep the website secure;</li>
            <li>manage partner relationships and permissions;</li>
            <li>maintain business and compliance records;</li>
            <li>communicate with shops and users;</li>
            <li>display business listings and quiet-friendly provider information;</li>
            <li>
              use trusted service providers to host, operate, analyse, and
              secure the website.
            </li>
          </ul>

          <p style={paragraphStyle}>
            Where we rely on legitimate interests, we consider the purpose,
            necessity and impact of the processing and whether our interests
            are overridden by your rights and freedoms.
          </p>

          <h3>Legal obligation</h3>

          <p style={paragraphStyle}>
            We may use personal information where needed to comply with legal,
            regulatory, tax, accounting, data protection, complaint-handling,
            or other legal obligations.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>4. Who we share information with</h2>

          <p style={paragraphStyle}>
            We may share personal information with trusted service providers
            and other recipients where necessary to run Trimmute or provide
            requested functionality, including:
          </p>

          <ul style={listStyle}>
            <li>website and frontend hosting providers;</li>
            <li>backend/API hosting providers;</li>
            <li>database and storage providers;</li>
            <li>authentication providers;</li>
            <li>analytics providers;</li>
            <li>postcode/location lookup services;</li>
            <li>map and tile providers;</li>
            <li>email or communication providers, if used;</li>
            <li>professional advisers;</li>
            <li>regulators or authorities where required by law;</li>
            <li>listed haircut providers where needed for a booking or enquiry.</li>
          </ul>

          <p style={paragraphStyle}>
            Where a service provider acts as a processor for Trimmute, we use
            data-processing terms or other contractual protections where
            required by law.
          </p>

          <h3>Current third-party services</h3>

          <ul style={listStyle}>
            <li>
              <strong>Vercel</strong> — frontend hosting and Web Analytics. For
              relevant customer personal data on Trimmute’s Pro plan, Vercel
              may act as a processor. Vercel separately acts as a controller
              for certain account/contact and service-generated data.
            </li>
            <li>
              <strong>Render</strong> — backend/API hosting and associated
              server/request logs. Render acts as a processor for relevant
              personal data processed through the Trimmute backend.
            </li>
            <li>
              <strong>Supabase</strong> — database and storage services.
              Supabase acts as a processor for relevant Trimmute data.
              Trimmute’s primary production database is currently hosted in
              West EU (Ireland), eu-west-1.
            </li>
            <li>
              <strong>Clerk</strong> — sign-in and authentication. Clerk
              generally acts as a processor for end-user authentication data
              processed on Trimmute’s behalf and separately as a controller for
              certain Clerk account information.
            </li>
            <li>
              <strong>postcodes.io</strong> — an external postcode/geocoding
              service. In the current implementation, a postcode entered by a
              user is sent directly from the user’s browser to postcodes.io.
              We do not currently treat postcodes.io as a core database
              processor for Trimmute.
            </li>
            <li>
              <strong>CARTO</strong> — an external map-tile service. In the
              current implementation, map tiles are loaded directly by the
              user’s browser. We do not currently upload Trimmute’s account or
              booking database to CARTO.
            </li>
            <li>
              <strong>External booking platforms</strong> — if you follow a
              provider’s external booking link, you leave Trimmute and the
              third party’s own privacy policy and terms apply.
            </li>
          </ul>

          <p style={paragraphStyle}>
            Where a booking is made through Trimmute or relevant details are
            passed to a haircut provider, the information reasonably necessary
            to manage or fulfil the booking may be shared with that provider.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>5. International transfers</h2>

          <p style={paragraphStyle}>
            Some of our service providers may process, access, or store
            personal information outside the UK. A transfer outside the UK is
            not automatically unlawful; where UK data protection rules treat a
            transfer as a restricted transfer, we use or rely on an appropriate
            transfer mechanism where required.
          </p>

          <p style={paragraphStyle}>
            Depending on the provider and transfer, safeguards may include:
          </p>

          <ul style={listStyle}>
            <li>UK adequacy regulations;</li>
            <li>
              the UK Extension to the EU-U.S. Data Privacy Framework, where the
              recipient is appropriately certified and the mechanism applies;
            </li>
            <li>the UK Addendum to the EU Standard Contractual Clauses;</li>
            <li>the UK International Data Transfer Agreement, where appropriate;</li>
            <li>
              other safeguards or exceptions permitted by UK data protection
              law.
            </li>
          </ul>

          <p style={paragraphStyle}>
            For example, Trimmute’s primary Supabase database is currently
            hosted in Ireland. Other providers may use infrastructure, support
            teams or subprocessors outside the UK. We maintain a Data
            Processors & Transfers register and retain relevant provider
            data-processing and legal documentation as part of our compliance
            records.
          </p>

          <p style={paragraphStyle}>
            Where an appropriate transfer safeguard requires a transfer risk
            assessment or equivalent data protection test, this is considered
            as part of our provider and transfer review.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>6. How long we keep information</h2>

          <p style={paragraphStyle}>
            We only keep personal information for as long as reasonably needed
            for the purpose for which it was collected, or to meet legal,
            security, accounting, dispute or regulatory requirements.
          </p>

          <ul style={listStyle}>
            <li>
              <strong>Location data:</strong> used temporarily to calculate
              nearby results and not intentionally stored in our database as
              part of a user profile.
            </li>
            <li>
              <strong>Postcode searches:</strong> used to generate nearby
              results and not intentionally stored as a user profile by
              Trimmute.
            </li>
            <li>
              <strong>Saved roster/favourites:</strong> stored in your browser
              until you remove favourites or clear the relevant browser data.
            </li>
            <li>
              <strong>Booking tokens:</strong> stored in your browser until you
              clear the relevant browser data, remove them through available
              functionality, or they otherwise cease to be required.
            </li>
            <li>
              <strong>Booking records:</strong> kept for as long as reasonably
              needed to manage bookings, resolve issues, maintain business
              records and protect legal rights. We currently expect to review
              booking records after up to 24 months, unless a longer period is
              justified or required.
            </li>
            <li>
              <strong>Partner/business records:</strong> kept while the
              business is listed and for a reasonable period afterwards for
              record-keeping, permissions, disputes and compliance.
            </li>
            <li>
              <strong>Messages and emails:</strong> kept for as long as needed
              to respond and maintain appropriate business records.
            </li>
            <li>
              <strong>Analytics and technical logs:</strong> kept according to
              the purpose of the logs and the settings/retention periods of the
              relevant service provider, subject to Trimmute’s own legal and
              security requirements.
            </li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>7. Cookies, analytics and localStorage</h2>

          <p style={paragraphStyle}>
            Trimmute uses or may use cookies, localStorage and similar
            storage/access technologies to provide website functionality.
          </p>

          <p style={paragraphStyle}>These technologies may be used to:</p>

          <ul style={listStyle}>
            <li>provide sign-in and security functionality;</li>
            <li>remember saved favourites;</li>
            <li>remember booking tokens where booking features are used;</li>
            <li>support website functionality and reliability;</li>
            <li>display maps and shop locations.</li>
          </ul>

          <p style={paragraphStyle}>
            Vercel Web Analytics is currently used to understand general site
            usage. Vercel states that its Web Analytics product does not use
            cookies and stores anonymised analytics data.
          </p>

          <p style={paragraphStyle}>
            Your browser may allow you to block or delete cookies and
            localStorage. Some features may not work properly if you do this.
          </p>

          <p style={paragraphStyle}>
            Trimmute does not currently use advertising pixels such as Meta
            Pixel or TikTok Pixel, and our current audit has not identified
            Google Analytics or Hotjar. If our use of storage/access
            technologies changes, we will update our notices and obtain
            consent where required.
          </p>

          <p style={paragraphStyle}>
            For more detail, please see our separate{" "}
            <a href="/cookies" style={{ color: "#5eead4" }}>
              Cookie & Storage Notice
            </a>
            .
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>8. Security</h2>

          <p style={paragraphStyle}>
            We take reasonable technical and organisational steps designed to
            protect personal information from unauthorised access, loss,
            misuse, alteration or disclosure. These measures include controls
            over administrative access and use of reputable hosting, database
            and authentication providers.
          </p>

          <p style={paragraphStyle}>
            However, no website, database or online service can be guaranteed
            to be completely secure. You should avoid submitting sensitive
            personal information through Trimmute unless clearly necessary and
            specifically requested.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>9. Terms of Use and liability</h2>

          <p style={paragraphStyle}>
            Your use of Trimmute is also subject to our{" "}
            <a href="/terms" style={{ color: "#5eead4" }}>
              Terms of Use
            </a>
            , including provisions dealing with availability of the service,
            third-party providers and external booking services, and
            limitations of liability.
          </p>

          <p style={paragraphStyle}>
            Nothing in the Terms of Use or this Privacy Policy limits or
            overrides any rights you have under applicable data protection
            law, or any liability that cannot lawfully be limited or excluded.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>10. Your rights</h2>

          <p style={paragraphStyle}>
            Depending on the circumstances, you may have rights under data
            protection law, including the right to:
          </p>

          <ul style={listStyle}>
            <li>ask for a copy of your personal information;</li>
            <li>ask us to correct inaccurate or incomplete information;</li>
            <li>ask us to delete information in certain circumstances;</li>
            <li>object to certain uses of your information;</li>
            <li>restrict how we use your information in certain circumstances;</li>
            <li>
              ask for information to be transferred to you or another provider
              where the right to data portability applies;
            </li>
            <li>
              withdraw consent at any time where we rely on consent, without
              affecting the lawfulness of processing before withdrawal;
            </li>
            <li>
              make a data protection complaint to Trimmute and complain to the
              Information Commissioner’s Office.
            </li>
          </ul>

          <p style={paragraphStyle}>
            <strong>To exercise your rights, contact us at:</strong>{" "}
            trimmute@gmail.com
          </p>

          <p style={paragraphStyle}>
            We may need to verify your identity before responding to certain
            requests. We will respond within the time limits required by
            applicable data protection law.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>11. Data protection complaints</h2>

          <p style={paragraphStyle}>
            If you have a concern about how Trimmute has used or handled your
            personal information, you can make a data protection complaint by
            contacting us at trimmute@gmail.com.
          </p>

          <p style={paragraphStyle}>
            When we receive a data protection complaint, we will:
          </p>

          <ul style={listStyle}>
            <li>acknowledge receipt within 30 days;</li>
            <li>
              without undue delay, take appropriate steps to investigate and
              respond to the complaint;
            </li>
            <li>
              make appropriate enquiries and keep you informed where necessary;
            </li>
            <li>
              without undue delay, tell you the outcome of the complaint.
            </li>
          </ul>

          <p style={paragraphStyle}>
            If you remain unhappy with the way we have handled your complaint,
            you also have the right to complain to the Information
            Commissioner’s Office (ICO), the UK data protection regulator.
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
          <h2 style={headingStyle}>12. Children</h2>

          <p style={paragraphStyle}>
            Trimmute is not specifically directed at children. We do not
            currently design our account, booking or data-collection features
            specifically for children.
          </p>

          <p style={paragraphStyle}>
            If we become aware that we are processing a child’s personal
            information in circumstances requiring additional protections, we
            will assess the processing and take appropriate steps under
            applicable data protection law. If you believe a child has
            provided personal information to us inappropriately, please contact
            us.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>13. Changes to this Privacy Policy</h2>

          <p style={paragraphStyle}>
            We may update this Privacy Policy from time to time, including when
            our services, providers, data flows or legal obligations change.
          </p>

          <p style={paragraphStyle}>
            If we make significant changes, we will update the date at the top
            of this policy and, where appropriate, provide a clearer notice on
            the website or through the relevant service.
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
            Lytchett House, 13 Freeland Park, Wareham Road, Poole, Dorset, BH16
            6FA
          </p>
        </div>
      </div>
    </main>
  );
}