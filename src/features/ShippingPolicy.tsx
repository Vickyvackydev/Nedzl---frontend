import { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import CategoryBar from '../components/CategoryBar';
import SEO from '../components/SEO';

function ShippingPolicy() {
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
    '1. Marketplace Model Overview',
    '2. General Marketplace Items Shipping',
    '3. Food Ordering & Vendor Fulfillment',
    '4. Artisan & Professional Services',
    '5. Delivery Fees & Timelines',
    '6. Issues & Contact Information',
  ];

  return (
    <MainLayout>
      <SEO
        title="Shipping & Delivery Policy"
        description="Learn how shipping, logistics, and vendor fulfillment work on NEDZL."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Shipping Policy',
          url: window.location.href,
        }}
      />
      <CategoryBar />
      <div className="w-full flex flex-col gap-y-1 bg-[#F2FEF0] min-h-[250px] md:h-[350px] py-10 items-center justify-center">
        <span className="text-2xl md:text-[40px] font-bold text-primary-300">Shipping & Delivery Policy</span>
        <p className="text-[#555555] text-center text-[15px] md:text-[16px] font-medium px-6">
          Understand how delivery and fulfillment are handled across marketplace goods, food orders, and artisan services.
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
            <h2 className="text-lg font-bold text-[#333333]">1. Marketplace Model Overview</h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              NEDZL (“we”, “our”, “us”) is a digital marketplace platform connecting independent buyers, sellers, food vendors, and service artisans. <strong>NEDZL does not store, inventory, package, ship, or directly deliver physical products or food items to customers.</strong>
            </p>
          </section>

          <section id="section-2" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">2. General Marketplace Items Shipping</h2>
            <ul className="flex flex-col gap-y-2 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                All shipping, delivery, or local pickup arrangements for items listed on the general marketplace are arranged directly between the buyer and the seller.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Sellers are solely responsible for accurately describing delivery methods, dispatch times, and any applicable delivery charges in their product listings.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                NEDZL is not responsible for transit delays, lost packages, or damaged goods resulting from third-party logistics or direct seller delivery.
              </li>
            </ul>
          </section>

          <section id="section-3" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">3. Food Ordering & Vendor Fulfillment</h2>
            <ul className="flex flex-col gap-y-2 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                For food ordering services on NEDZL Meals, NEDZL processes secure online payments to facilitate quick and convenient ordering.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                <strong>Fulfillment Responsibility:</strong> The food vendor (restaurant, chef, or food kitchen) is solely responsible for meal preparation, hygienic packaging, and coordinating delivery or pickup directly to the customer.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Any delivery fee stated at checkout is collected on behalf of the vendor or their designated dispatch service.
              </li>
            </ul>
          </section>

          <section id="section-4" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">4. Artisan & Professional Services</h2>
            <ul className="flex flex-col gap-y-2 list-disc pl-6">
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Artisan services (e.g., repairs, beauty, cleaning, skilled labor) do not involve physical shipping.
              </li>
              <li className="text-[16px] leading-[1.7] text-[#555555]">
                Service appointments are carried out on-site at the location specified during booking or agreed upon directly between the customer and the artisan.
              </li>
            </ul>
          </section>

          <section id="section-5" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">5. Delivery Fees & Timelines</h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              Delivery times and charges vary based on location, vendor dispatch capabilities, and item size. Estimated delivery windows provided on product or meal listings are managed by the individual vendors and are not guaranteed by NEDZL.
            </p>
          </section>

          <section id="section-6" className="flex flex-col gap-y-3 scroll-mt-28">
            <h2 className="text-lg font-bold text-[#333333]">6. Issues & Contact Information</h2>
            <p className="text-[16px] leading-[1.7] text-[#555555]">
              If you experience issues with an unfulfilled order or dispatch delay, please reach out to the vendor directly using their listed contact information or reach out to NEDZL support:
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

export default ShippingPolicy;
