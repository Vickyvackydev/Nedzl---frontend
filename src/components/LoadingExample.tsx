import { useState } from "react";
import Button from "./Button";
import Preloader from "./Preloader";

function LoadingExample() {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const handleButtonClick = () => {
    setIsButtonLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsButtonLoading(false);
    }, 3000);
  };

  const handlePageLoad = () => {
    setIsPageLoading(true);
    // Simulate page loading
    setTimeout(() => {
      setIsPageLoading(false);
    }, 5000);
  };

  return (
    <Preloader isLoading={isPageLoading} loadingText="Loading your content...">
      <div className="p-8 space-y-6">
        <h1 className="text-2xl font-bold">Loading Examples</h1>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Button Loading State</h2>
          <Button
            type="button"
            title="Click to Load"
            loading={isButtonLoading}
            handleClick={handleButtonClick}
            btnStyles="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            textStyle="text-white font-medium"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Page Preloader</h2>
          <Button
            type="button"
            title="Show Page Preloader"
            handleClick={handlePageLoad}
            btnStyles="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
            textStyle="text-white font-medium"
          />
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Usage Instructions:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Click "Click to Load" to see the button loading state</li>
            <li>Click "Show Page Preloader" to see the full page preloader</li>
            <li>The preloader uses the green M icon with smooth animations</li>
            <li>Both components are fully customizable and reusable</li>
          </ul>
        </div>
      </div>
    </Preloader>
  );
}

export default LoadingExample;
