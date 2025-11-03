import { Link } from "react-router-dom";
import { NEDZL_AUTH_LAYOUT, NEDZL_LOGO_WHITE } from "../assets";

function AuthLayout({ children }: { children: React.ReactNode }) {
  // const location = useLocation();
  // const { pathname } = location;

  return (
    <main className="w-full flex items-start h-full">
      <div className="w-[900px] h-screen relative  lg:flex hidden items-start flex-col gap-y-16">
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
        <img src={NEDZL_AUTH_LAYOUT} className="w-full h-full" alt="" />
      </div>

      <div className="w-full h-screen overflow-y-scroll lg:px-16 lg:pt-7 px-5 pt-3  bg-white flex items-center justify-center">
        {children}
      </div>
    </main>
  );
}

export default AuthLayout;
