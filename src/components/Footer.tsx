import { Link } from "react-router-dom";
import {
  DISCORD,
  FACEBOOK,
  FEND_FOOTER_LOGO,
  INSTAGRAM,
  NEDZL_LOGO_GREEN,
  TWITTER,
} from "../assets";
import { footer } from "../constant";
import Button from "./Button";

const FooterLinks = ({
  title,
  links,
}: {
  title: string;
  links: Array<{ title: string; link: string }>;
}) => (
  <div className="flex flex-col gap-y-5">
    <span className="text-global-green font-semibold text-[16px]">{title}</span>
    <ul className="flex flex-col gap-y-5">
      {links.map((item) => (
        <Link to={item.link} className="text-sm font-normal text-white">
          {item.title}
        </Link>
      ))}
    </ul>
  </div>
);
function Footer() {
  return (
    <div className="w-full h-full bg-[#121212] border-t-[14px] px-20 pt-20 pb-5 border-global-green">
      <div className="w-full flex items-start justify-between gap-20">
        <div className="w-full flex flex-col items-start gap-y-20">
          <img
            src={NEDZL_LOGO_GREEN}
            className="w-[130px] h-[33.41px]"
            alt=""
          />

          <div className="w-full flex items-start justify-between">
            <FooterLinks title={footer[0].title} links={footer[0].links} />
            <FooterLinks title={footer[1].title} links={footer[1].links} />
            <FooterLinks title={footer[2].title} links={footer[2].links} />
          </div>
        </div>
        <div className="w-[65%] flex flex-col gap-y-10 items-start">
          <span className="text-white font-normal">
            Our mission is to connect students and communities with an easy,
            secure, and reliable marketplace for buying and selling everyday
            essentials.
          </span>
          <div className="flex flex-col gap-y-3">
            <span className="text-global-green font-semibold text-[16px]">
              Join us on
            </span>
            <div className="flex items-center gap-x-7">
              {[FACEBOOK, INSTAGRAM, TWITTER, DISCORD].map((img) => (
                <img src={img} className="w-[24px] h-[24px]" alt="" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-y-3">
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
