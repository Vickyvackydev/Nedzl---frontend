import { useEffect, useState } from "react";

interface PreloaderProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
}

function Preloader({
  isLoading,
  children,
  loadingText = "Loading...",
}: PreloaderProps) {
  const [showPreloader, setShowPreloader] = useState(isLoading);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsAnimatingOut(true);
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setShowPreloader(false);
        setIsAnimatingOut(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowPreloader(true);
      setIsAnimatingOut(false);
    }
  }, [isLoading]);

  if (!showPreloader) {
    return <>{children}</>;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${
        isAnimatingOut
          ? "animate-preloader-fade-out"
          : "animate-preloader-fade-in"
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          {/* Main icon with pulse animation */}
          <div className="w-20 h-20 animate-preloader-pulse">
            <PreloaderIcon />
          </div>

          {/* Spinning overlay for extra effect */}
          <div className="absolute inset-0 w-20 h-20 animate-preloader-spin">
            <div className="w-full h-full opacity-20">
              <PreloaderIcon />
            </div>
          </div>

          {/* Bouncing dots indicator */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1">
            <div
              className="w-2 h-2 bg-white rounded-full animate-preloader-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-white rounded-full animate-preloader-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-white rounded-full animate-preloader-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>

        <div className="text-white text-lg font-medium animate-preloader-pulse">
          {loadingText}
        </div>
      </div>
    </div>
  );
}

export default Preloader;

export const PreloaderIcon = () => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M17.3519 11.9274L9.51923 3.62361L8.26475 2.29353H6.45561H0V2.93991V17.5423V26.8025V33.2581H6.45561V26.8025V24.386V23.4789V14.9782V9.78359L9.51923 13.0314L12.9148 16.6314L17.3519 21.3351L21.7889 16.6314L22.3207 16.0675L28.776 9.22387V8.54018L29.1237 8.8553L31.0657 10.6156L32.9947 12.364L33.1743 8.37985L33.3553 4.36941L33.449 2.29353L33.5523 3.05176e-05L28.776 0.380395L28.2007 0.426135L22.3207 0.894128V2.29353V2.68834L24.34 4.51891L22.3207 6.65978L17.3519 11.9274Z"
      fill="#07B463"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M22.321 19.8864V26.6027L22.5095 26.8025H22.321H17.6097L16.7034 25.8417L14.9022 23.9324L10.4651 19.2284L9.51953 18.226V20.2311V26.8025V27.6338L10.4651 28.6364L12.2661 30.5457L14.8247 33.2581H22.321H23.6989H28.5989H28.7763V26.8025V24.0386V13.0427L23.5904 18.5407L22.321 19.8864Z"
      fill="#07B463"
    />
  </svg>
);
