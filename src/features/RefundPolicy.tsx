import { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import CategoryBar from '../components/CategoryBar';
import SEO from '../components/SEO';

function RefundPolicy() {
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
    '1. Marketplace Model & No Returns',
    '2. General Marketplace Items Policy',
    '3. Food Ordering & Non-Returnable Goods',
    '4. Artisan Service Bookings',
    '5. Payment Processing & Refund Eligibility',
    '6. How to Request Assistance',
  ];

  return (
    <MainLayout>
      <SEO
        title="Returns & Refund Policy"
        description="Learn about return policies, non-returnable items, and refund eligibility on NEDZL."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Returns & Refund Policy',
          url: window.location.href,
        }}
      />
      <CategoryBar />
      <div className="w-full flex flex-col gap-y-1 bg-[#F2FEF0] min-h-[250px] md:h-[350px] py-10 items-center justify-center">
        <span className="text-2xl md:text-[40px] font-bold text-primary-300">Returns & Refund Policy</span>
        <p className="text-[#555555] text-center text-[15px] md:text-[16px] font-medium px-6">
          Important policy information regarding returns, cancellations, and payment refunds across NEDZL services.
        </p>
        <span className="text-[#117D06] text-[15px] md:text-[16px] font-medium">Updated: August 10, 2026</span>
      </div>
      <div className="w-full max-w-[1400px] mx-auto p-6 md:px-20 md:py-16 flex flex-col md:flex-row items-start justify-between gap-x-12 relative">
        {/* Sticky Sidebar */}
        <div className="w-full md:w-[35%] lg:w-[30%] md:sticky md:top-24 mb-10 md:mb-0">
          <div className="bg-white border border-[#E9E9E9] rounded-[16px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <span className="font-inter text-[18px] font-bold text-[#333333] mb-2 block">Navigation</span>
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
            <h2 className="text-lg font-bold text-[#333333]">1. Marketplace Model & No Returns Disclaimer</h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              NEDZL (“we”, “our”, “us”) functions solely as a peer-to-peer marketplace and service platform connecting independent buyers, sellers, food vendors, and artisans. <strong>NEDZL does not sell, manufacture, warehouse, deliver, or handle physical marketplace goods directly. Consequently, NEDZL does not accept returned items or process physical exchanges.</strong>
            </p>
          </section>

          <section id="section-2" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">2. General Marketplace Items Policy</h2>
            <ul className="flex flex-col gap-y-2 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                All transactions for marketplace goods (such as used electronics, fashion, household items) are directly between the buyer and the seller.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                <strong>No Item Returns to NEDZL:</strong> Because NEDZL is not the seller or courier, buyers cannot ship or return physical items to NEDZL.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Buyers are strongly advised to inspect goods thoroughly upon delivery or local pickup before finalizing agreements with sellers.
              </li>
            </ul>
          </section>

          <section id="section-3" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">3. Food Ordering & Non-Returnable Goods</h2>
            <ul className="flex flex-col gap-y-2 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Food items and perishable goods ordered via NEDZL Meals are strictly non-returnable due to health and safety regulations.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                NEDZL processes digital payments for food orders to ensure quick transaction convenience. The food vendor handles preparation and dispatch.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                If a meal is unfulfilled, severely delayed, or incorrect, refund requests are reviewed on a case-by-case basis by NEDZL support in communication with the vendor.
              </li>
            </ul>
          </section>

          <section id="section-4" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">4. Artisan Service Bookings</h2>
            <ul className="flex flex-col gap-y-2 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Payments made for artisan service bookings are processed digitally.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                If an artisan fails to show up for a scheduled appointment or cancels the service prior to completion, the user may request a full refund of the booking payment.
              </li>
            </ul>
          </section>

          <section id="section-5" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">5. Payment Processing & Refund Eligibility</h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              Monetary refunds are evaluated strictly under the following conditions:
            </p>
            <ul className="flex flex-col gap-y-2 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Duplicate billing or payment gateway processing errors.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Verified non-fulfillment of a food order by the vendor.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Verified cancellation or non-performance by an artisan after booking payment.
              </li>
            </ul>
          </section>

          <section id="section-6" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">6. How to Request Assistance</h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              To submit a payment inquiry or request refund investigation for unfulfilled food or service orders, please contact our support team within 48 hours of the transaction:
            </p>
            <div className="flex flex-col gap-y-2 pt-2">
              <p className="text-[16px] leading-[1.7] text-[#555555]">
                Email:{' '}
                <a href="mailto:Nedzlworld@gmail.com" className="text-primary-300 hover:underline font-semibold">
                  Nedzlworld@gmail.com
                </a>
              </p>
              <p className="text-[16px] leading-[1.7] text-[#555555]">Phone: +234 704 924 0913</p>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

export default RefundPolicy;
