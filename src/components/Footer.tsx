import { Link } from "react-router-dom";
import {
  FACEBOOK,
  // FEND_FOOTER_LOGO,
  INSTAGRAM,
  NEDZL_LOGO_GREEN,
  TIKTOK,
  TWITTER,
} from "../assets";
import { footer } from "../constant";
import Button from "./Button";

const FooterLinks = ({
  title,
  links,
  className,
}: {
  title: string;
  links: Array<{ title: string; link: string }>;
  className?: string; // Added className prop
}) => (
  <div className={`flex flex-col gap-y-5 ${className}`}>
    <span className="text-global-green font-semibold text-[16px]">{title}</span>
    <ul className="flex flex-col gap-y-5">
      {links.map((item) => (
        <Link
          key={item.title} // Added key
          to={item.link}
          className="text-sm font-normal text-white"
        >
          {item.title}
        </Link>
      ))}
    </ul>
  </div>
);

function Footer() {
  return (
    <div className="w-full h-full bg-[#121212] border-t-[14px] px-4 md:px-20 pt-10 md:pt-20 pb-5 border-global-green">
      <div className="w-full grid grid-cols-2 gap-x-4 gap-y-8 md:flex md:flex-row items-start justify-between md:gap-20">
        {/* LEFT COLUMN WRAPPER */}
        <div className="contents md:flex md:w-full md:flex-col items-start md:gap-y-20">
          <Link to={"/"}>
            <img
              src={NEDZL_LOGO_GREEN}
              className="w-[130px] h-[33.41px] col-span-2 order-1 md:order-none"
              alt=""
            />
          </Link>

          {/* This wrapper also needs to be 'contents' on mobile so its children participate in the main grid */}
          <div className="contents md:w-full md:flex md:flex-row items-start justify-between md:gap-y-0">
            <FooterLinks
              title={footer[0].title}
              links={footer[0].links}
              className="col-span-1 order-3 md:order-none"
            />
            <FooterLinks
              title={footer[1].title}
              links={footer[1].links}
              className="col-span-1 order-4 md:order-none"
            />
            <FooterLinks
              title={footer[2].title}
              links={footer[2].links}
              className="col-span-1 order-5 md:order-none"
            />
          </div>
        </div>

        {/* RIGHT COLUMN WRAPPER */}
        <div className="contents md:w-[65%] md:flex md:flex-col md:gap-y-10 items-start">
          <span className="text-white font-normal col-span-2 order-2 md:order-none">
            Our mission is to connect students and communities with an easy,
            secure, and reliable marketplace for buying and selling everyday
            essentials.
          </span>
          <div className="flex flex-col gap-y-3 col-span-1 order-6 md:order-none">
            <span className="text-global-green font-semibold text-[16px]">
              Join us on
            </span>
            <div className="flex items-center lg:gap-x-7 gap-x-4">
              {[
                {
                  icon: FACEBOOK,
                  link: "https://www.facebook.com/profile.php?id=61585694382803",
                },
                {
                  icon: INSTAGRAM,
                  link: "https://www.instagram.com/nedzlworld?igsh=azdqN2FiczNjbGFt",
                },
                { icon: TWITTER, link: "" },
                {
                  icon: TIKTOK,
                  link: "https://www.tiktok.com/@nedzl_?_r=1&_t=ZS-939GyJuQQ5a",
                },
              ].map((item, index) => (
                <Link to={item.link}>
                  <img
                    key={index}
                    src={item.icon}
                    className="w-[24px] h-[24px]"
                    alt=""
                  />
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-y-3 col-span-2 order-7 md:order-none">
            <span className="text-global-green font-semibold text-[16px]">
              Stay Updated
            </span>
            <span className="text-white font-normal">
              Sign up for our newsletter to get the latest news and special
              offers from NEDZL.
            </span>
            <div className="flex items-center p-0.5 glass-bg border border-[#565C69] bg-[#FFFFFF0D] w-full justify-between h-[48px] rounded-lg">
              <input
                type="text"
                placeholder="Enter your email"
                className="w-full bg-transparent ml-5 outline-none text-[#F4F5F8] font-normal text-sm"
              />
              <Button
                title={"Subscribe"}
                handleClick={() => {}}
                btnStyles={"w-fit px-5 h-full bg-global-green rounded-lg"}
                textStyle={"text-white font-medium"}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-5 mt-10">
        <span className="text-sm font-normal text-white text-center">
          © {new Date().getFullYear()} NEDZL. All rights reserved.
        </span>
      </div>
    </div>
  );
}

export default Footer;
