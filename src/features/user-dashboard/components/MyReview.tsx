// import React from "react";

import { useQuery } from "@tanstack/react-query";
import { getUserReviews } from "../../../services/reviews.service";
import Button from "../../../components/Button";
import { NO_CHAT } from "../../../assets";
import { useNavigate } from "react-router-dom";
import { ReviewResponseType } from "../../../types";
import { formatTimeElapsed } from "../../../utils";
import { LoadingState } from "../../ProductDetails";

function MyReview() {
  const navigate = useNavigate();
  const { data: myReviews, isLoading } = useQuery({
    queryKey: ["my-review"],
    queryFn: () => getUserReviews(),
  });

  return (
    <div className="w-full h-full">
      {myReviews?.data?.length > 0 ? (
        <div className="w-full flex flex-col gap-y-3 p-4">
          {myReviews?.data?.map((review: ReviewResponseType) => (
            <div className="w-full border border-borderColor p-3 rounded-xl flex flex-col gap-2">
              <span className="text-primary-50 font-medium text-xs">
                {formatTimeElapsed(review?.created_at)}
              </span>
              <span className="text-[16px] font-semibold text-primary-300">
                {review?.review_title}
              </span>
              <p className="text-sm font-normal text-primary-300">
                {review?.review}
              </p>

              <div className="w-full gap-x-2 flex items-center justify-start border border-borderColor p-2.5 rounded-xl">
                <img
                  src={review?.product_details?.image_urls?.[0]}
                  className="w-[50px] h-[50px] rounded object-cover"
                  alt=""
                />
                <span className="text-[16px] font-semibold text-primary-300">
                  {review?.product_details?.product_name}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : isLoading ? (
        <LoadingState />
      ) : (
        <div className="w-full flex flex-col items-center gap-y-2 justify-center h-[70vh]">
          <img src={NO_CHAT} className="w-[90.1px] h-[100px]" alt="" />
          <span className="text-xl font-semibold text-black text-center">
            You haven’t written any reviews yet
          </span>
          <span className="text-[#555555] font-normal text-sm w-[417px] text-center">
            Share your experience with products you’ve purchased to help other
            buyers make better choices. Click below to start shopping and leave
            your first review.
          </span>
          <Button
            title="Continue to Shopping"
            textStyle="text-white font-medium text-sm"
            handleClick={() => navigate("/")}
            btnStyles="w-fit px-5 py-3 rounded-xl bg-global-green"
          />
        </div>
      )}
    </div>
  );
}

export default MyReview;
