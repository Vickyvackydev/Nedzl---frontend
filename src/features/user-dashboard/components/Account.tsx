import { EDIT_PROFILE, GREEN_USER } from "../../../assets";
import SelectInput from "../../../components/SelectInput";
import Button from "../../../components/Button";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile, updateUser } from "../../../services/auth.service";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserId } from "../../../state/slices/globalReducer";

function Account() {
  const {
    data: userProfile,
    // isLoading,
    refetch,
  } = useQuery({ queryKey: ["profile"], queryFn: getUserProfile });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const fileUploadInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const [fields, setFields] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    location: "",
  });

  const user = userProfile?.data?.user;

  useEffect(() => {
    if (userProfile) {
      setFields((prev) => ({
        ...prev,
        first_name: user?.user_name?.split(" ")?.[0],
        last_name: user?.user_name?.split(" ")?.[1],
        email: user?.email,
        location: user?.location || "",
        phone_number: user?.phone_number,
      }));
    }
  }, [userProfile]);

  const handleUpdateProfile = async () => {
    setLoading(true);

    const formData = new FormData();

    formData.append("user_name", `${fields.first_name} ${fields.last_name}`);
    formData.append("email", fields.email);
    formData.append("location", fields.location);
    formData.append("phone_number", fields.phone_number);
    formData.append("image_url", image as Blob);

    try {
      const response = await updateUser(formData);
      if (response) {
        toast.success(response?.message);
        refetch();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile) {
      dispatch(setUserId(userProfile?.user?.id));
    }
  }, [userProfile]);

  return (
    <div className="w-full flex items-center flex-col justify-center py-10">
      <div className="w-[100px] h-[100px] rounded-full border relative bg-[#07B4630D] flex justify-center items-center border-dotted border-global-green">
        <img
          src={
            image
              ? URL.createObjectURL(image)
              : user?.image_url
              ? user?.image_url
              : GREEN_USER
          }
          className={clsx(
            user?.image_url || image
              ? "w-full h-full rounded-full object-cover"
              : "w-[20px] h-[20px]"
          )}
          alt=""
        />
        <img
          src={EDIT_PROFILE}
          onClick={() => fileUploadInputRef.current?.click()}
          className="w-[24px] h-[24px] cursor-pointer absolute right-0 bottom-2"
          alt=""
        />

        <input
          ref={fileUploadInputRef}
          type="file"
          accept="*image/"
          className="sr-only"
          onChange={(e) => {
            e.preventDefault();
            const file = e.target.files?.[0];
            if (file) {
              setImage(file);
            }
          }}
        />
      </div>
      <div className="w-full grid grid-cols-2 gap-x-3 gap-y-5 mt-5 px-4">
        <SelectInput
          label="First Name"
          isInput
          value={fields.first_name}
          onChange={(val) => setFields({ ...fields, first_name: val })}
        />

        <SelectInput
          label="Last Name"
          isInput
          value={fields.last_name}
          onChange={(val) => setFields({ ...fields, last_name: val })}
        />
        <SelectInput
          label="Email Address"
          isInput
          value={fields.email}
          onChange={(val) => setFields({ ...fields, email: val })}
        />
        <SelectInput
          label="Phone Number"
          isInput
          value={fields.phone_number}
          onChange={(val) => setFields({ ...fields, phone_number: val })}
        />
        <SelectInput
          label="Location (Optional)"
          isInput
          value={fields.location}
          onChange={(val) => setFields({ ...fields, location: val })}
        />
      </div>
      <div className="w-full flex justify-end items-end px-4">
        <Button
          title="Update"
          loading={loading}
          disabled={loading}
          btnStyles="bg-global-green rounded-xl px-5 h-[40px] px-4"
          textStyle="text-[#FAFAFA] font-medium text-sm"
          handleClick={handleUpdateProfile}
        />
      </div>
    </div>
  );
}

export default Account;
