import React from "react";
import "./PrivacyPolicy.css"; // Import page-specific styles

function PrivacyPolicy() {
  return (
    <div className="privacy-policy-page-container">
      <section className="privacy-policy-section">
        <h1 className="section-title">Privacy Policy</h1>
        <p className="last-updated">Last Updated: August 10, 2025</p>

        <p>
          Welcome to EduSphere! We are committed to protecting your privacy and
          providing you with a safe and secure online learning environment. This
          Privacy Policy explains how we collect, use, disclose, and safeguard
          your information when you visit our website{" "}
          <a href="https://www.edusphere.com" className="policy-link">
            (www.edusphere.com)
          </a>{" "}
          and use our services.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect various types of information for different purposes to
          provide and improve our services to you.
        </p>
        <h3>a. Personal Data</h3>
        <p>
          While using our Service, we may ask you to provide us with certain
          personally identifiable information that can be used to contact or
          identify you ("Personal Data"). Personally identifiable information
          may include, but is not limited to:
        </p>
        <ul>
          <li>Email address</li>
          <li>First name and last name</li>
          <li>Phone number</li>
          <li>Address, State, Province, ZIP/Postal code, City</li>
          <li>Cookies and Usage Data</li>
        </ul>

        <h3>b. Usage Data</h3>
        <p>
          We may also collect information that your browser sends whenever you
          visit our Service or when you access the Service by or through a
          mobile device ("Usage Data"). This Usage Data may include information
          such as your computer's Internet Protocol address (e.g., IP address),
          browser type, browser version, the pages of our Service that you
          visit, the time and date of your visit, the time spent on those pages,
          unique device identifiers and other diagnostic data.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>EduSphere uses the collected data for various purposes:</p>
        <ul>
          <li>To provide and maintain our Service</li>
          <li>To notify you about changes to our Service</li>
          <li>
            To allow you to participate in interactive features of our Service
            when you choose to do so
          </li>
          <li>To provide customer support</li>
          <li>
            To gather analysis or valuable information so that we can improve
            our Service
          </li>
          <li>To monitor the usage of our Service</li>
          <li>To detect, prevent and address technical issues</li>
          <li>
            To provide you with news, special offers and general information
            about other goods, services and events which we offer that are
            similar to those that you have already purchased or enquired about
            unless you have opted not to receive such information
          </li>
        </ul>

        <h2>3. Data Sharing and Disclosure</h2>
        <p>
          We may share your information with third parties in the following
          situations:
        </p>
        <ul>
          <li>
            <strong>Service Providers:</strong> We may employ third-party
            companies and individuals to facilitate our Service, to provide the
            Service on our behalf, to perform Service-related services or to
            assist us in analyzing how our Service is used.
          </li>
          <li>
            <strong>Legal Requirements:</strong> EduSphere may disclose your
            Personal Data in the good faith belief that such action is necessary
            to:
            <ul>
              <li>To comply with a legal obligation</li>
              <li>To protect and defend the rights or property of EduSphere</li>
              <li>
                To prevent or investigate possible wrongdoing in connection with
                the Service
              </li>
              <li>
                To protect the personal safety of users of the Service or the
                public
              </li>
              <li>To protect against legal liability</li>
            </ul>
          </li>
          <li>
            <strong>Business Transfers:</strong> If EduSphere is involved in a
            merger, acquisition or asset sale, your Personal Data may be
            transferred. We will provide notice before your Personal Data is
            transferred and becomes subject to a different Privacy Policy.
          </li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          The security of your data is important to us, but remember that no
          method of transmission over the Internet, or method of electronic
          storage is 100% secure. While we strive to use commercially acceptable
          means to protect your Personal Data, we cannot guarantee its absolute
          security.
        </p>

        <h2>5. Your Choices and Rights</h2>
        <p>
          You have certain data protection rights. EduSphere aims to take
          reasonable steps to allow you to correct, amend, delete, or limit the
          use of your Personal Data.
        </p>
        <ul>
          <li>
            <strong>Access and Update:</strong> You can update your account
            information at any time.
          </li>
          <li>
            <strong>Opt-Out:</strong> You can opt-out of receiving marketing
            communications from us by following the unsubscribe link or
            instructions provided in any email we send.
          </li>
        </ul>

        <h2>6. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page. We will
          let you know via email and/or a prominent notice on our Service, prior
          to the change becoming effective and update the "last updated" date at
          the top of this Privacy Policy.
        </p>
        <p>
          You are advised to review this Privacy Policy periodically for any
          changes. Changes to this Privacy Policy are effective when they are
          posted on this page.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact
          us:
        </p>
        <ul>
          <li>
            By email:{" "}
            <a href="mailto:privacy@edusphere.com" className="policy-link">
              privacy@edusphere.com
            </a>
          </li>
          <li>
            By visiting this page on our website:{" "}
            <a href="https://www.edusphere.com/contact" className="policy-link">
              www.edusphere.com/contact
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default PrivacyPolicy;
