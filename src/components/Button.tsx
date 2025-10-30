import { ButtonTypeProps } from "../types";
import { PreloaderIcon } from "./Preloader";

function Button(props: ButtonTypeProps) {
  return (
    <button
      type={props.type}
      className={`${props.btnStyles} flex items-center justify-center relative`}
      onClick={props.handleClick}
      disabled={props.loading || props.disabled}
    >
      {props.loading ? (
        <div className="flex space-x-1">
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
      ) : (
        <span className={`${props.textStyle}`}>{props.title}</span>
      )}
    </button>
  );
}

export default Button;
