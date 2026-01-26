import { MISSION, QUOTE_UP, VISION } from '../assets';
import CategoryBar from '../components/CategoryBar';
import MainLayout from '../layout/MainLayout';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const About = () => {
  return (
    <MainLayout>
      <SEO
        title="About"
        description="Learn about Nedzl – a trusted marketplace connecting students and communities across Nigeria."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About Nedzl',
          url: window.location.href,
        }}
      />
      <CategoryBar />
      <div className="w-full h-full px-4 md:px-20 py-10 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center flex-col gap-y-3"
        >
          <h1 className="text-3xl md:text-[52px] font-bold text-[#303237] text-center leading-tight">
            Who We Are and <span className="text-global-green">What We Do</span>
          </h1>
          <p className="text-[#565C69] font-normal text-center text-base md:text-xl max-w-4xl">
            We make buying and selling everyday essentials simple, secure, and accessible. Nedzl is an online
            marketplace built to connect students and communities, helping people trade quality items with ease.
          </p>
        </motion.div>

        <div className="w-full flex flex-col md:flex-row items-stretch mt-16 md:mt-24 gap-8 md:gap-5">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full md:w-[50%] py-10 md:py-16 px-6 md:px-16 flex flex-col relative gap-y-2 bg-[#F2FAFC] rounded-2xl justify-center"
          >
            <img
              src={QUOTE_UP}
              className="w-8 md:w-[40px] absolute lg:top-5 md:top-5 top-3 left-5 h-8 md:h-[40px]"
              alt=""
            />
            <div className="flex items-start flex-col gap-y-3">
              <span className="text-[#303237] font-semibold leading-tight text-2xl md:text-[40px]">
                From a bold idea to a thriving community marketplace.
              </span>
              <span className="text-[#565C69] font-normal italic text-lg md:text-2xl">Victor Obioma - CEO</span>
            </div>

            <img
              src={QUOTE_UP}
              className="w-8 md:w-[40px] scale-y-[-1] scale-x-[-1] absolute right-5 bottom-5 h-8 md:h-[40px]"
              alt=""
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full md:w-[50%] flex flex-col gap-y-6 justify-center"
          >
            <p className="text-[#565C69] font-medium text-sm md:text-[16px] leading-relaxed">
              In 2025, Nedzl was founded with a vision to create a platform where students and communities could buy and
              sell everyday items easily. We noticed the challenges students faced when trying to resell items they no
              longer needed or when searching for affordable alternatives.
            </p>

            <p className="text-[#565C69] font-medium text-sm md:text-[16px] leading-relaxed">
              Our mission became clear — to build a safe, reliable, and inclusive marketplace where buyers and sellers
              can connect directly.
            </p>
            <p className="text-[#565C69] font-medium text-sm md:text-[16px] leading-relaxed">
              Though we are young, Nedzl is driven by a bold vision: to grow beyond a campus-focused project into a
              community-driven platform that empowers individuals and small businesses to reach a wider audience. Every
              day, we work to redefine how people access essential goods, ensuring that trading is affordable,
              transparent, and trustworthy.
            </p>
          </motion.div>
        </div>
        <div className="w-full flex flex-col md:flex-row items-stretch mt-16 md:mt-24 gap-5 mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full rounded-2xl bg-[#F1FFF8] p-6 md:p-8 flex flex-col gap-y-4"
          >
            <div className="bg-white/50 w-fit p-3 rounded-xl">
              <img src={VISION} className="w-8 h-8" alt="" />
            </div>
            <span className="text-[#303237] text-xl font-bold">Our Vision</span>
            <p className="text-[#565C69] font-medium text-sm md:text-[16px] leading-relaxed">
              To build Africa’s most trusted peer-to-peer marketplace, where students and communities can easily
              exchange everyday essentials and unlock value from what they already own.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full rounded-2xl bg-[#FEECEA] p-6 md:p-8 flex flex-col gap-y-4"
          >
            <div className="bg-white/50 w-fit p-3 rounded-xl">
              <img src={MISSION} className="w-8 h-8" alt="" />
            </div>
            <span className="text-[#303237] text-xl font-bold">Our Mission</span>
            <p className="text-[#565C69] font-medium text-sm md:text-[16px] leading-relaxed">
              To simplify buying and selling for everyone. We aim to provide a safe, affordable, and transparent
              platform that empowers people to save money, earn income, and strengthen community connections.
            </p>
          </motion.div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex items-center py-16 md:py-24 px-4 md:px-20 w-full justify-center bg-[#121212] flex-col gap-y-4"
      >
        <h1 className="text-3xl md:text-[40px] font-bold text-white">What We Stand For</h1>
        <p className="text-gray-300 font-normal text-center text-sm md:text-base max-w-3xl leading-relaxed">
          At the core of Nedzl is a commitment to trust, community, and innovation. We believe that access to essential
          goods should be affordable, and that technology can bring people together to support one another. Our
          operations are guided by transparency, integrity, and the drive to create meaningful impact in everyday lives.
        </p>
      </motion.div>
    </MainLayout>
  );
};

export default About;
