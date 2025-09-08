import React from "react";
import "./TermsofServices.css"; // Import page-specific styles

function TermsOfServices() {
  return (
    <div className="terms-of-service-page-container">
      <section className="terms-of-service-section">
        <h1 className="section-title">Terms of Service</h1>
        <p className="last-updated">Last Updated: August 10, 2025</p>

        <p>
          Welcome to EduSphere! These Terms of Service ("Terms") govern your
          access to and use of EduSphere's website (
          <a href="https://www.edusphere.com" className="policy-link">
            www.edusphere.com
          </a>
          ), including any content, functionality, and services offered on or
          through the website.
        </p>
        <p>
          Please read the Terms carefully before you start to use the Website.
          By using the Website or by clicking to accept or agree to the Terms of
          Service when this option is made available to you, you accept and
          agree to be bound and abide by these Terms of Service and our Privacy
          Policy, found at{" "}
          <a
            href="#"
            className="policy-link"
            onClick={() => {
              /* navigate to privacy policy */
            }}
          >
            www.edusphere.com/privacy-policy
          </a>
          , incorporated herein by reference.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Service, you confirm your agreement to be
          bound by these Terms and all terms incorporated by reference. If you
          do not agree to all of these Terms, you may not access or use the
          Service.
        </p>

        <h2>2. Changes to Terms</h2>
        <p>
          We may modify these Terms at any time. We will notify you of any
          changes by posting the new Terms on this page. We will update the
          "Last Updated" date at the top of these Terms. Your continued use of
          the Service after such modifications will constitute your
          acknowledgment of the modified Terms and agreement to abide and be
          bound by the modified Terms.
        </p>

        <h2>3. Access and Use of Service</h2>
        <h3>a. Eligibility</h3>
        <p>
          You must be at least 13 years old to use the Service. By agreeing to
          these Terms, you represent and warrant that you are at least 13 years
          old and are legally capable of entering into a binding contract.
        </p>
        <h3>b. User Accounts</h3>
        <p>
          To access certain features of the Service, you may be required to
          create an account. You agree to provide accurate, current, and
          complete information during the registration process and to update
          such information to keep it accurate, current, and complete. You are
          responsible for safeguarding your password and for any activities or
          actions under your account.
        </p>
        <h3>c. Prohibited Uses</h3>
        <p>
          You may use the Service only for lawful purposes and in accordance
          with these Terms. You agree not to use the Service:
        </p>
        <ul>
          <li>
            In any way that violates any applicable federal, state, local, or
            international law or regulation.
          </li>
          <li>
            For the purpose of exploiting, harming, or attempting to exploit or
            harm minors in any way.
          </li>
          <li>
            To transmit, or procure the sending of, any advertising or
            promotional material without our prior written consent.
          </li>
          <li>
            To impersonate or attempt to impersonate EduSphere, an EduSphere
            employee, another user, or any other person or entity.
          </li>
        </ul>

        <h2>4. Intellectual Property Rights</h2>
        <p>
          The Service and its entire contents, features, and functionality
          (including but not limited to all information, software, text,
          displays, images, video, and audio, and the design, selection, and
          arrangement thereof) are owned by EduSphere, its licensors, or other
          providers of such material and are protected by international
          copyright, trademark, patent, trade secret, and other intellectual
          property or proprietary rights laws.
        </p>
        <p>
          These Terms permit you to use the Service for your personal,
          non-commercial use only. You must not reproduce, distribute, modify,
          create derivative works of, publicly display, publicly perform,
          republish, download, store, or transmit any of the material on our
          Service, except as generally permitted by the Service.
        </p>

        <h2>5. Disclaimers and Limitation of Liability</h2>
        <p>
          The Service is provided on an "AS IS" and "AS AVAILABLE" basis.
          EduSphere makes no warranties, expressed or implied, and hereby
          disclaims all other warranties including, without limitation, implied
          warranties of merchantability, fitness for a particular purpose, or
          non-infringement.
        </p>
        <p>
          In no event shall EduSphere, nor its directors, employees, partners,
          agents, suppliers, or affiliates, be liable for any indirect,
          incidental, special, consequential or punitive damages, including
          without limitation, loss of profits, data, use, goodwill, or other
          intangible losses, resulting from (i) your access to or use of or
          inability to access or use the Service; (ii) any conduct or content of
          any third party on the Service; (iii) any content obtained from the
          Service; and (iv) unauthorized access, use or alteration of your
          transmissions or content, whether based on warranty, contract, tort
          (including negligence) or any other legal theory, whether or not we
          have been informed of the possibility of such damage, and even if a
          remedy set forth herein is found to have failed of its essential
          purpose.
        </p>

        <h2>6. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the
          laws of [Your Country/State], without regard to its conflict of law
          provisions.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          If you have any questions about these Terms of Service, please contact
          us:
        </p>
        <ul>
          <li>
            By email:{" "}
            <a href="mailto:terms@edusphere.com" className="policy-link">
              terms@edusphere.com
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

export default TermsOfServices;
