import { useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import CategoryBar from "../components/CategoryBar";

function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("section-1");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const menuItems = [
    "1. Introduction",
    "2. Information We Collect",
    "3. How We Use Your Information",
    "4. Data Sharing & Disclosure",
    "5. Data Storage & Security",
    "6. Cookies & Tracking Technologies",
    "7. User Rights & Choices",
    "8. Third-Party Services",
    "9. Children’s Privacy",
    "10. Changes to This Policy",
    "11. Contact Information",
    "12. Governing Law & Jurisdiction",
  ];

  return (
    <MainLayout>
      <CategoryBar />
      <div className="w-full flex flex-col gap-y-1 bg-[#F2FEF0] min-h-[250px] md:h-[350px] py-10 items-center justify-center">
        <span className="text-2xl md:text-[40px] font-bold text-primary-300">
          Privacy Policy
        </span>
        <p className="text-[#555555] text-center text-[15px] md:text-[16px] font-medium px-6">
          Please read this Privacy Policy carefully before using NEDZL services
          or <br className="hidden md:block" /> accessing the platform.
        </p>
        <span className="text-[#117D06] text-[15px] md:text-[16px] font-medium">
          Updated: July 18, 2024
        </span>
      </div>
      <div className="w-full max-w-[1400px] mx-auto p-6 md:px-20 md:py-16 flex flex-col md:flex-row items-start justify-between gap-x-12 relative">
        {/* Sticky Sidebar */}
        <div className="w-full md:w-[35%] lg:w-[30%] md:sticky md:top-24 mb-10 md:mb-0">
          <div className="bg-white border border-[#E9E9E9] rounded-[16px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <span className="font-inter text-[18px] font-bold text-[#333333] mb-2 block">
              Content
            </span>
            <div className="flex flex-col gap-y-0.5 font-open-sans">
              {menuItems.map((item, index) => {
                const sectionId = `section-${index + 1}`;
                return (
                  <a
                    key={index}
                    href={`#${sectionId}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(sectionId)?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    className={`px-4 py-2.5 rounded-[12px] text-[15px] font-medium transition-all duration-200 ${
                      activeSection === sectionId
                        ? "bg-[#F2FEF0] text-[#117D06]"
                        : "text-[#555555] hover:bg-gray-50 hover:text-black"
                    }`}
                  >
                    {item}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Policy Content */}
        <div className="w-full md:w-[65%] lg:w-[70%] flex flex-col gap-y-7 font-open-sans text-[#333333] pt-4">
          {/* Section 1 */}
          <section
            id="section-1"
            className="flex flex-col gap-y-4 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">
              1. Introduction
            </h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              NEDZL (“we”, “our”, “us”) respects your privacy and is committed
              to protecting your personal information. This Privacy Policy
              explains how we collect, use, store, and safeguard your
              information when you use our website, mobile app, or services.
            </p>
          </section>

          {/* Section 2 */}
          <section
            id="section-2"
            className="flex flex-col gap-y-4 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">
              2. Information We Collect
            </h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              We may collect the following categories of information:
            </p>
            <ul className="flex flex-col gap-y-1 list-none">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                <span className="text-[#27D019] font-medium">
                  Personal Information:
                </span>{" "}
                Full name, phone number, email address, and delivery address.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                <span className="text-[#27D019] font-medium">
                  Account Information:
                </span>{" "}
                Login credentials, preferences, and transaction history.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                <span className="text-[#27D019] font-medium">
                  Payment Details:
                </span>{" "}
                Payment method and transaction data (note: we do not store card
                details directly).
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                <span className="text-[#27D019] font-medium">
                  Device & Usage Data:
                </span>{" "}
                IP address, browser type, device identifiers, and activity logs.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                <span className="text-[#27D019] font-medium">
                  Cookies & Tracking Data:
                </span>{" "}
                Information collected via cookies, beacons, and similar
                technologies.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section
            id="section-3"
            className="flex flex-col gap-y-3 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">
              3. How We Use Your Information
            </h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              We use your data to:
            </p>
            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Process and fulfill orders.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Improve customer experience and platform functionality.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Communicate updates, offers, and support.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Detect, prevent, and address fraud or security issues.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Comply with legal obligations.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section
            id="section-4"
            className="flex flex-col gap-y-3 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">
              4. Data Sharing & Disclosure
            </h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              We may share your information with:
            </p>
            <ul className="flex flex-col gap-y-1 list-none">
              <li className="text-[16px] leading-[1.7] text-[#555555] flex items-start gap-x-2">
                <span className="text-[#27D019] font-medium min-w-max">
                  • Service Providers:
                </span>
                <span className="text-[#555555]">
                  Delivery partners, payment processors, and analytics
                  providers.
                </span>
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555] flex items-start gap-x-2">
                <span className="text-[#27D019] font-medium min-w-max">
                  • Business Partners:
                </span>
                <span className="text-[#555555]">
                  Vendors or sellers you transact with on NEDZL.
                </span>
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555] flex items-start gap-x-2">
                <span className="text-[#27D019] font-medium min-w-max">
                  • Legal Authorities:
                </span>
                <span className="text-[#555555]">
                  When required by law or to protect our rights.
                </span>
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section
            id="section-5"
            className="flex flex-col gap-y-5 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">
              5. Data Storage & Security
            </h2>
            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                We apply encryption, secure servers, and restricted access to
                protect your information.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Despite these measures, no method of online storage is 100%
                secure.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section
            id="section-6"
            className="flex flex-col gap-y-3 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">
              6. Cookies & Tracking Technologies
            </h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              NEDZL uses cookies and similar technologies to:
            </p>
            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Remember your preferences
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Analyze usage trends.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Deliver personalized ads and recommendations.
              </li>
            </ul>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              You can disable cookies in your browser settings, though this may
              affect platform functionality.
            </p>
          </section>

          {/* Section 7 */}
          <section
            id="section-7"
            className="flex flex-col gap-y-3 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">
              7. User Rights & Choices
            </h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              As a NEDZL user, you have the right to:
            </p>
            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Access, update, or delete your personal data.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Opt out of marketing communications.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Request clarification on how your data is handled.
              </li>
            </ul>
          </section>

          {/* Section 8 */}
          <section
            id="section-8"
            className="flex flex-col gap-y-3 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">
              8. Third-Party Services
            </h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              Our platform may contain links to external websites. NEDZL is not
              responsible for the privacy practices or content of third-party
              services.
            </p>
          </section>

          {/* Section 9 */}
          <section
            id="section-9"
            className="flex flex-col gap-y-3 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">
              9. Children’s Privacy
            </h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              NEDZL services are not directed to individuals under 18. We do not
              knowingly collect data from children.
            </p>
          </section>

          {/* Section 10 */}
          <section
            id="section-10"
            className="flex flex-col gap-y-3 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">
              10. Changes to This Policy
            </h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with a revised update date.
            </p>
          </section>

          {/* Section 11 */}
          <section
            id="section-11"
            className="flex flex-col gap-y-3 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">
              11. Contact Information
            </h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              If you have questions about this Privacy Policy, you can contact
              us at:
            </p>
            <div className="flex flex-col gap-y-2">
              <p className="text-[16px] leading-[1.7] text-[#555555]">
                Email:{" "}
                <a
                  href="mailto:support@nedzl.com"
                  className="text-[#27D019] hover:underline"
                >
                  support@nedzl.com
                </a>
              </p>
              <p className="text-[16px] leading-[1.7] text-[#555555]">
                Phone Number: +1 123-456-7890
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section
            id="section-12"
            className="flex flex-col gap-y-3 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">
              12. Governing Law & Jurisdiction
            </h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              This Privacy Policy shall be governed by and construed in
              accordance with the laws of the jurisdiction in which NEDZL
              operates. Any disputes arising under this policy shall be subject
              to the exclusive jurisdiction of the competent courts in that
              region.
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

export default PrivacyPolicy;
