import MainLayout from "../layout/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import SEO from "../components/SEO";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <MainLayout>
      <SEO title="Page Not Found" noindex={true} />
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <h1 className="text-9xl font-bold text-global-green">404</h1>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            Page Not Found
          </h2>
          <p className="text-gray-600 max-w-md">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>
        <Link to="/">
          <Button
            title="Go Home"
            textStyle="text-white"
            btnStyles="bg-global-green px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            handleClick={() => navigate("/")}
          />
        </Link>
      </div>
    </MainLayout>
  );
};

export default NotFound;
