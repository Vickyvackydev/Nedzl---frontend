import { useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import CategoryBar from "../components/CategoryBar";

function TermsOfService() {
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
    "2. Eligibility",
    "3. User Accounts",
    "4. Buying and Selling",
    "5. Prohibited Items",
    "6. Payments",
    "7. User Responsibilities",
    "8. Content and Intellectual Property",
    "9. Account Suspension & Termination",
    "10. Liability Disclaimer",
    "11. Changes to Terms",
    "12. Contact Us",
  ];

  return (
    <MainLayout>
      <CategoryBar />
      <div className="w-full flex flex-col gap-y-1 bg-[#F2FEF0] min-h-[250px] md:h-[350px] py-10 items-center justify-center">
        <span className="text-2xl md:text-[40px] font-bold text-primary-300">
          Terms of Service
        </span>
        <p className="text-[#555555] text-center text-[15px] md:text-[16px] font-medium px-6">
          Please read this Terms of Service carefully before using NEDZL
          services or <br className="hidden md:block" /> accessing the platform.
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
              Welcome to NEDZL (“we”, “our”, “us”). By accessing or using our
              website, mobile app, or services, you agree to be bound by these
              Terms of Service. If you do not agree, please do not use NEDZL.
            </p>
          </section>

          <section
            id="section-2"
            className="flex flex-col gap-y-3 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">2. Eligibility</h2>

            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                You must be at least 18 years old to use NEDZL.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                By creating an account, you confirm that the information you
                provide is accurate and truthful.
              </li>
            </ul>
          </section>
          <section
            id="section-3"
            className="flex flex-col gap-y-3 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">
              3. User Accounts
            </h2>

            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                You are responsible for keeping your account login details
                secure.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                NEDZL is not liable for losses or damages caused by unauthorized
                access to your account.
              </li>
            </ul>
          </section>
          <section
            id="section-4"
            className="flex flex-col gap-y-3 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">
              4. Buying and Selling
            </h2>

            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                NEDZL provides a platform for users to list, buy, and sell used
                items.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Sellers are responsible for the accuracy of their listings
                (e.g., condition, price, images).
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Buyers must review listings carefully before purchase.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                NEDZL is not a party to transactions between buyers and sellers;
                we only facilitate connections
              </li>
            </ul>
          </section>

          <section
            id="section-5"
            className="flex flex-col gap-y-3 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">
              5. Prohibited Items
            </h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              Users may not list, buy, or sell:
            </p>
            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Illegal goods or counterfeit items.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Hazardous materials.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Any products restricted under Nigerian law.
              </li>
            </ul>
          </section>

          <section
            id="section-6"
            className="flex flex-col gap-y-5 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">6. Payments</h2>
            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Payments between buyers and sellers may be facilitated through
                NEDZL’s secure payment options.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                NEDZL does not store card details directly.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Sellers are responsible for ensuring they comply with applicable
                tax obligations.
              </li>
            </ul>
          </section>
          <section
            id="section-7"
            className="flex flex-col gap-y-5 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">
              7. User Responsibilities
            </h2>
            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Do not misuse the platform (fraud, spam, misleading listings, or
                illegal activity).
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Respect other users. Abusive or harmful behavior will result in
                account suspension.
              </li>
            </ul>
          </section>
          <section
            id="section-8"
            className="flex flex-col gap-y-5 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">
              8. Content and Intellectual Property
            </h2>
            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Do not misuse the platform (fraud, spam, misleading listings, or
                illegal activity).
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Respect other users. Abusive or harmful behavior will result in
                account suspension.
              </li>
            </ul>
          </section>

          <section
            id="section-9"
            className="flex flex-col gap-y-3 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">
              9. Account Suspension & Termination
            </h2>

            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                We may suspend or terminate your account if you violate these
                terms.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                You may deactivate your account at any time, but some
                transaction records may remain for compliance.
              </li>
            </ul>
          </section>

          <section
            id="section-10"
            className="flex flex-col gap-y-3 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">
              10. Liability Disclaimer
            </h2>

            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                NEDZL does not guarantee the quality, safety, or legality of
                listed items.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                We are not liable for disputes between buyers and sellers,
                though we may assist with resolution.
              </li>
            </ul>
          </section>
          <section
            id="section-11"
            className="flex flex-col gap-y-3 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">
              11. Changes to Terms
            </h2>

            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                We may update these Terms from time to time.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Continued use of NEDZL after updates means you accept the
                revised terms.
              </li>
            </ul>
          </section>

          <section
            id="section-12"
            className="flex flex-col gap-y-3 scroll-mt-28"
          >
            <h2 className="text-lg font-bold text-[#333333]">12. Contact Us</h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              If you have any questions about this Privacy Policy or how your
              data is handled, please contact us:
            </p>
            <div className="flex flex-col gap-y-2">
              <p className="text-[16px] leading-[1.7] text-[#555555]">
                Email:{" "}
                <a
                  href="mailto:support@nedzl.com"
                  className="text-primary-300 hover:underline"
                >
                  Nedzlworld@gmail.com
                </a>
              </p>
              <p className="text-[16px] leading-[1.7] text-[#555555]">
                Phone Number: +234 704 924 0913
              </p>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

export default TermsOfService;
