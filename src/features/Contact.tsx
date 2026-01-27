import MainLayout from '../layout/MainLayout';
import CategoryBar from '../components/CategoryBar';
import { PHONE_CONTACT, SVG_CONTACT, SVG_LOCATION } from '../assets';
import React, { useState } from 'react';
import { createContact } from '../services/contact.service';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const [formField, setFormField] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormField({
      ...formField,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formField.first_name ||
      !formField.last_name ||
      !formField.phone_number ||
      !formField.email ||
      !formField.message
    ) {
      return;
    }
    setLoading(true);
    try {
      const response = await createContact(formField);
      if (response) {
        toast.success('Message sent successfully');
        setFormField({
          first_name: '',
          last_name: '',
          phone_number: '',
          email: '',
          message: '',
        });
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };
  return (
    <MainLayout>
      <SEO
        title="Contact"
        description="Get in touch with Nedzl. Contact support and reach our team."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact Nedzl',
          url: window.location.href,
        }}
      />
      <CategoryBar />
      <div className="w-full bg-white font-inter">
        <div className="max-w-[1400px] mx-auto px-6 md:px-20 py-16">
          <div className="flex flex-col lg:flex-row gap-12 items-stretch">
            {/* Left Sidebar Info Card */}
            <div className="lg:w-[366px] bg-[#07B463] lg:h-[383px] h-full rounded-lg p-10 text-white flex flex-col gap-y-5">
              <div className="flex items-start gap-x-5">
                <img src={SVG_LOCATION} className="w-[40px] h-[40px]" alt="" />
                <div className="flex flex-col gap-y-2">
                  <h3 className="text-[16px] font-bold">Our Location</h3>
                  <p className="text-white/90 text-[15px] leading-relaxed">
                    Plot 12, University of Nigeria, Nsukka, Enugu State, Nigeria
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-x-5">
                <img src={SVG_CONTACT} className="w-[40px] h-[40px]" alt="" />
                <div className="flex flex-col gap-y-2">
                  <h3 className="text-[16px] font-bold">Quick Contact</h3>
                  <div className="flex flex-col text-white/90 text-[15px]">
                    <a href="mailto:Nedzlworld@gmail.com" className="hover:underline">
                      Email: Nedzlworld@gmail.com
                    </a>
                    <a href="mailto:Nedzlworld@gmail.com" className="hover:underline">
                      Support: Nedzlworld@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-x-5">
                <img src={PHONE_CONTACT} className="w-[40px] h-[40px]" alt="" />
                <div className="flex flex-col gap-y-2">
                  <h3 className="text-[16px] font-bold">+234 704 924 0913</h3>
                  <p className="text-white/90 text-[15px] leading-relaxed">
                    We will get back to you within 24 hours, or call us every day, 09:00 AM – 06:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="flex-1 bg-white rounded-[24px] p-5 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
              <div className="mb-10">
                <h2 className="text-[24px] font-bold text-[#1A1A1A] mb-2">Contact Us</h2>
                <p className="text-[#9B9B9B] text-[14px]">Have any questions?</p>
              </div>

              <form className="flex flex-col gap-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-y-2">
                    <label className="text-[14px] font-semibold text-primary-300">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      onChange={handleChange}
                      value={formField.first_name}
                      placeholder="Enter your first name"
                      required
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#27D019] focus:outline-none transition-colors placeholder:text-gray-400 text-[15px]"
                    />
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <label className="text-[14px] font-semibold text-primary-300">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      onChange={handleChange}
                      required
                      value={formField.last_name}
                      placeholder="Enter your last name"
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#27D019] focus:outline-none transition-colors placeholder:text-gray-400 text-[15px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-y-2">
                    <label className="text-[14px] font-semibold text-primary-300">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      onChange={handleChange}
                      required
                      value={formField.email}
                      placeholder="Enter your email address"
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#27D019] focus:outline-none transition-colors placeholder:text-gray-400 text-[15px]"
                    />
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <label className="text-[14px] font-semibold text-primary-300">Phone Number</label>
                    <div className="flex gap-x-3">
                      <div className="flex items-center gap-x-2 px-4 py-4 rounded-xl border border-gray-200 bg-gray-50 shrink-0">
                        <img src="https://flagcdn.com/w20/ng.png" alt="NG" className="w-5" />
                        {/* <span className="text-[15px] text-gray-600">▼</span> */}
                      </div>
                      <input
                        type="tel"
                        name="phone_number"
                        onChange={handleChange}
                        required
                        value={formField.phone_number}
                        placeholder="Enter phone number"
                        className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#27D019] focus:outline-none transition-colors placeholder:text-gray-400 text-[15px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-y-2">
                  <label className="text-[14px] font-semibold text-primary-300">Message</label>
                  <textarea
                    rows={4}
                    name="message"
                    onChange={handleChange}
                    required
                    value={formField.message}
                    placeholder="We value your feedback. Please provide your details to help us enhance our services"
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#27D019] focus:outline-none transition-colors placeholder:text-gray-400 text-[15px] resize-none"
                  />
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-global-green hover:bg-[#22b515] disabled:bg-gray-200 disabled:cursor-not-allowed text-white px-10 py-4 rounded-lg font-bold transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Please wait...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="w-full h-[500px] mt-8 bg-gray-100">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15844.606869542457!2d7.399676774643328!3d6.860473857361664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1044e6366014e7a3%3A0xe5a363a0335e2365!2sUniversity%20of%20Nigeria%2C%20Nsukka!5e0!3m2!1sen!2sng!4v1704100000000!5m2!1sen!2sng"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
