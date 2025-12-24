import { Link } from "react-router-dom";
import { NEDZL_LOGO_WHITE, OPTIMIZED } from "../assets";

function AuthLayout({ children }: { children: React.ReactNode }) {
  // const location = useLocation();
  // const { pathname } = location;

  return (
    <main className="w-full flex items-start h-screen overflow-hidden">
      <div className="lg:w-[650px] h-full relative  lg:flex hidden items-start flex-col gap-y-16">
        <Link to={"/"} className="w-full absolute py-10 px-4">
          <img
            src={NEDZL_LOGO_WHITE}
            alt=""
            className="w-[130px] h-[33.41px] object-contain cursor-pointer"
            onClick={() =>
              setTimeout(() => {
                window.location.reload();
              }, 500)
            }
          />
        </Link>
        <img src={OPTIMIZED} className="h-full w-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 pointer-events-none" />
        <div className="absolute bottom-10 left-0 px-8 flex flex-col gap-y-3">
          <h2 className="text-white text-3xl font-bold leading-tight">
            Start Selling Smarter With Nedzl
          </h2>
          <p className="text-white text-base font-normal max-w-[500px]">
            Create your account to begin listing your fairly used items and
            connect with ready buyers around you.
          </p>
          <span className="text-global-green text-lg font-semibold">
            Your hustle, your price – Nedzl makes it happen.
          </span>
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-screen overflow-y-scroll lg:px-16 lg:pt-7 px-5 pt-3  bg-white flex items-center justify-center">
        {children}
      </div>
    </main>
  );
}

export default AuthLayout;
