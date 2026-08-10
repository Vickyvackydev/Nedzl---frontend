import { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import CategoryBar from '../components/CategoryBar';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

function TermsOfService() {
  const [activeSection, setActiveSection] = useState('section-1');

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
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
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const menuItems = [
    '1. Introduction',
    '2. Eligibility',
    '3. User Accounts',
    '4. Buying & Selling (Marketplace)',
    '5. Food Ordering Services & Vendors',
    '6. Artisan Services & Bookings',
    '7. Shipping & Return Policies Disclaimer',
    '8. Prohibited Items',
    '9. Payments & Processing',
    '10. User Responsibilities',
    '11. Content & Intellectual Property',
    '12. Account Suspension & Termination',
    '13. Liability Disclaimer',
    '14. Changes to Terms',
    '15. Contact Us',
  ];

  return (
    <MainLayout>
      <SEO
        title="Terms of Service"
        description="Read the terms governing use of Nedzl.com marketplace, food ordering, and artisan services."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Terms of Service',
          url: window.location.href,
        }}
      />
      <CategoryBar />
      <div className="w-full flex flex-col gap-y-1 bg-[#F2FEF0] min-h-[250px] md:h-[350px] py-10 items-center justify-center">
        <span className="text-2xl md:text-[40px] font-bold text-primary-300">Terms of Service</span>
        <p className="text-[#555555] text-center text-[15px] md:text-[16px] font-medium px-6">
          Please read these Terms of Service carefully before using NEDZL services or accessing the platform.
        </p>
        <span className="text-[#117D06] text-[15px] md:text-[16px] font-medium">Updated: August 10, 2026</span>
      </div>
      <div className="w-full max-w-[1400px] mx-auto p-6 md:px-20 md:py-16 flex flex-col md:flex-row items-start justify-between gap-x-12 relative">
        {/* Sticky Sidebar */}
        <div className="w-full md:w-[35%] lg:w-[30%] md:sticky md:top-24 mb-10 md:mb-0">
          <div className="bg-white border border-[#E9E9E9] rounded-[16px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <span className="font-inter text-[18px] font-bold text-[#333333] mb-2 block">Content</span>
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
                        behavior: 'smooth',
                        block: 'start',
                      });
                    }}
                    className={`px-4 py-2.5 rounded-[12px] text-[15px] font-medium transition-all duration-200 ${
                      activeSection === sectionId
                        ? 'bg-[#F2FEF0] text-[#117D06]'
                        : 'text-[#555555] hover:bg-gray-50 hover:text-black'
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
          <section id="section-1" className="flex flex-col gap-y-4 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">1. Introduction</h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              Welcome to NEDZL (“we”, “our”, “us”). By accessing or using our website, mobile application, marketplace, food ordering system, or artisan booking services, you agree to be bound by these Terms of Service. If you do not agree, please do not use NEDZL.
            </p>
          </section>

          <section id="section-2" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">2. Eligibility</h2>
            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                You must be at least 18 years old (or the legal age of majority in your jurisdiction) to use NEDZL.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                By creating an account, you confirm that all information provided is accurate and complete.
              </li>
            </ul>
          </section>

          <section id="section-3" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">3. User Accounts</h2>
            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                You are responsible for keeping your account login credentials secure.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                NEDZL is not liable for losses or damages caused by unauthorized access to your account.
              </li>
            </ul>
          </section>

          <section id="section-4" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">4. Buying & Selling (Marketplace)</h2>
            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                NEDZL provides a digital marketplace connecting buyers and sellers of items.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Sellers are solely responsible for the accuracy of their listings, item condition, pricing, and images.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                NEDZL is not a direct party to marketplace sales transactions; we facilitate user connections and digital interactions.
              </li>
            </ul>
          </section>

          <section id="section-5" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">5. Food Ordering Services & Vendors</h2>
            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                <strong>Payment Facilitation:</strong> NEDZL provides digital checkout and payment processing features for easy ordering of food items and sub-menus/extras.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                <strong>Vendor Fulfillment:</strong> Once an order is placed, the food vendor is solely responsible for meal preparation, quality, packaging, and dispatch/delivery to the customer.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                NEDZL is not a restaurant, kitchen, or courier company, and bears no responsibility for food preparation delays or health standard compliance of independent vendors.
              </li>
            </ul>
          </section>

          <section id="section-6" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">6. Artisan Services & Bookings</h2>
            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                NEDZL enables users to search for and book skilled artisans and service providers (e.g., repairs, home services, technical labor).
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Artisans act as independent contractors. NEDZL facilitates appointment scheduling and initial payment escrow/processing.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Customers and artisans must treat each other with mutual respect and ensure safe environments for on-site services.
              </li>
            </ul>
          </section>

          <section id="section-7" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">7. Shipping & Return Policies Disclaimer</h2>
            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                <strong>No Item Shipping by NEDZL:</strong> NEDZL does not handle logistics, warehousing, or physical shipment of marketplace items. All logistics are arranged directly between buyers and sellers. See our full <Link to="/shipping-policy" className="text-primary-300 hover:underline font-semibold">Shipping Policy</Link>.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                <strong>No Returns to NEDZL:</strong> NEDZL does not accept returned goods because NEDZL does not sell or deliver marketplace products to customers directly. See our full <Link to="/refund-policy" className="text-primary-300 hover:underline font-semibold">Returns & Refund Policy</Link>.
              </li>
            </ul>
          </section>

          <section id="section-8" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">8. Prohibited Items</h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">Users may not list, order, or offer:</p>
            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">Illegal goods, weapons, or counterfeit items.</li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">Hazardous materials or prohibited substances.</li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">Services or products restricted under Federal Republic of Nigeria law.</li>
            </ul>
          </section>

          <section id="section-9" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">9. Payments & Processing</h2>
            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Payments for food orders, artisan bookings, and platform features are processed securely through payment gateways (e.g. Paystack).
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">NEDZL does not store raw credit/debit card numbers.</li>
            </ul>
          </section>

          <section id="section-10" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">10. User Responsibilities</h2>
            <ul className="flex flex-col gap-y-1 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Do not misuse the platform (fraud, spam, misleading listings, or unlawful activity).
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Respect all platform users, vendors, and service professionals.
              </li>
            </ul>
          </section>

          <section id="section-11" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">11. Content & Intellectual Property</h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              All platform designs, graphics, branding, and original content on NEDZL belong to NEDZL. User-submitted content (product photos, food menus) remains the property of the respective creator.
            </p>
          </section>

          <section id="section-12" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">12. Account Suspension & Termination</h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              We reserve the right to suspend or terminate accounts that breach these Terms of Service or engage in fraudulent activities.
            </p>
          </section>

          <section id="section-13" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">13. Liability Disclaimer</h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              NEDZL provides a platform connecting users. We do not guarantee item condition, vendor dispatch speed, or third-party service performance.
            </p>
          </section>

          <section id="section-14" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">14. Changes to Terms</h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              We may update these Terms from time to time. Continued use of NEDZL after updates indicates acceptance of the revised Terms.
            </p>
          </section>

          <section id="section-15" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">15. Contact Us</h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="flex flex-col gap-y-2">
              <p className="text-[16px] leading-[1.7] text-[#555555]">
                Email:{' '}
                <a href="mailto:Nedzlworld@gmail.com" className="text-primary-300 hover:underline">
                  Nedzlworld@gmail.com
                </a>
              </p>
              <p className="text-[16px] leading-[1.7] text-[#555555]">Phone Number: +234 704 924 0913</p>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

export default TermsOfService;
